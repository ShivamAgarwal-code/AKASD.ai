
// The Algorithm.
// This is the space to design your reputation algorithm taking in account 
// multiple schemas across true network to calculate a reputation score for
// your users & the community. 
import { Attestations } from "./attestations";
// This is the starting point, calc function.
// Algorithm Compute Module (ACM) uses this as starting point to execute
// your reputation algorithm and expects an i64 as result.
export function calc(): i64 {
  const auraPoints: i64 = Attestations.auraPointsSchema.auraPoints;

  // Constants
  const BASE_MULTIPLIER: i64 = 1; // Minimum weight for votes
  const MAX_MULTIPLIER: i64 = 5; // Maximum weight for votes

  // Scale auraPoints directly to a reputation score
  let finalReputationScore: i64 = BASE_MULTIPLIER + auraPoints / 100;

  // Ensure the score stays within bounds
  if (finalReputationScore > MAX_MULTIPLIER) {
    return MAX_MULTIPLIER;
  } else if (finalReputationScore < BASE_MULTIPLIER) {
    return BASE_MULTIPLIER;
  }

  return finalReputationScore;
}