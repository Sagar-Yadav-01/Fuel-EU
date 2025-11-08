import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Ship, Menu, X } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Routes', href: '/routes' },
  { name: 'Compare', href: '/compare' },
  { name: 'Banking', href: '/banking' },
  { name: 'Pooling', href: '/pooling' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'text-blue-600 font-semibold border-b-2 border-blue-600 px-1 py-2'
      : 'text-gray-500 hover:text-gray-900 transition-colors px-1 py-2';

  const getMobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'block w-full text-left px-3 py-2 rounded-md bg-blue-50 text-blue-700 font-semibold'
      : 'block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50';

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors">
              <Ship className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-lg hidden sm:block">
                FuelEU Maritime
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/'}
                className={getNavLinkClass}
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-200`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              className={getMobileNavLinkClass}
              onClick={() => setIsOpen(false)} // Close menu on click
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}