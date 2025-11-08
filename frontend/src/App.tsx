import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDashboard } from './adapters/ui/hooks/useDashboard';
import { Navbar } from './adapters/ui/components/Navbar';
import { HomePage } from './adapters/ui/pages/HomePage';
import { RoutesTab } from './adapters/ui/pages/RoutesTab';
import { CompareTab } from './adapters/ui/pages/CompareTab';
import { BankingTab } from './adapters/ui/pages/BankingTab';
import { PoolingTab } from './adapters/ui/pages/PoolingTab';
import { TabId } from './shared/types'; // Import the TabId type

function App() {
  // We initialize the dashboard state here, at the top level.
  // This ensures the state is shared across all dashboard pages.
  const dashboardProps = useDashboard();
  const { state, actions, isLoading, setActiveTab } = dashboardProps;

  // This component wraps each page. On mount, it tells the useDashboard
  // hook which tab is "active", which triggers the correct data fetch
  // from the useEffect inside the hook.
  const PageDataWrapper: React.FC<{ tabId: TabId; children: React.ReactNode }> = ({ tabId, children }) => {
    useEffect(() => {
      // Tell the hook which page is now active
      setActiveTab(tabId);
    }, [tabId]); // Only runs when the page (tabId) changes

    return <>{children}</>;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar is rendered outside the Routes, so it's on every page */}
      <Navbar />

      {/* Main content area, with padding-top to offset the fixed navbar */}
      <main className="pt-20">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            {/* Homepage Route */}
            <Route path="/" element={<HomePage />} />

            {/* Dashboard Routes */}
            {/* FIX 1: We wrap each page in PageDataWrapper to trigger the 
                     correct data fetch for that page.
              FIX 2: We now pass the *correct* props to each component
                     from the hook's 'state' and 'actions' objects.
            */}
            <Route
              path="/routes"
              element={
                <PageDataWrapper tabId="routes">
                  <RoutesTab
                    routes={state.routes}
                    onSetBaseline={actions.handleSetBaseline}
                    isLoading={isLoading}
                  />
                </PageDataWrapper>
              }
            />
            <Route
              path="/compare"
              element={
                <PageDataWrapper tabId="compare">
                  <CompareTab
                    comparison={state.comparison}
                    isLoading={isLoading}
                  />
                </PageDataWrapper>
              }
            />
            <Route
              path="/banking"
              element={
                <PageDataWrapper tabId="banking">
                  <BankingTab
                    kpis={state.bankingKpis}
                    records={state.bankRecords}
                    onBank={actions.handleBankSurplus}
                    onApply={actions.handleApplyDeficit}
                    isLoading={isLoading}
                  />
                </PageDataWrapper>
              }
            />
            <Route
              path="/pooling"
              element={
                <PageDataWrapper tabId="pooling">
                  <PoolingTab
                    poolResult={state.poolResult}
                    onCreatePool={actions.handleCreatePool}
                    isLoading={isLoading}
                  />
                </PageDataWrapper>
              }
            />

            {/* Redirect any unknown paths to the homepage */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;