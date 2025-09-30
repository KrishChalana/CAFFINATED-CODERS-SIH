// src/components/TrafficTable.jsx
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"; // adjust path if your ui/table is elsewhere
import { calculateTrafficScoreForLane } from "../utils/cpsUtils";

export default function TrafficTable({ intersections }) {
  // intersections: { A: { lanes, safety, platoon }, ... }
  const rows = [];

  Object.entries(intersections).forEach(([intersectionId, data]) => {
    Object.entries(data.lanes).forEach(([laneId, counts]) => {
      const totalVeh = Object.values(counts).reduce((a, b) => a + b, 0);
      const laneScore = calculateTrafficScoreForLane(counts);
      rows.push({ laneId, intersectionId, counts, totalVeh, laneScore });
    });
  });

  return (
    <div className="mt-10 mb-10 border-gray-200 border-2 rounded-md p-4 shadow-xl">
      <Table>
        <TableCaption>Lane Status</TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="w-[120px]">Lane Id</TableHead>
            <TableHead>Intersection</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Vehicle Count</TableHead>
            <TableHead>Bike</TableHead>
            <TableHead>Bus</TableHead>
            <TableHead>Car</TableHead>
            <TableHead>Truck</TableHead>
            <TableHead>Ambulance</TableHead>
            <TableHead className="text-right">Lane Score</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.laneId}>
              <TableCell className="font-medium">{r.laneId}</TableCell>
              <TableCell>{r.intersectionId}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  Open
                </span>
              </TableCell>
              <TableCell>{r.totalVeh}</TableCell>
              <TableCell>{r.counts.bike}</TableCell>
              <TableCell>{r.counts.bus}</TableCell>
              <TableCell>{r.counts.car}</TableCell>
              <TableCell>{r.counts.truck}</TableCell>
              <TableCell>{r.counts.ambulance}</TableCell>
              <TableCell className="text-right font-bold">{r.laneScore}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
