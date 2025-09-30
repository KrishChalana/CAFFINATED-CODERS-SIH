import React from 'react';
import { Bell, ChevronDown, User } from 'lucide-react'; // Using lucide-react for icons

// Mock Data for demonstration
const mockHistoricalData = [10, 20, 15, 25, 30, 18, 12, 22, 28, 35, 20, 15, 10, 5, 18, 25, 35, 40, 30, 25, 20, 15, 25, 30, 35, 40, 35, 30, 35, 45];
const mockIncidentLogs = [
  { time: '08:00 AM', location: 'Downtown', status: 'Resolved' },
  { time: '09:30 AM', location: 'HWY 23', status: 'Active' },
  { time: '11:15 AM', location: 'Main St', status: 'Moderate' },
  { time: '01:45 PM', location: 'Bridge Ave', status: 'Ongoing' },
  { time: '03:30 PM', location: 'Parkway Dr', status: 'Resolved' },
];
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Utility function to render the status pill
const StatusPill = ({ status }) => {
  let colorClass;
  switch (status) {
    case 'Resolved':
      colorClass = 'bg-green-100 text-green-700';
      break;
    case 'Active':
      colorClass = 'bg-red-100 text-red-700';
      break;
    case 'Moderate':
      colorClass = 'bg-yellow-100 text-yellow-700';
      break;
    case 'Ongoing':
      colorClass = 'bg-blue-100 text-blue-700';
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-700';
  }
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${colorClass}`}
    >
      {status}
    </span>
  );
};

// --- Header Component ---
const Header = () => (
   <header className="inter-font flex justify-between items-center p-4 border-b border-gray-200">
      <div className="flex items-center space-x-8">
        <h1 className="text-xl font-bold text-gray-800">Traffic Control AI</h1>
        <nav className="hidden sm:flex space-x-6 text-sm">
          <a href="/main" className="text-gray-500 hover:text-blue-600">Dashboard</a>
          <a href="/main/level" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">Congestion Reports</a>
          <a href="/main/lane" className="text-gray-500  hover:border-blue-600">Lane</a>
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
  
  
);

// --- Historical Congestion Chart Component (Simplified) ---
// Note: For a real app, this would use a charting library like Chart.js or Recharts.
const HistoricalCongestionChart = ({ data }) => {
  const maxData = Math.max(...data);
  const minData = Math.min(...data);
  
  // Create an SVG line path for a *very* simplified, illustrative chart
  const points = data.map((val, index) => {
    // Scaling value to a 0-100 height range for SVG
    const y = 100 - ((val - minData) / (maxData - minData || 1)) * 90 - 5; // Scale and add padding
    const x = (index / (data.length - 1)) * 100;
    return `${x} ${y}`;
  }).join(' L ');
  
  // Closed path for the area fill
  const areaPath = `M 0 100 L ${points} L 100 100 Z`;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Congestion Levels Over Time</h3>
          <p className="text-7xl font-bold text-gray-900 mt-1">Moderate</p>
          <p className="text-sm text-gray-500">Last 30 Days <span className="text-green-600 font-semibold">+5%</span></p>
        </div>
      </div>
      <div className="w-full h-48 relative">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          {/* Area Fill */}
          <path d={areaPath} fill="rgb(59, 130, 246, 0.2)" /> 
          {/* Line Path */}
          <polyline
            fill="none"
            stroke="rgb(59, 130, 246)"
            strokeWidth="1"
            points={points.replace(/ L /g, ' ')}
          />
        </svg>
      </div>
    </div>
  );
};

// --- Incident Logs Component ---
const IncidentLogs = ({ logs }) => (
  <div className="p-6 bg-white rounded-lg">
    <h2 className="text-xl font-semibold mb-6 text-gray-800">Incident Logs</h2>
    <div className="space-y-4">
      <div className="grid grid-cols-3 font-semibold text-gray-500 text-sm border-b pb-2">
        <span>Time</span>
        <span>Location</span>
        <span>Status</span>
      </div>
      {logs.map((log, index) => (
        <div key={index} className="grid grid-cols-3 text-sm items-center py-2 border-b last:border-b-0">
          <span className="text-gray-700">{log.time}</span>
          <span className="text-gray-700">{log.location}</span>
          <div>
            <StatusPill status={log.status} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- Congestion Predictions Component (Simplified) ---
const CongestionPredictions = () => (
  <div className="p-6 bg-white rounded-lg shadow-sm h-full flex flex-col justify-between">
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Congestion Predictions</h2>
      <h3 className="text-sm font-medium text-gray-500">Predicted Congestion Levels</h3>
      <p className="text-5xl font-bold text-gray-900 mt-1">High</p>
      <p className="text-sm text-gray-500">Next 7 Days <span className="text-green-600 font-semibold">+10%</span></p>
    </div>
    
    {/* Placeholder for the chart area */}
    <div className="flex-grow my-8 bg-gray-50 rounded-md">
        {/* In a real scenario, a chart would go here. */}
    </div>

    {/* Day labels */}
    <div className="flex justify-between text-xs font-medium text-gray-500 pt-4">
      {daysOfWeek.map(day => (
        <span key={day}>{day}</span>
      ))}
    </div>
  </div>
);

// --- Main Dashboard Component ---
const CongestionReport = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <main className="p-8">
        {/* Title Section */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Congestion Reports</h1>
          <p className="text-gray-600 mt-1">Analyze traffic patterns and congestion levels across the city.</p>
        </section>

        {/* Historical and Incident Logs Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Historical Congestion Data</h2>
            <HistoricalCongestionChart data={mockHistoricalData} />
          </div>
          <div className="lg:col-span-1">
            <IncidentLogs logs={mockIncidentLogs} />
          </div>
        </div>
        
        {/* Congestion Predictions Section */}
        <div className="h-96"> {/* Fixed height for visual consistency */}
            <CongestionPredictions />
        </div>
      </main>
    </div>
  );
};

export default CongestionReport;