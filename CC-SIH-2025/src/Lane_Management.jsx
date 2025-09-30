import React, { useState } from 'react';

import {
Bell,
  Menu,
  ChevronDown,
  User,
  PanelLeft, // Using PanelLeft for 'Lanes'
} from 'lucide-react'; // Using lucide-react for icons

// --- Top Navigation Component ---
const TopNav = () => {
  const navItems = [
    { label: 'Overview', href: '/' },
    { label: 'Lanes', href: '/lane', active: true },
    { label: 'Congestion-Level', href: '/level' },
    
  ];

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

// --- Info Card Component ---
const InfoCard = ({ title, value, valueColorClass = 'text-gray-900' }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
    <p className={`text-3xl font-bold ${valueColorClass}`}>{value}</p>
  </div>
);

// --- Lane Management Main Content Component ---
const LaneManagementContent = () => {
  const [selectedLane, setSelectedLane] = useState('Lane 1 - Northbound');
  const [aiControlEnabled, setAiControlEnabled] = useState(true);

  const laneOptions = [
    'Lane 1 - Northbound',
    'Lane 2 - Southbound',
    'Lane 3 - East',
    'Lane 4 - West',
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto p-8 bg-gray-50">
      
      {/* Page Title Section */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lane Management</h1>
        <p className="text-gray-600 mt-1">Manage individual lanes, view their status, and control traffic flow.</p>
      </section>

      {/* Lane Details */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Lane Details</h2>
        <div className="mb-6 relative w-full sm:w-80">
          <label htmlFor="lane-select" className="sr-only">Select Lane</label>
          <select
            id="lane-select"
            value={selectedLane}
            onChange={(e) => setSelectedLane(e.target.value)}
            className="block w-full pl-4 pr-10 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
          >
            {laneOptions.map((lane, index) => (
              <option key={index} value={lane}>{lane}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard title="Status" value="Active" valueColorClass="text-green-600" />
          <InfoCard title="Flow Rate" value="1200 vehicles/hour" />
          <InfoCard title="Congestion Level" value="Low" valueColorClass="text-green-600" />
        </div>
      </section>

      {/* Manual Control */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Manual Control</h2>
        <div className="flex space-x-4">
          <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Open Lane
          </button>
          <button className="px-8 py-3 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 border border-gray-200">
            Close Lane
          </button>
        </div>
      </section>

      {/* AI Override */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">AI Override</h2>
        <div className="space-y-4 max-w-md">
          <label
            className={`block p-4 rounded-lg cursor-pointer transition-colors ${
              aiControlEnabled ? 'bg-blue-50 border-blue-400 border-2' : 'bg-white border border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="ai-control"
              value="enable"
              checked={aiControlEnabled}
              onChange={() => setAiControlEnabled(true)}
              className="hidden"
            />
            <div className="flex items-center text-lg font-medium">
                <span className={`w-5 h-5 mr-3 rounded-full border-2 ${aiControlEnabled ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`}></span>
                Enable AI Control
            </div>
          </label>
          
          <label
            className={`block p-4 rounded-lg cursor-pointer transition-colors ${
              !aiControlEnabled ? 'bg-blue-50 border-blue-400 border-2' : 'bg-white border border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="ai-control"
              value="disable"
              checked={!aiControlEnabled}
              onChange={() => setAiControlEnabled(false)}
              className="hidden"
            />
             <div className="flex items-center text-lg font-medium">
                <span className={`w-5 h-5 mr-3 rounded-full border-2 ${!aiControlEnabled ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`}></span>
                Disable AI Control
            </div>
          </label>
        </div>
      </section>

      {/* Save Changes Button */}
      <div className="flex justify-end pt-4">
        <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50">
          Save Changes
        </button>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---
const LaneManagementDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
        <header className="inter-font flex justify-between items-center p-4 border-b border-gray-200">
    <div className="flex items-center space-x-8">
      <h1 className="text-xl font-bold text-gray-800">Traffic Control AI</h1>
      <nav className="hidden sm:flex space-x-6 text-sm">
        <a href="/main" className="text-gray-500 hover:text-blue-600">Dashboard</a>
        <a href="/main/level" className="text-gray-500 hover:text-blue-600">Congestion Reports</a>
        <a href="/main/lane" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">Lane</a>
        <a href="#" className="text-gray-500 hover:text-blue-600">Settings</a>
      </nav>
    </div>
    <div className="flex items-center space-x-4">
      <button className="p-2 rounded-full hover:bg-gray-100 relative">
        <Bell className="w-5 h-5 text-gray-600" />
        {/* Simple mock notification dot */}
        <span className="absolute top-2 right-2 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
      </button>
      <div className="flex items-center space-x-2">
        {/* Placeholder for user avatar/image */}
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600"/>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>
    </div>
  </header>



      <LaneManagementContent />
    </div>
  );
};

export default LaneManagementDashboard;