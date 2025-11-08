import React, { useState } from 'react';
import { BankEntry } from '@/shared/types';
import { KpiCard } from '../components/KpiCard';
import { Banknote, PiggyBank, HandCoins, ArrowRight } from 'lucide-react';
import { DEMO_YEAR } from '@/shared/constants';

interface BankingTabProps {
  kpis: { cb_before: number; applied: number; cb_after: number };
  records: BankEntry[];
  onBank: (amount: number) => void;
  onApply: (amount: number) => void;
  isLoading: boolean;
}

export const BankingTab: React.FC<BankingTabProps> = ({ kpis, records, onBank, onApply, isLoading }) => {
  const [bankAmount, setBankAmount] = useState(1000);
  const [applyAmount, setApplyAmount] = useState(1000);

  const formatCB = (val: number) => val.toLocaleString(undefined, { maximumFractionDigits: 0 });

  const hasSurplus = kpis.cb_after > 0;
  const hasDeficit = kpis.cb_after < 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-navy">Compliance Banking</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="CB Before Banking" value={formatCB(kpis.cb_before)} unit="gCO₂eq" />
        <KpiCard title="Banked / Applied" value={formatCB(kpis.applied)} unit="gCO₂eq" 
          className={kpis.applied > 0 ? 'text-compliance-green' : kpis.applied < 0 ? 'text-compliance-red' : ''}
        />
        <KpiCard title="CB After Banking" value={formatCB(kpis.cb_after)} unit="gCO₂eq" 
          className={kpis.cb_after > 0 ? 'text-compliance-green' : kpis.cb_after < 0 ? 'text-compliance-red' : ''}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bank Surplus Card */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="flex items-center space-x-3">
            <PiggyBank className="h-8 w-8 text-sky" />
            <h3 className="text-lg font-semibold text-navy">Bank Surplus</h3>
          </div>
          <p className="text-sm text-gray-600">
            Move surplus from your 'CB After Banking' to your company's bank for future use.
            Your current available surplus is {formatCB(kpis.cb_after)}.
          </p>
          <div className="flex space-x-2">
            <input 
              type="number"
              value={bankAmount}
              onChange={(e) => setBankAmount(Number(e.target.value))}
              className="flex-1 p-2 border border-gray-300 rounded-md"
              disabled={!hasSurplus || isLoading}
            />
            <button
              onClick={() => onBank(bankAmount)}
              disabled={!hasSurplus || isLoading || bankAmount > kpis.cb_after}
              className="bg-navy text-white px-4 py-2 rounded-md hover:bg-navy-light disabled:bg-gray-400"
            >
              {isLoading ? 'Banking...' : 'Bank'}
            </button>
          </div>
          {!hasSurplus && <p className="text-xs text-red-600">You have no surplus to bank.</p>}
          {hasSurplus && bankAmount > kpis.cb_after && <p className="text-xs text-red-600">Amount exceeds available surplus.</p>}
        </div>

        {/* Apply Banked Surplus */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="flex items-center space-x-3">
            <HandCoins className="h-8 w-8 text-sky" />
            <h3 className="text-lg font-semibold text-navy">Apply Banked Surplus</h3>
          </div>
          <p className="text-sm text-gray-600">
            Apply previously banked surplus to cover a deficit.
            Your current deficit is {formatCB(hasDeficit ? Math.abs(kpis.cb_after) : 0)}.
          </p>
          <div className="flex space-x-2">
            <input
              type="number"
              value={applyAmount}
              onChange={(e) => setApplyAmount(Number(e.target.value))}
              className="flex-1 p-2 border border-gray-300 rounded-md"
              disabled={!hasDeficit || isLoading}
            />
            <button
              onClick={() => onApply(applyAmount)}
              disabled={!hasDeficit || isLoading || applyAmount > Math.abs(kpis.cb_after)}
              className="bg-navy text-white px-4 py-2 rounded-md hover:bg-navy-light disabled:bg-gray-400"
            >
              {isLoading ? 'Applying...' : 'Apply'}
            </button>
          </div>
          {!hasDeficit && <p className="text-xs text-red-600">You have no deficit to cover.</p>}
          {hasDeficit && applyAmount > Math.abs(kpis.cb_after) && <p className="text-xs text-red-600">Amount exceeds deficit.</p>}
        </div>
      </div>

      {/* Records */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-navy mb-4">Banking Records for {DEMO_YEAR}</h3>
        {records.length === 0 ? (
          <p className="text-gray-500">No banking records for this period.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {records.map(record => (
              <li key={record.id} className="py-3 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Banknote className={`h-5 w-5 ${record.type === 'bank' ? 'text-green-600' : 'text-red-600'}`} />
                  <div>
                    <span className="font-medium">{record.type === 'bank' ? 'Banked Surplus' : 'Applied Deficit'}</span>
                    <span className="text-sm text-gray-500 ml-2">({new Date(record.createdAt).toLocaleString()})</span>
                  </div>
                </div>
                <span className={`font-semibold ${record.type === 'bank' ? 'text-green-600' : 'text-red-600'}`}>
                  {record.amount_gco2eq.toLocaleString()} gCO₂eq
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};