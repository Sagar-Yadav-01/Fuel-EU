import { Route, ShipCompliance, BankEntry, Pool, PoolMember } from '@prisma/client';

// Re-exporting Prisma types for domain use
export type { Route, ShipCompliance, BankEntry, Pool, PoolMember };

// Custom type for comparison data
export type RouteComparison = {
  shipId: string;
  year: number;
  baseline: Route | null;
  comparisonRoutes: (Route & { percentDiff: number })[];
  targetIntensity: number;
  isCompliant: boolean;
};

// Custom type for pool creation payload
export type PoolCreationRequest = {
  year: number;
  shipIds: string[];
};

// Custom type for pool creation result
export type PoolCreationResult = {
  pool: Pool;
  members: PoolMember[];
  totalPoolCb: number;
  isValid: boolean;
};