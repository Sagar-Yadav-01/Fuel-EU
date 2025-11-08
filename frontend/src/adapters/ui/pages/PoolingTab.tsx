import React, { useState } from 'react';
import { PoolCreationResult } from '@/shared/types';
import { KpiCard } from '../components/KpiCard';
import { Users, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { DEMO_SHIP_ID, DEMO_YEAR } from '@/shared/constants';

interface PoolingTabProps {
  poolResult: PoolCreationResult | null;
  onCreatePool: (shipIds: string[]) => void;
  isLoading: boolean;
}

// Hardcoded other ships for demo
const ALL_SHIPS = ['S001', 'S002', 'S003'];

export const PoolingTab: React.FC<PoolingTabProps> = ({ poolResult, onCreatePool, isLoading }) => {
  const [selectedShips, setSelectedShips] = useState<string[]>([DEMO_SHIP_ID]);

  const handleToggleShip = (shipId: string) => {
    if (shipId === DEMO_SHIP_ID) return; // Cannot deselect self
    setSelectedShips(prev => 
      prev.includes(shipId) ? prev.filter(s => s !== shipId) : [...prev, shipId]
    );
  };

  const handleSubmit = () => {
    if (selectedShips.length < 2) {
      alert('Please select at least two ships to form a pool.');
      return;
    }
    onCreatePool(selectedShips);
  };

  const formatCB = (val: number) => val.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-navy">Compliance Pooling</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pool Setup */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-sky" />
            <h3 className="text-lg font-semibold text-navy">Create a Pool for {DEMO_YEAR}</h3>
          </div>
          <p className="text-sm text-gray-600">Select other ships to form a compliance pool. The pool's total Compliance Balance (∑CB) must be ≥ 0.</p>
          
          <div className="space-y-2">
            {ALL_SHIPS.map(shipId => (
              <label key={shipId} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                <input
                  type="checkbox"
                  checked={selectedShips.includes(shipId)}
                  onChange={() => handleToggleShip(shipId)}
                  disabled={shipId === DEMO_SHIP_ID}
                  className="h-5 w-5 text-navy rounded focus:ring-navy-light"
                />
                <span className={`font-medium ${shipId === DEMO_SHIP_ID ? 'text-navy' : 'text-gray-700'}`}>
                  {shipId} {shipId === DEMO_SHIP_ID && '(Your Ship)'}
                </span>
              </label>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || selectedShips.length < 2}
            className="w-full bg-navy text-white px-4 py-2 rounded-md hover:bg-navy-light disabled:bg-gray-400"
          >
            {isLoading ? 'Calculating...' : 'Calculate Pool'}
          </button>
        </div>

        {/* Pool Results */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-navy mb-4">Pool Results</h3>
          {!poolResult ? (
            <p className="text-gray-500 text-center pt-16">Calculate a pool to see the results here.</p>
          ) : (
            <div className="space-y-4">
              <KpiCard 
                title="Total Pool CB" 
                value={formatCB(poolResult.totalPoolCb)} 
                unit="gCO₂eq"
                className={poolResult.isValid ? 'bg-green-50' : 'bg-red-50'}
              >
                {poolResult.isValid ? (
                  <div className="flex items-center space-x-2 text-compliance-green">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Pool is valid (∑CB ≥ 0)</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-compliance-red">
                    <XCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Pool is invalid (∑CB &lt; 0)</span>
                  </div>
                )}
              </KpiCard>
              
              <h4 className="font-semibold text-gray-700">Member Allocation:</h4>
              <ul className="divide-y divide-gray-200">
                {poolResult.members.map(member => (
                  <li key={member.shipId} className="py-3">
                    <div className="font-medium text-gray-800">{member.shipId}</div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>CB Before:</span>
                      <span className={member.cb_before < 0 ? 'text-red-600' : 'text-green-600'}>
                        {formatCB(member.cb_before)}
                      </span>
                    </div>
                    <div className="flex items-center justify-center my-1">
                      <ArrowRight className="h-4 w-4 text-sky" />
                    </div>
                    <div className="flex items-center justify-between text-sm font-semibold text-navy">
                      <span>CB After:</span>
                      <span className={member.cb_after < 0 ? 'text-red-600' : 'text-green-600'}>
                        {formatCB(member.cb_after)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};