import { IApiService } from "../ports/IApiService";

export class ComplianceService {
  constructor(private api: IApiService) {}

  async getComplianceBalance(shipId: string, year: number) {
    return this.api.getComplianceBalance(shipId, year);
  }

  async getAdjustedCompliance(shipId: string, year: number) {
    return this.api.getAdjustedCompliance(shipId, year);
  }
}