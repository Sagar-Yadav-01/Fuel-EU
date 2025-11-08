import { IApiService } from "@/core/ports/IApiService";
import { 
  Route, 
  RouteComparison, 
  ShipCompliance, 
  BankEntry, 
  PoolCreationResult 
} from "@/shared/types";
import { API_BASE_URL } from "@/shared/constants";
import axios from "axios";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export class ApiService implements IApiService {
  async getRoutes(): Promise<Route[]> {
    const response = await apiClient.get('/routes');
    return response.data;
  }

  async setBaseline(routeId: string): Promise<Route> {
    const response = await apiClient.post(`/routes/${routeId}/baseline`);
    return response.data;
  }

  async getComparison(shipId: string, year: number): Promise<RouteComparison> {
    const response = await apiClient.get('/routes/comparison', { params: { shipId, year } });
    return response.data;
  }

  async getComplianceBalance(shipId: string, year: number): Promise<ShipCompliance> {
    const response = await apiClient.get('/compliance/cb', { params: { shipId, year } });
    return response.data;
  }

  async getAdjustedCompliance(shipId: string, year: number): Promise<ShipCompliance> {
    const response = await apiClient.get('/compliance/adjusted-cb', { params: { shipId, year } });
    return response.data;
  }

  async getBankRecords(shipId: string, year: number): Promise<BankEntry[]> {
    const response = await apiClient.get('/banking/records', { params: { shipId, year } });
    return response.data;
  }

  async bankSurplus(shipId: string, year: number, amount: number): Promise<ShipCompliance> {
    const response = await apiClient.post('/banking/bank', { shipId, year, amount });
    return response.data;
  }

  async applyDeficit(shipId: string, year: number, amount: number): Promise<ShipCompliance> {
    const response = await apiClient.post('/banking/apply', { shipId, year, amount });
    return response.data;
  }

  async createPool(year: number, shipIds: string[]): Promise<PoolCreationResult> {
    const response = await apiClient.post('/pools', { year, shipIds });
    return response.data;
  }
}