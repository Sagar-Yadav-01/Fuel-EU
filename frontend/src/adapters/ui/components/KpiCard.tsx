import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  className?: string;
  children?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, unit, className = '', children }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h3>
      <div className="mt-2 flex items-baseline space-x-2">
        <span className="text-3xl font-bold text-navy">{typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value}</span>
        {unit && <span className="text-lg text-gray-600">{unit}</span>}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};