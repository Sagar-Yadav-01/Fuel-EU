import React from 'react';
import { Link } from 'react-router-dom';
import { Ship, Mail, Phone, MapPin } from 'lucide-react';

const quickLinks = [
  { name: 'Routes', href: '/routes' },
  { name: 'Compare', href: '/compare' },
  { name: 'Banking', href: '/banking' },
  { name: 'Pooling', href: '/pooling' },
];

const contactInfo = [
  { 
    name: 'info@varunamarine.eu', 
    href: 'mailto:contact@fueleu.example.com', 
    icon: Mail,
    aria: 'Email us' 
  },
  { 
    name: '+1 31107640935', 
    href: 'tel:+1234567890', 
    icon: Phone,
    aria: 'Call us'
  },
  { 
    name: '123 Maritime Plaza, Athens, Greece', 
    href: 'https://maps.google.com/?q=123+Maritime+Plaza,Athens,Greece', 
    icon: MapPin,
    aria: 'View address on map'
  },
];

export function Footer() {
  return (
    <footer className="bg-navy-dark text-gray-300 transition-all duration-300 ease-in-out" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Logo & About */}
          <div className="md:col-span-4">
            <Link to="/" className="flex items-center gap-2 text-white">
              <Ship className="h-8 w-8 text-sky-light" />
              <span className="font-bold text-lg">
                FuelEU Maritime
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Simplifying compliance with FuelEU Maritime regulations through advanced analytics and data management.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 md:col-start-6">
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-base text-gray-300 hover:text-sky-light transition-colors duration-200 transform hover:scale-105 inline-block focus:outline-none focus:ring-2 focus:ring-sky-light rounded"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4">
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Contact Us</h3>
            <ul className="mt-4 space-y-3">
              {contactInfo.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={item.aria}
                    className="flex items-start gap-3 text-base text-gray-300 hover:text-sky-light transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-sky-light rounded"
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-sky-light transition-colors duration-200" aria-hidden="true" />
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} FuelEU Maritime Compliance. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}