import { IRouteRepository } from '../ports/IRouteRepository';
import { Route, RouteComparison } from '../domain/models';
import { FUEL_EU_TARGET_2025 } from '@/shared/constants';

export class RouteService {
  constructor(private routeRepo: IRouteRepository) {}

  public async getAllRoutes(): Promise<Route[]> {
    return this.routeRepo.findAll();
  }

  public async setBaseline(routeId: string): Promise<Route> {
    return this.routeRepo.setBaseline(routeId);
  }

  /**
   * Gets baseline vs comparison data for a ship and year.
   */
  public async getComparisonData(shipId: string, year: number): Promise<RouteComparison> {
    const baseline = await this.routeRepo.findBaseline(shipId, year);
    const comparisonRoutes = await this.routeRepo.findRoutesForComparison(shipId, year);

    if (!baseline) {
      // No baseline set, just return routes
      return {
        shipId,
        year,
        baseline: null,
        comparisonRoutes: comparisonRoutes.map(r => ({ ...r, percentDiff: 0 })),
        targetIntensity: FUEL_EU_TARGET_2025,
        isCompliant: false, // Cannot be compliant without a baseline
      };
    }

    let isCompliant = true;
    const routesWithDiff = comparisonRoutes.map(route => {
      // percentDiff = ((comparison / baseline) − 1) × 100
      const percentDiff = ((route.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
      
      // Check compliance: actual must be <= target
      if (route.ghgIntensity > FUEL_EU_TARGET_2025) {
        isCompliant = false;
      }

      return { ...route, percentDiff };
    });

    return {
      shipId,
      year,
      baseline,
      comparisonRoutes: routesWithDiff,
      targetIntensity: FUEL_EU_TARGET_2025,
      isCompliant,
    };
  }
}