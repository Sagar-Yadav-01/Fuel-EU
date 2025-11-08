import { IComplianceRepository } from '../ports/IComplianceRepository';
import { IRouteRepository } from '../ports/IRouteRepository';
import { ShipCompliance, Route } from '../domain/models';
import { ENERGY_CONVERSION_FACTOR, FUEL_EU_TARGET_2025 } from '@/shared/constants';

export class ComplianceService {
  constructor(
    private complianceRepo: IComplianceRepository,
    private routeRepo: IRouteRepository,
  ) {}

  /**
   * Calculates the Compliance Balance (CB) for a single route.
   * CB = (Target - Actual) * Energy
   */
  public calculateCbForRoute(route: Route): number {
    const energy = route.fuelConsumption * ENERGY_CONVERSION_FACTOR; // Energy in MJ
    const targetIntensity = FUEL_EU_TARGET_2025;
    const actualIntensity = route.ghgIntensity;

    const cb = (targetIntensity - actualIntensity) * energy;
    return cb; // in gCO2eq
  }

  /**
   * Gets or computes the total Compliance Balance for a ship for a given year.
   */
  public async getOrComputeComplianceBalance(
    shipId: string,
    year: number,
  ): Promise<ShipCompliance> {
    // 1. Check if it's already computed
    const existingCompliance = await this.complianceRepo.findCompliance(shipId, year);
    if (existingCompliance) {
      return existingCompliance;
    }

    // 2. If not, compute it
    // For simplicity, we'll use all routes for that ship/year
    // A real app might have more complex aggregation rules
    const routes = await this.routeRepo.findAllByShipAndYear(shipId, year);
    if (routes.length === 0) {
      // This is a valid state, ship just has no data. Return a zero-balance.
      return this.complianceRepo.upsertCompliance({
        shipId,
        year,
        cb_gco2eq: 0,
        cb_adjusted: 0,
      });
    }

    // 3. Sum CB from all routes
    const totalCb = routes.reduce((sum, route) => {
      return sum + this.calculateCbForRoute(route);
    }, 0);

    // 4. Store and return
    const newCompliance = await this.complianceRepo.upsertCompliance({
      shipId,
      year,
      cb_gco2eq: totalCb,
      cb_adjusted: totalCb, // Initially, adjusted is same as original
    });

    return newCompliance;
  }

  /**
   * Gets the adjusted Compliance Balance after banking.
   */
  public async getAdjustedComplianceBalance(
    shipId: string,
    year: number,
  ): Promise<ShipCompliance> {
    const compliance = await this.getOrComputeComplianceBalance(shipId, year);
    const bankEntries = await this.complianceRepo.findBankEntries(shipId, year);

    const totalBanked = bankEntries.reduce((sum, entry) => sum + entry.amount_gco2eq, 0);
    
    // The 'adjusted' CB is the original CB plus any banking activities
    const adjustedCb = compliance.cb_gco2eq + totalBanked;

    // Update the record
    const updatedCompliance = await this.complianceRepo.upsertCompliance({
      shipId,
      year,
      cb_gco2eq: compliance.cb_gco2eq, // original CB
      cb_adjusted: adjustedCb,
    });

    return updatedCompliance;
  }
}