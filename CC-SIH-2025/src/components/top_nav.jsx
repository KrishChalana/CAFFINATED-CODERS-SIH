import React from 'react';
import { Menu, ChevronDown, User } from 'lucide-react';

// --- Top Navigation Component ---
const TopNav = ({navItems}) => {
//   const navItems = [
//     { label: 'Overview', href: '#' },
//     { label: 'Lanes', href: '#', active: true },
//     { label: 'Intersections', href: '#' },
//     { label: 'Incidents', href: '#' },
//     { label: 'Settings', href: '#' },
//   ];

  return (
    <header className="bg-white border-b border-gray-200 p-4 shadow-sm flex justify-between items-center">
      {/* Logo/Title */}
      <div className="flex items-center space-x-6">
        <h1 className="text-xl font-bold text-gray-800">Traffic Control AI</h1>
        <p className="text-sm text-gray-500 hidden sm:block">City of Metropolis</p>
      </div>

      {/* Main Navigation Links */}
      <nav className="hidden lg:flex space-x-6">
        {navItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${item.active
                ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                : 'text-gray-700 hover:text-blue-600'
              }`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* User/Actions */}
      <div className="flex items-center space-x-3">
        {/* Placeholder for small screen menu */}
        <button className="lg:hidden p-2 rounded-full hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-600" />
        </button>
        {/* User Icon */}
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600"/>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>
    </header>
  );
};

export default TopNav;