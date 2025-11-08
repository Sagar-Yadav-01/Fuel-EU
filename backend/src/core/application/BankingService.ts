import { IComplianceRepository } from '../ports/IComplianceRepository';
import { ComplianceService } from './ComplianceService';

export class BankingService {
  constructor(
    private complianceRepo: IComplianceRepository,
    private complianceService: ComplianceService,
  ) {}

  public async getBankingRecords(shipId: string, year: number) {
    return this.complianceRepo.findBankEntries(shipId, year);
  }

  /**
   * Banks a surplus amount.
   */
  public async bankSurplus(shipId: string, year: number, amount: number) {
    if (amount <= 0) {
      throw new Error('Bank amount must be positive');
    }

    const compliance = await this.complianceService.getAdjustedComplianceBalance(shipId, year);
    
    // Check if adjusted CB (current state) has enough surplus
    if (!compliance.cb_adjusted || compliance.cb_adjusted < amount) {
      throw new Error('Insufficient surplus to bank');
    }

    // Create a "bank" entry (positive amount)
    const bankEntry = await this.complianceRepo.createBankEntry({
      shipId,
      year,
      amount_gco2eq: amount,
      type: 'bank',
    });

    // Re-calculate adjusted CB
    return this.complianceService.getAdjustedComplianceBalance(shipId, year);
  }

  /**
   * Applies a banked amount to cover a deficit.
   */
  public async applyDeficit(shipId: string, year: number, amount: number) {
    if (amount <= 0) {
      throw new Error('Apply amount must be positive');
    }

    const compliance = await this.complianceService.getAdjustedComplianceBalance(shipId, year);

    // Check if ship actually has a deficit
    if (!compliance.cb_adjusted || compliance.cb_adjusted >= 0) {
      throw new Error('No deficit to apply against');
    }
    
    // Check if the amount to apply exceeds the deficit
    const deficit = Math.abs(compliance.cb_adjusted);
    if (amount > deficit) {
      throw new Error(`Amount (${amount}) exceeds deficit (${deficit})`);
    }

    // TODO: Check if company has enough *banked* surplus from previous years.
    // This demo assumes they have it.

    // Create an "apply" entry (negative amount)
    const bankEntry = await this.complianceRepo.createBankEntry({
      shipId,
      year,
      amount_gco2eq: -amount, // Applying *reduces* the "banked" amount
      type: 'apply',
    });

    // Re-calculate adjusted CB
    return this.complianceService.getAdjustedComplianceBalance(shipId, year);
  }
}