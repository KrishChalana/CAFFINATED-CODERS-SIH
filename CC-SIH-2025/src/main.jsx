import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./Home";
import { ReactLenis, useLenis } from 'lenis/react'
import Dashboard  from "./Dashboard";
import CongestionReport from "./Congestion_report";
import LaneManagementDashboard from "./Lane_Management";
import LaneStatus from "./LaneStatus";
const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
 
 <>
  <ReactLenis root />
 <BrowserRouter>
   
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/main" element={<Dashboard />} />
      <Route path="/main/level" element={<CongestionReport/>} />
      <Route path="/main/lane" element={<LaneManagementDashboard />} />
      {/* <Route path="/main/lane_status" element={<LaneStatus/>}/> */}
{/* here we go again */}
    </Routes>
  </BrowserRouter>

   </>
);



