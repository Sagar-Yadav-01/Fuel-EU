import { IApiService } from "../ports/IApiService";

export class PoolingService {
  constructor(private api: IApiService) {}

  async createPool(year: number, shipIds: string[]) {
    return this.api.createPool(year, shipIds);
  }
}