import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Route } from '@/shared/types';

interface ComparisonChartProps {
  data: (Route & { percentDiff: number })[];
  baseline: Route | null;
  target: number;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ data, baseline, target }) => {
  const chartData = data.map(route => ({
    name: route.routeId,
    'GHG Intensity': route.ghgIntensity,
    'Baseline': baseline?.ghgIntensity,
  }));

  return (
    <div className="h-96 w-full bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-navy mb-4">GHG Intensity Comparison (gCO₂e/MJ)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
          <Tooltip
            formatter={(value) => (typeof value === 'number' ? value.toFixed(4) : value)}
          />
          <Legend />
          <ReferenceLine
            y={target}
            label={{ value: `Target: ${target.toFixed(4)}`, position: 'insideTopRight', fill: '#ef4444' }}
            stroke="#ef4444"
            strokeDasharray="4 4"
          />
          {baseline && (
            <ReferenceLine
              y={baseline.ghgIntensity}
              label={{ value: `Baseline: ${baseline.ghgIntensity.toFixed(4)}`, position: 'insideTopLeft', fill: '#3b82f6' }}
              stroke="#3b82f6"
              strokeDasharray="4 4"
            />
          )}
          <Bar dataKey="GHG Intensity" fill="#7bc8e8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};