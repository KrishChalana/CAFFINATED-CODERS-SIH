// src/components/PriorityScoreTable.jsx
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"; // adjust path

export default function PriorityScoreTable({ scores }) {
  // scores: [{ id, cps, trafficScore, safetyPenalty, priorityBonus, platoonSpeed }, ...]
  return (
    <div className="bg-white rounded-xl shadow-md border border-indigo-200 p-4 mt-6">
      <h3 className="text-lg font-semibold mb-4 text-indigo-600">Scores</h3>
      <Table>
        <TableCaption className="text-gray-500">
          Coordinated Priority Scoring per Intersection
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-green-200">
            <TableHead className="font-semibold">Intersection ID</TableHead>
            <TableHead className="text-green-700 font-semibold text-center">CPS Score</TableHead>
            {/* <TableHead className="text-green-700 font-semibold text-center">Platoon Speed</TableHead> */}
            <TableHead className="text-green-700 font-semibold text-center">Priority Bonus</TableHead>
            <TableHead className="text-green-700 font-semibold text-center">Traffic Score</TableHead>
            <TableHead className="text-green-700 font-semibold text-center">Safety Penalty</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {scores.map((s) => (
            <TableRow key={s.id} className="hover:bg-indigo-50 transition">
              <TableCell className="font-medium text-gray-800">{s.id}</TableCell>
              <TableCell className="text-center font-bold text-gray-500">{s.cps}</TableCell>
              <TableCell className="text-center font-bold text-gray-500">{s.platoonSpeed}</TableCell>
              <TableCell className="text-center font-bold text-gray-500">{s.priorityBonus}</TableCell>
              <TableCell className="text-center text-gray-500">{s.trafficScore}</TableCell>
              <TableCell className="text-center text-gray-500">{s.safetyPenalty}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
