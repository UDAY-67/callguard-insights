// Lightweight cross-route store for the latest analysis result.
import type { AnalysisResult } from "@/services/api";

let latest: AnalysisResult | null = null;

export const resultStore = {
  set(r: AnalysisResult) {
    latest = r;
  },
  get() {
    return latest;
  },
};
