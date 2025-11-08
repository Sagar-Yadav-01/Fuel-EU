import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDashboard } from './adapters/ui/hooks/useDashboard';
import { Navbar } from './adapters/ui/components/Navbar';
import { HomePage } from './adapters/ui/pages/HomePage';
import { RoutesTab } from './adapters/ui/pages/RoutesTab';
import { CompareTab } from './adapters/ui/pages/CompareTab';
import { BankingTab } from './adapters/ui/pages/BankingTab';
import { PoolingTab } from './adapters/ui/pages/PoolingTab';

function App() {
  // We initialize the dashboard state here, at the top level.
  // This ensures the state is shared across all dashboard pages
  // and is not lost when navigating between them.
  const dashboardProps = useDashboard();

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
            {/* We pass the same dashboardProps to each page */}
            <Route
              path="/routes"
              element={<RoutesTab {...dashboardProps} />}
            />
            <Route
              path="/compare"
              element={<CompareTab {...dashboardProps} />}
            />
            <Route
              path="/banking"
              element={<BankingTab {...dashboardProps} />}
            />
            <Route
              path="/pooling"
              element={<PoolingTab {...dashboardProps} />}
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