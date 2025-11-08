// --- Domain Models ---

export interface Route {
  id: string;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
  createdAt: string;
  shipId: string;
}

export interface RouteComparison {
  shipId: string;
  year: number;
  baseline: Route | null;
  comparisonRoutes: (Route & { percentDiff: number })[];
  targetIntensity: number;
  isCompliant: boolean;
}

export interface ShipCompliance {
  id: string;
  shipId: string;
  year: number;
  cb_gco2eq: number; // Original calculated CB
  cb_adjusted: number | null; // CB after banking/pooling
}

export interface BankEntry {
  id: string;
  shipId: string;
  year: number;
  amount_gco2eq: number;
  type: 'bank' | 'apply';
  createdAt: string;
}

export interface Pool {
  id: string;
  year: number;
  createdAt: string;
}

export interface PoolMember {
  id: string;
  poolId: string;
  shipId: string;
  cb_before: number;
  cb_after: number;
}

export interface PoolCreationResult {
  pool: Pool;
  members: PoolMember[];
  totalPoolCb: number;
  isValid: boolean;
}

export type TabId = 'routes' | 'compare' | 'banking' | 'pooling';