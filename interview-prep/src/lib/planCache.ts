import type { FullStudyPlan } from "./types";

// In-memory cache — replace with Redis/DB in production
const cache = new Map<string, FullStudyPlan>();

export function storePlan(planId: string, plan: FullStudyPlan) {
  cache.set(planId, plan);
  // Auto-evict after 2 hours
  setTimeout(() => cache.delete(planId), 2 * 60 * 60 * 1000);
}

export function getPlan(planId: string): FullStudyPlan | null {
  return cache.get(planId) ?? null;
}
