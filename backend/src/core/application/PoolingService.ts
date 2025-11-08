import { IPoolRepository } from '../ports/IPoolRepository';
import { ComplianceService } from './ComplianceService';
import { PoolCreationRequest, PoolCreationResult, PoolMember } from '../domain/models';

export class PoolingService {
  constructor(
    private poolRepo: IPoolRepository,
    private complianceService: ComplianceService,
  ) {}

  public async createPool(request: PoolCreationRequest): Promise<PoolCreationResult> {
    const { year, shipIds } = request;

    if (shipIds.length < 2) {
      throw new Error('A pool must have at least two members');
    }

    // 1. Get initial CB for all members
    const initialCompliance = await Promise.all(
      shipIds.map(shipId => 
        this.complianceService.getOrComputeComplianceBalance(shipId, year)
      )
    );

    const membersData = initialCompliance.map(c => ({
      shipId: c.shipId,
      cb_before: c.cb_gco2eq,
      cb_after: c.cb_gco2eq, // Will be modified
    }));

    // 2. Validate ∑CB ≥ 0
    const totalPoolCb = membersData.reduce((sum, m) => sum + m.cb_before, 0);
    const isValid = totalPoolCb >= 0;

    if (!isValid) {
      // Pool is invalid, but we still create it to show the state
      const { pool, members } = await this.poolRepo.createPoolWithMembers({
        year,
        membersData,
      });
      return { pool, members, totalPoolCb, isValid: false };
    }

    // 3. Allocate surplus (Greedy Algorithm)
    let surplusShips = membersData
      .filter(m => m.cb_before > 0)
      .sort((a, b) => b.cb_before - a.cb_before); // Largest surplus first
    
    let deficitShips = membersData
      .filter(m => m.cb_before < 0)
      .sort((a, b) => a.cb_before - b.cb_before); // Largest deficit first

    for (const deficitShip of deficitShips) {
      let deficitToCover = Math.abs(deficitShip.cb_before);

      for (const surplusShip of surplusShips) {
        if (deficitToCover === 0) break; // This deficit is covered
        if (surplusShip.cb_after === 0) continue; // This surplus ship is tapped out

        // Check validation rules
        // Surplus ship cannot exit negative
        const availableSurplus = surplusShip.cb_after;
        
        // Deficit ship cannot exit worse (already guaranteed)
        // Deficit ship just wants to get to 0
        const amountToTransfer = Math.min(deficitToCover, availableSurplus);

        // Perform transfer
        deficitShip.cb_after += amountToTransfer;
        surplusShip.cb_after -= amountToTransfer;
        deficitToCover -= amountToTransfer;
      }
    }
    
    // Final validation just in case
    // Deficit ship cannot exit worse (cb_after > cb_before)
    // Surplus ship cannot exit negative (cb_after >= 0)
    for (const member of membersData) {
      if (member.cb_before < 0 && member.cb_after < member.cb_before) {
        throw new Error(`Validation failed: Deficit ship ${member.shipId} exited worse off.`);
      }
      if (member.cb_before > 0 && member.cb_after < 0) {
        throw new Error(`Validation failed: Surplus ship ${member.shipId} exited with a deficit.`);
      }
    }

    // 4. Save the pool and members with new cb_after
    const { pool, members } = await this.poolRepo.createPoolWithMembers({
      year,
      membersData,
    });

    // 5. Update the ShipCompliance records with the new 'adjusted' balance
    // (In a real app, this would be a more robust transaction)
    for (const member of members) {
      const originalCompliance = initialCompliance.find(c => c.shipId === member.shipId);
      if (originalCompliance) {
        await this.complianceService.complianceRepo.upsertCompliance({
          shipId: member.shipId,
          year: year,
          cb_gco2eq: originalCompliance.cb_gco2eq,
          cb_adjusted: member.cb_after,
        });
      }
    }

    return { pool, members, totalPoolCb, isValid: true };
  }
}