import TrafficTable from "./components/Table";
import Card from "./components/card";
import DoodleButton from "./components/doodleButton";
import { FaTrafficLight } from "react-icons/fa";
import { Progress } from "./components/ui/progress";
import { Bell, ChevronDown, User } from "lucide-react";
import { TriangleAlert, Radar, BusFront, Activity } from "lucide-react";
import LaneStatus from "./LaneStatus";
import { useState } from "react";
import { SafetyTable } from "./components/Safetytable";





// src/Dashboard.jsx
import React from "react";
import PriorityScoreTable from "./components/PriorityTable";
import { generateTrafficData, calculateCPS } from "./utils/cpsUtils";
import VideoUpload from "./components/videoUpload";







export default function Dashboard() {
  const [isUploaded,ChangeIsUploaded] = useState(false);
  const [Lane, ChangeLane] = useState([
    "TS-A01",
    "TS-A02",
    "TS-A03",
    "TS-A04",
  ]);
const [trafficData, setTrafficData] = useState(generateTrafficData());

  function regenerateRandomData() {
    setTrafficData(generateTrafficData());
  }

  // compute intersection scores (CPS + breakdown) to pass to PriorityScoreTable
  const intersectionScores = Object.entries(trafficData.intersections).map(([id, data]) => {
    const calc = calculateCPS(data);
    return {
      id,
      ...calc,
    };
  });

  

  return (
    <>

      {
        isUploaded ? <>  <header className="inter-font flex justify-between items-center p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="ml-5 flex items-center space-x-8">
          <h1 className="text-xl font-bold text-gray-800">
            Traffic Control AI
          </h1>
          <nav className="hidden sm:flex space-x-6 text-sm">
            <a
              href="/main"
              className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
            >
              Dashboard
            </a>
            <a
              href="/main/level"
              className="text-gray-500 hover:text-blue-600 "
            >
              Congestion Reports
            </a>
            <a
              href="/main/lane"
              className="text-gray-500 hover:text-blue-600"
            >
              Lane
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600">
              Settings
            </a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="inter-font mt-5 px-10">
        <h2 className="font-bold text-4xl">Dashboard</h2>
        <h4 className="text-gray-600">
          Real-Time Traffic monitoring and management
        </h4>

        <div className="grid grid-cols-2 gap-20">
          {/* Column 1 */}
          <div>
            <h4 className="mt-6 font-semibold text-gray-700">
              Interactive Traffic Flow
            </h4>
            <LaneStatus ChangeLane={ChangeLane} />
          <h3 className="relative top-15 text-xl font-bold">Lane Status</h3>

          
          </div>

          {/* Column 2 */}
          <div className="mt-7 space-y-6">
            <h3 className="inter-font text-2xl m-2">Phase-2</h3>
              <SafetyTable lanes={Lane}/>
{/*           
            <div className="bg-white p-6 rounded-xl shadow-md border-[0.5px] border-red-500">
              <h4 className="font-semibold text-lg text-red-600 mb-4">
                Safety Overview
              </h4>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <TriangleAlert className="w-4 h-4 text-red-500 mr-2" />
                    Hard Braking
                  </span>
                  <span className="font-bold text-red-600">
                    {Lane.length * 3}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Activity className="w-4 h-4 text-red-500 mr-2" />
                    Tailgating
                  </span>
                  <span className="font-bold text-red-600">
                    {Lane.length * 2}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <FaTrafficLight className="w-4 h-4 text-red-500 mr-2" />
                    Avg Safety Score
                  </span>
                  <span className="font-bold text-red-600">
                    {Lane.length * 4}%
                  </span>
                </div>
              </div>
            </div> */}

            {/* Key Metrics */}
            <h3 className="inter-font text-xl font-bold m-2">Key Metrics</h3>
         
         <div className="flex gap-2  justify-around ">
  <Card
              title={"Total Vehicles"}
              description={"12,456"}
              logo={<BusFront />}
            />
            <Card title={"Avg Speed"} description={"45 mph"} logo={<Radar />} />
          
         </div>

 
      <PriorityScoreTable scores={intersectionScores} />
   



          </div>
        </div>
           <TrafficTable intersections={trafficData.intersections} />
   
        {/* Lane Table */}
     </div> </> : <VideoUpload ChangeScreen={ChangeIsUploaded}/>
      

}
    </>
  );
}
