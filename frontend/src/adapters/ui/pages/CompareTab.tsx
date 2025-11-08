import React from 'react';
import { RouteComparison } from '@/shared/types';
import { KpiCard } from '../components/KpiCard';
import { ComparisonChart } from '../components/ComparisonChart';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface CompareTabProps {
  comparison: RouteComparison | null;
  isLoading: boolean;
}

export const CompareTab: React.FC<CompareTabProps> = ({ comparison, isLoading }) => {
  if (isLoading) return <div className="text-center p-8">Loading comparison data...</div>;
  if (!comparison) return <div className="text-center p-8 text-gray-500">No comparison data available.</div>;

  const { baseline, comparisonRoutes, targetIntensity, isCompliant } = comparison;

  if (!baseline) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow-md">
        <AlertTriangle className="h-8 w-8 text-yellow-500 mr-4" />
        <span className="text-xl text-gray-700">Please set a baseline for {comparison.year} on the 'Routes' tab to see comparison data.</span>
      </div>
    );
  }

  const avgComparisonIntensity = 
    comparisonRoutes.length > 0
      ? comparisonRoutes.reduce((sum, r) => sum + r.ghgIntensity, 0) / comparisonRoutes.length
      : 0;

  const avgPercentDiff =
    comparisonRoutes.length > 0
      ? comparisonRoutes.reduce((sum, r) => sum + r.percentDiff, 0) / comparisonRoutes.length
      : 0;
      
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-navy">Baseline Comparison (Year {comparison.year})</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Baseline Intensity" value={baseline.ghgIntensity.toFixed(4)} unit="gCO₂e/MJ" />
        <KpiCard title="Avg. Comparison Intensity" value={avgComparisonIntensity.toFixed(4)} unit="gCO₂e/MJ" />
        <KpiCard title="Avg. % Difference" value={avgPercentDiff.toFixed(2)} unit="%" 
          className={avgPercentDiff > 0 ? 'text-compliance-red' : 'text-compliance-green'}
        />
      </div>

      {/* Compliance Status */}
      <div className={`p-6 rounded-lg shadow-md flex items-center space-x-4 ${isCompliant ? 'bg-green-50' : 'bg-red-50'}`}>
        {isCompliant ? (
          <CheckCircle className="h-10 w-10 text-compliance-green" />
        ) : (
          <XCircle className="h-10 w-10 text-compliance-red" />
        )}
        <div>
          <h3 className={`text-xl font-semibold ${isCompliant ? 'text-compliance-green' : 'text-compliance-red'}`}>
            {isCompliant ? 'In Compliance' : 'Out of Compliance'}
          </h3>
          <p className="text-gray-600">
            {isCompliant
              ? 'All comparison routes are at or below the target intensity.'
              : 'One or more routes exceed the target intensity of ' + targetIntensity.toFixed(4) + ' gCO₂e/MJ.'}
          </p>
        </div>
      </div>
      
      {/* Chart */}
      <ComparisonChart data={comparisonRoutes} baseline={baseline} target={targetIntensity} />
    </div>
  );
};