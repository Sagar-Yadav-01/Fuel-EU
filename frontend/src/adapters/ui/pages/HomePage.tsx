import React from 'react';
import { Link } from 'react-router-dom';
import { Ship, GitCompareArrows, PiggyBank, Users, ArrowRight } from 'lucide-react';

const features = [
  {
    name: 'Routes',
    href: '/routes',
    description: 'Manage and analyze all vessel routes and set baselines.',
    icon: Ship,
  },
  {
    name: 'Compare',
    href: '/compare',
    description: 'Compare route performance against compliance targets.',
    icon: GitCompareArrows,
  },
  {
    name: 'Banking',
    href: '/banking',
    description: 'Bank surplus allowances or apply deficits for future years.',
    icon: PiggyBank,
  },
  {
    name: 'Pooling',
    href: '/pooling',
    description: 'Manage compliance pools and share balances with other ships.',
    icon: Users,
  },
];

const FeatureCard = ({ feature }: { feature: (typeof features)[0] }) => (
  <Link
    to={feature.href}
    className="group block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
  >
    <div className="flex items-center justify-between">
      <span className="p-3 rounded-lg bg-blue-100 text-blue-600">
        <feature.icon className="w-8 h-8" />
      </span>
    </div>
    <div className="mt-4">
      <h3 className="text-xl font-semibold text-gray-900">{feature.name}</h3>
      <p className="text-sm text-gray-500 mt-2">{feature.description}</p>
      <div className="flex items-center mt-6 text-sm font-medium text-blue-600 group-hover:text-blue-700">
        Go to {feature.name}
        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  </Link>
);

export function HomePage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          FuelEU Maritime <span className="text-blue-600">Compliance</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          Your central dashboard for managing, tracking, and ensuring
          compliance with FuelEU Maritime regulations.
        </p>
      </div>

      <div className="mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.name} feature={feature} />
          ))}
        </div>
      </div>
    </div>
  );
}