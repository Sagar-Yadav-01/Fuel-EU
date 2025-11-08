import { IApiService } from "../ports/IApiService";

export class BankingService {
  constructor(private api: IApiService) {}

  async getBankRecords(shipId: string, year: number) {
    return this.api.getBankRecords(shipId, year);
  }

  async bankSurplus(shipId: string, year: number, amount: number) {
    return this.api.bankSurplus(shipId, year, amount);
  }

  async applyDeficit(shipId: string, year: number, amount: number) {
    return this.api.applyDeficit(shipId, year, amount);
  }
}