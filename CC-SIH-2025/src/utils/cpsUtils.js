// src/utils/cpsUtils.js
// CPS helper functions, random generators and constants

export const VEHICLE_WEIGHTS = {
  ambulance: 12,
  bus: 3.5,
  truck: 2.5,
  car: 1,
  bike: 0.3,
};

export const SAFETY_WEIGHT = 0.12;
export const ALPHA_H = 2;
export const ALPHA_T = 1;
export const GREEN_WAVE_WEIGHT = 0.23;

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate lanes for one intersection.
 * Lane IDs format: TS-{intersectionId}-{NN} where NN = 01..numLanes
 */
export function generateLanesForIntersection(intersectionId, numLanes = 3) {
  const lanes = {};
  for (let i = 1; i <= numLanes; i++) {
    const laneId = `TS-${intersectionId}-${String(i).padStart(2, "0")}`;
    lanes[laneId] = {
      ambulance: randInt(0, 2),
      bus: randInt(0, 5),
      truck: randInt(0, 10),
      car: randInt(0, 50),
      bike: randInt(0, 30),
    };
  }
  return lanes;
}

/**
 * Generate full random traffic dataset
 * intersections: { A: { lanes, safety, platoon }, B: {...}, ... }
 */
export function generateTrafficData() {
  const intersections = {};
  ["A", "B", "C", "D"].forEach((id) => {
    const lanes = generateLanesForIntersection(id, 3); // three lanes per intersection
    const safety = { hardBraking: randInt(0, 10), tailgating: randInt(0, 15) };
    const platoon = { weight: randInt(0, 200), currentETA: randInt(1, 60) };
    intersections[id] = { lanes, safety, platoon };
  });
  return { intersections };
}

/* --------- Calculation helpers --------- */

export function calculateTrafficScoreForLane(laneCounts) {
  let score = 0;
  for (const [vehicle, count] of Object.entries(laneCounts)) {
    const w = VEHICLE_WEIGHTS[vehicle] || 0;
    score += w * count;
  }
  return Number(score.toFixed(3));
}

export function calculateTrafficScoreForIntersection(intersection) {
  return Object.values(intersection.lanes).reduce(
    (sum, lane) => sum + calculateTrafficScoreForLane(lane),
    0
  );
}

export function calculateSafetyPenalty(safety) {
  const crate = ALPHA_H * safety.hardBraking + ALPHA_T * safety.tailgating;
  const penalty = SAFETY_WEIGHT * crate;
  return Number(penalty.toFixed(3));
}

export function calculatePriorityBonus(platoon) {
  // As per formula: MAX_ETA = current_eta * 6
  const { weight, currentETA } = platoon;
  const MAX_ETA = currentETA * 6;
  const factor = Math.max(0, 1 - currentETA / MAX_ETA); // note: simplifies to 5/6 in this exact formula
  const bonus = GREEN_WAVE_WEIGHT * weight * factor;
  return Number(bonus.toFixed(3));
}

/**
 * Full CPS result for an intersection
 */
export function calculateCPS(intersection) {
  const trafficScore = calculateTrafficScoreForIntersection(intersection);
  const safetyPenalty = calculateSafetyPenalty(intersection.safety);
  const priorityBonus = calculatePriorityBonus(intersection.platoon);

  const cps = trafficScore - safetyPenalty + priorityBonus;

  const platoonSpeed = Number(
    (intersection.platoon.weight / Math.max(1, intersection.platoon.currentETA)).toFixed(3)
  );

  return {
    trafficScore: Number(trafficScore.toFixed(3)),
    safetyPenalty,
    priorityBonus,
    cps: Number(cps.toFixed(3)),
    platoonSpeed,
  };
}
