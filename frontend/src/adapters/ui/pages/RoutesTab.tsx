import React, { useMemo, useState } from 'react';
import { Route } from '@/shared/types';
import { Check, ShieldAlert } from 'lucide-react';

interface RoutesTabProps {
  routes: Route[];
  onSetBaseline: (routeId: string) => void;
  isLoading: boolean;
}

export const RoutesTab: React.FC<RoutesTabProps> = ({ routes, onSetBaseline, isLoading }) => {
  const [filters, setFilters] = useState({ vesselType: '', fuelType: '', year: '' });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredRoutes = useMemo(() => {
    return routes.filter(route => {
      return (
        (filters.vesselType === '' || route.vesselType === filters.vesselType) &&
        (filters.fuelType === '' || route.fuelType === filters.fuelType) &&
        (filters.year === '' || route.year === parseInt(filters.year))
      );
    });
  }, [routes, filters]);

  const unique = (key: keyof Route) => [...new Set(routes.map(r => r[key]))];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-navy">Routes & Baseline</h2>
      
      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md flex gap-4">
        <FilterSelect name="vesselType" value={filters.vesselType} onChange={handleFilterChange} options={unique('vesselType')} label="Vessel Type" />
        <FilterSelect name="fuelType" value={filters.fuelType} onChange={handleFilterChange} options={unique('fuelType')} label="Fuel Type" />
        <FilterSelect name="year" value={filters.year} onChange={handleFilterChange} options={unique('year')} label="Year" />
      </div>

      {/* Routes Table */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <Th>Baseline</Th>
              <Th>Route ID</Th>
              <Th>Vessel Type</Th>
              <Th>Fuel Type</Th>
              <Th>Year</Th>
              <Th>GHG Intensity</Th>
              <Th>Fuel Consumption</Th>
              <Th>Distance</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRoutes.length === 0 && (
              <tr><td colSpan={9} className="p-4 text-center text-gray-500">No routes match filters.</td></tr>
            )}
            {filteredRoutes.map((route) => (
              <tr key={route.id} className={route.isBaseline ? 'bg-blue-50' : ''}>
                <Td className="text-center">
                  {route.isBaseline ? (
                     <Check className="h-5 w-5 text-green-600 mx-auto" />
                  ) : (
                    <ShieldAlert className="h-5 w-5 text-gray-300 mx-auto" />
                  )}
                </Td>
                <Td className="font-medium text-navy">{route.routeId}</Td>
                <Td>{route.vesselType}</Td>
                <Td>{route.fuelType}</Td>
                <Td>{route.year}</Td>
                <Td>{route.ghgIntensity.toFixed(4)}</Td>
                <Td>{route.fuelConsumption.toLocaleString()}</Td>
                <Td>{route.distance.toLocaleString()}</Td>
                <Td>
                  <button
                    onClick={() => onSetBaseline(route.routeId)}
                    disabled={route.isBaseline || isLoading}
                    className="text-xs bg-navy text-white px-3 py-1 rounded-md hover:bg-navy-light disabled:bg-gray-400"
                  >
                    {isLoading ? 'Setting...' : 'Set Baseline'}
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper components for table
const Th: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <th scope="col" className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

const Td: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <td className={`px-4 py-3 whitespace-nowrap text-sm text-gray-700 ${className}`}>
    {children}
  </td>
);

// Helper for filter selects
const FilterSelect: React.FC<{ name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: (string | number)[], label: string }> = 
  ({ name, value, onChange, options, label }) => (
  <div className="flex-1">
    <label htmlFor={name} className="block text-xs font-medium text-gray-700">{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-navy focus:border-navy sm:text-sm rounded-md"
    >
      <option value="">All</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);