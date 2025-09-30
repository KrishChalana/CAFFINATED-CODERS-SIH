import React, { useState, useEffect } from "react";
import "./Home.css";

// Formula to calculate clear time
const calculateClearTime = (vehicles) => {
  if (vehicles <= 0) return 0;

  // For up to 4 vehicles, sum fixed values
  const baseTimes = [3.1, 2.8, 2.7, 2.2];
  if (vehicles <= 4) {
    return baseTimes.slice(0, vehicles).reduce((a, b) => a + b, 0);
  }

  // More than 4 → add (N-4)*2.1
  return baseTimes.reduce((a, b) => a + b, 0) + (vehicles - 4) * 2.1;
};

// Fake intersection data
const fakeData = {
  A: [
    { name: "North", signal: "green", score: 80, vehicles: Math.random() * 50 },
    { name: "East", signal: "red", score: 60, vehicles: Math.random() * 23 },
    { name: "South", signal: "red", score: 45, vehicles: Math.random() *24 },
    { name: "West", signal: "red", score: 30, vehicles: Math.random() *32 },
  ],
  B: [
    { name: "North", signal: "green", score: 25, vehicles: Math.random() *36 },
    { name: "East", signal: "red", score: 90, vehicles: Math.random() * 24 },
    { name: "South", signal: "red", score: 65, vehicles: Math.random() * 25 },
    { name: "West", signal: "red", score: 35, vehicles: Math.random() * 13 },
  ],
  C: [
    { name: "North", signal: "green", score: 55, vehicles: Math.random() * 22 },
    { name: "East", signal: "red", score: 40, vehicles: Math.random() *  33 },
    { name: "South", signal: "red", score: 85, vehicles: Math.random() * 50 },
    { name: "West", signal: "red", score: 25, vehicles: Math.random() * 11 },
  ],
};

export default function LaneStatus({ ChangeLane }) {
  const [intersection, setIntersection] = useState("A");
const fakeData = {
  A: [
    { name: "North", signal: "green", score: 80, vehicles: Math.random() * 50 },
    { name: "East", signal: "red", score: 60, vehicles: Math.random() * 23 },
    { name: "South", signal: "red", score: 45, vehicles: Math.random() *24 },
    { name: "West", signal: "red", score: 30, vehicles: Math.random() *32 },
  ],
  B: [
    { name: "North", signal: "green", score: 25, vehicles: Math.random() *36 },
    { name: "East", signal: "red", score: 90, vehicles: Math.random() * 24 },
    { name: "South", signal: "red", score: 65, vehicles: Math.random() * 25 },
    { name: "West", signal: "red", score: 35, vehicles: Math.random() * 13 },
  ],
  C: [
    { name: "North", signal: "green", score: 55, vehicles: Math.random() * 22 },
    { name: "East", signal: "red", score: 40, vehicles: Math.random() *  33 },
    { name: "South", signal: "red", score: 85, vehicles: Math.random() * 50 },
    { name: "West", signal: "red", score: 25, vehicles: Math.random() * 11 },
  ],
};

  // Initialize lanes with correct green time
  const [lanes, setLanes] = useState(() =>
    fakeData["A"].map((lane) => ({
      ...lane,
      time: lane.signal === "green" ? Math.ceil(calculateClearTime(lane.vehicles)) : 0,
    }))
  );

  // Send lane IDs to parent
  useEffect(() => {
    const newLaneNames = lanes.map((_, idx) => `TS-${intersection}0${idx + 1}`);
    if (ChangeLane) ChangeLane(newLaneNames);
  }, [lanes, intersection, ChangeLane]);

  // Signal cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setLanes((prev) => {
        let updated = [...prev];
        let greenIdx = updated.findIndex((lane) => lane.signal === "green");

        if (greenIdx === -1) return updated;

        if (updated[greenIdx].time > 1) {
          // countdown
          updated[greenIdx].time -= 1;
        } else {
          // current turns red
          updated[greenIdx].signal = "red";
          updated[greenIdx].time = 0;

          // move to next lane
          let nextIdx = (greenIdx + 1) % updated.length;
          updated[nextIdx].signal = "green";
          updated[nextIdx].time = Math.ceil(calculateClearTime(updated[nextIdx].vehicles));
        }
        return [...updated];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const changeIntersection = (id) => {
    setIntersection(id);
    setLanes(
      fakeData[id].map((lane) => ({
        ...lane,
        time: lane.signal === "green" ? Math.ceil(calculateClearTime(lane.vehicles)) : 0,
      }))
    );
  };

  return (
    <div className="inter-font text-gray-800 p-6 min-h-screen">
      {/* Intersection Controls */}
      <div className="flex justify-center mb-8">
        <select
          value={intersection}
          onChange={(e) => changeIntersection(e.target.value)}
          className="border-2 border-indigo-200 rounded-lg px-4 py-2 bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-400"
        >
          <option value="A">Intersection A</option>
          <option value="B">Intersection B</option>
          <option value="C">Intersection C</option>
        </select>
      </div>

      {/* Road intersection layout */}
      <div className="relative w-[420px] h-[420px] mx-auto bg-gray-50 border-4 border-gray-300 rounded-xl shadow-md">
        {/* Vertical road */}
        <div className="absolute top-0 bottom-0 left-1/2 w-24 -translate-x-1/2 bg-gray-200"></div>
        {/* Horizontal road */}
        <div className="absolute left-0 right-0 top-1/2 h-24 -translate-y-1/2 bg-gray-200"></div>

        {lanes.map((lane, idx) => {
          const positions = [
            { top: "20px", left: "50%", transform: "translateX(-50%)" }, // North
            { right: "20px", top: "50%", transform: "translateY(-50%)" }, // East
            { bottom: "20px", left: "50%", transform: "translateX(-50%)" }, // South
            { left: "20px", top: "50%", transform: "translateY(-50%)" }, // West
          ];

          const colors = {
            green: "bg-green-500 shadow-md shadow-green-300",
            yellow:
              "bg-yellow-300 border border-yellow-600 shadow-md shadow-yellow-200",
            red: "bg-red-400 shadow-md shadow-red-200",
          };

          return (
            <div
              key={lane.name}
              className="absolute flex flex-col items-center text-center p-2"
              style={{ ...positions[idx] }}
            >
              {/* Signal light */}
              <div
                className={`w-10 h-10 rounded-full ${colors[lane.signal]} mb-3 border-2 border-white`}
              ></div>

              {/* Vehicles */}
              <div className="flex gap-1 flex-wrap justify-center max-w-[80px] mb-3">
                {Array.from({ length: lane.vehicles }).map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full bg-blue-400 shadow-sm"
                  ></div>
                ))}
              </div>

              {/* Timer */}
              {lane.signal === "green" && (
                <div className="z-[-1] text-sm font-bold text-green-700 mb-1">
                  {lane.time}s
                </div>
              )}

              {/* Score */}
              <div className="text-xs z-[-1] font-medium text-gray-700 mb-1">
                Score: <span className="text-indigo-600">{lane.score}</span>
              </div>

              {/* Lane ID */}
              <div className="text-xs z-[-1] font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-md shadow-sm">
                TS-{intersection}0{idx + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
