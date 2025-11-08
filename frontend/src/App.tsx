import { Layout } from './adapters/ui/components/Layout';
import { useDashboard } from './adapters/ui/hooks/useDashboard';
import { TabId } from './shared/types';
import { RoutesTab } from './adapters/ui/pages/RoutesTab';
import { CompareTab } from './adapters/ui/pages/CompareTab';
import { BankingTab } from './adapters/ui/pages/BankingTab';
import { PoolingTab } from './adapters/ui/pages/PoolingTab';
import { List, BarChart2, PiggyBank, Users, RefreshCw } from 'lucide-react';

const tabs: { id: TabId; name: string; icon: React.ReactNode }[] = [
  { id: 'routes', name: 'Routes & Baseline', icon: <List size={18} /> },
  { id: 'compare', name: 'Compare', icon: <BarChart2 size={18} /> },
  { id: 'banking', name: 'Banking', icon: <PiggyBank size={18} /> },
  { id: 'pooling', name: 'Pooling', icon: <Users size={18} /> },
];

function App() {
  const { activeTab, setActiveTab, isLoading, error, state, actions } = useDashboard();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'routes':
        return <RoutesTab routes={state.routes} onSetBaseline={actions.handleSetBaseline} isLoading={isLoading} />;
      case 'compare':
        return <CompareTab comparison={state.comparison} isLoading={isLoading} />;
      case 'banking':
        return <BankingTab kpis={state.bankingKpis} records={state.bankRecords} onBank={actions.handleBankSurplus} onApply={actions.handleApplyDeficit} isLoading={isLoading} />;
      case 'pooling':
        return <PoolingTab poolResult={state.poolResult} onCreatePool={actions.handleCreatePool} isLoading={isLoading} />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-lg p-6 min-h-[70vh]">
        {/* Tab Navigation */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
          <nav className="flex space-x-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 font-medium text-sm rounded-md ${
                  activeTab === tab.id
                    ? 'bg-navy text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
          <button
            onClick={actions.refresh}
            disabled={isLoading}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Loading...' : 'Refresh'}</span>
          </button>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Tab Content */}
        <div>
          {renderTabContent()}
        </div>
      </div>
    </Layout>
  );
}

export default App;