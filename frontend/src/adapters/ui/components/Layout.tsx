import React from 'react';
import { Ship, Anchor } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-navy text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Anchor size={32} className="text-sky" />
            <h1 className="text-2xl font-bold">FuelEU Maritime Compliance</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Ship size={20} className="text-sky-light" />
            <span className="text-sm font-medium">Demo Ship: {`S001`}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center p-4 text-sm">
        © {new Date().getFullYear()} FuelEU Compliance Platform. All rights reserved.
      </footer>
    </div>
  );
};