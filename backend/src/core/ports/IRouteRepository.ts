import { Route } from '../domain/models';

export interface IRouteRepository {
  findAll(): Promise<Route[]>;
  findByRouteId(routeId: string): Promise<Route | null>;
  setBaseline(routeId: string): Promise<Route>;
  findBaseline(shipId: string, year: number): Promise<Route | null>;
  findRoutesForComparison(shipId: string, year: number): Promise<Route[]>;
  findAllByShipAndYear(shipId: string, year: number): Promise<Route[]>;
}