import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Route,
  RouteComparison,
  ShipCompliance,
  BankEntry,
  PoolCreationResult,
  TabId,
} from '@/shared/types';
import { DEMO_SHIP_ID, DEMO_YEAR } from '@/shared/constants';

// Import services and adapters
import { ApiService } from '@/adapters/infrastructure/ApiService';
import { RouteService } from '@/core/application/RouteService';
import { ComplianceService } from '@/core/application/ComplianceService';
import { BankingService } from '@/core/application/BankingService';
import { PoolingService } from '@/core/application/PoolingService';

// Instantiate adapters and services (DI)
const apiService = new ApiService();
const routeService = new RouteService(apiService);
const complianceService = new ComplianceService(apiService);
const bankingService = new BankingService(apiService);
const poolingService = new PoolingService(apiService);

export const useDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabId>('routes');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- State for each tab ---
  const [routes, setRoutes] = useState<Route[]>([]);
  const [comparison, setComparison] = useState<RouteComparison | null>(null);
  const [compliance, setCompliance] = useState<ShipCompliance | null>(null);
  const [bankRecords, setBankRecords] = useState<BankEntry[]>([]);
  const [poolResult, setPoolResult] = useState<PoolCreationResult | null>(null);

  // --- Memoized derived state ---
  const bankingKpis = useMemo(() => {
    const cb_before = compliance?.cb_gco2eq ?? 0;
    const applied = bankRecords.reduce((sum, r) => sum + r.amount_gco2eq, 0);
    const cb_after = compliance?.cb_adjusted ?? cb_before + applied;
    return { cb_before, applied, cb_after };
  }, [compliance, bankRecords]);

  // --- Data Fetching ---
  const fetchData = useCallback(async (tab: TabId) => {
    setIsLoading(true);
    setError(null);
    try {
      switch (tab) {
        case 'routes':
          setRoutes(await routeService.getRoutes());
          break;
        case 'compare':
          setComparison(await routeService.getComparison(DEMO_SHIP_ID, DEMO_YEAR));
          break;
        case 'banking':
          setCompliance(await complianceService.getAdjustedCompliance(DEMO_SHIP_ID, DEMO_YEAR));
          setBankRecords(await bankingService.getBankRecords(DEMO_SHIP_ID, DEMO_YEAR));
          break;
        case 'pooling':
          // Initial load for pooling doesn't fetch, it waits for user action
          // But we might want to pre-load compliance for potential pool members
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on tab change
  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab, fetchData]);

  // --- UI Actions ---
  const handleSetBaseline = async (routeId: string) => {
    setIsLoading(true);
    try {
      await routeService.setBaseline(routeId);
      await fetchData('routes'); // Refresh routes tab
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set baseline');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBankSurplus = async (amount: number) => {
    setIsLoading(true);
    try {
      const updatedCompliance = await bankingService.bankSurplus(DEMO_SHIP_ID, DEMO_YEAR, amount);
      setCompliance(updatedCompliance);
      await fetchData('banking'); // Refresh banking tab
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bank surplus');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyDeficit = async (amount: number) => {
    setIsLoading(true);
    try {
      const updatedCompliance = await bankingService.applyDeficit(DEMO_SHIP_ID, DEMO_YEAR, amount);
      setCompliance(updatedCompliance);
      await fetchData('banking'); // Refresh banking tab
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply deficit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePool = async (shipIds: string[]) => {
    setIsLoading(true);
    try {
      const result = await poolingService.createPool(DEMO_YEAR, shipIds);
      setPoolResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create pool');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    isLoading,
    error,
    state: {
      routes,
      comparison,
      bankingKpis,
      bankRecords,
      poolResult,
    },
    actions: {
      handleSetBaseline,
      handleBankSurplus,
      handleApplyDeficit,
      handleCreatePool,
      refresh: () => fetchData(activeTab)
    },
  };
};