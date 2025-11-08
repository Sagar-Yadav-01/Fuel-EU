import { IApiService } from "../ports/IApiService";

export class RouteService {
  constructor(private api: IApiService) {}

  async getRoutes() {
    return this.api.getRoutes();
  }

  async setBaseline(routeId: string) {
    return this.api.setBaseline(routeId);
  }

  async getComparison(shipId: string, year: number) {
    return this.api.getComparison(shipId, year);
  }
}