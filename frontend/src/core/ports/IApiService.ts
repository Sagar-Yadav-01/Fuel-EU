import { 
  Route, 
  RouteComparison, 
  ShipCompliance, 
  BankEntry, 
  PoolCreationResult 
} from "@/shared/types";

export interface IApiService {
  getRoutes(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<Route>;
  
  getComparison(shipId: string, year: number): Promise<RouteComparison>;
  
  getComplianceBalance(shipId: string, year: number): Promise<ShipCompliance>;
  getAdjustedCompliance(shipId: string, year: number): Promise<ShipCompliance>;
  
  getBankRecords(shipId: string, year: number): Promise<BankEntry[]>;
  bankSurplus(shipId: string, year: number, amount: number): Promise<ShipCompliance>;
  applyDeficit(shipId: string, year: number, amount: number): Promise<ShipCompliance>;
  
  createPool(year: number, shipIds: string[]): Promise<PoolCreationResult>;
}