// CallShield API service
// Connect to FastAPI backend. Set VITE_API_BASE_URL env var to override.

export const API_BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE_URL) ||
  "http://localhost:8000";

export interface AnalysisResult {
  voiceAuthenticity: number;
  identityMatch: number;
  contextRisk: number;
  trustScore: number;
  verdict: "SAFE" | "SUSPICIOUS" | "SCAM";
  reasoning: string[];
  waveform: { t: number; v: number }[];
  mfcc: number[][];
  fileName: string;
  durationSec: number;
  timestamp: string;
}

async function postFile(endpoint: string, file: Blob, fileName = "audio.wav") {
  const fd = new FormData();
  fd.append("file", file, fileName);
  const res = await fetch(`${API_BASE_URL}${endpoint}`, { method: "POST", body: fd });
  if (!res.ok) throw new Error(`${endpoint} failed: ${res.status}`);
  return res.json();
}

export const api = {
  analyzeAudio: (file: Blob, name?: string) => postFile("/analyze_audio", file, name),
  compareVoice: (file: Blob, name?: string) => postFile("/compare_voice", file, name),
  riskScore: (file: Blob, name?: string) => postFile("/risk_score", file, name),
};

// ---------- MOCK DATA (used when backend unavailable) ----------

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function generateMockAnalysis(fileName: string): AnalysisResult {
  const r = rand(fileName.length * 17 + Date.now() % 1000);
  const voice = Math.round(30 + r() * 65);
  const identity = Math.round(25 + r() * 70);
  const context = Math.round(20 + r() * 75); // higher = riskier
  const trust = Math.round(voice * 0.4 + identity * 0.35 + (100 - context) * 0.25);

  const verdict: AnalysisResult["verdict"] =
    trust >= 70 ? "SAFE" : trust >= 45 ? "SUSPICIOUS" : "SCAM";

  const reasoning: string[] = [];
  if (voice < 60) reasoning.push("Low pitch variation suggests synthetic voice generation.");
  else reasoning.push("Natural prosody and pitch variation detected.");
  if (identity < 60) reasoning.push("Voice fingerprint does not match known speaker profile.");
  else reasoning.push("Voice fingerprint aligns with verified speaker pattern.");
  if (context > 50) reasoning.push("High urgency language and financial keywords detected.");
  else reasoning.push("Conversational context appears benign.");
  if (trust < 45) reasoning.push("Spectral artifacts consistent with neural vocoder synthesis.");

  const waveform = Array.from({ length: 200 }, (_, i) => ({
    t: i,
    v: Math.sin(i * 0.18) * (0.4 + r() * 0.5) + (r() - 0.5) * 0.4,
  }));

  const mfcc = Array.from({ length: 13 }, () =>
    Array.from({ length: 40 }, () => r() * 2 - 1)
  );

  return {
    voiceAuthenticity: voice,
    identityMatch: identity,
    contextRisk: context,
    trustScore: trust,
    verdict,
    reasoning,
    waveform,
    mfcc,
    fileName,
    durationSec: 8 + Math.round(r() * 30),
    timestamp: new Date().toISOString(),
  };
}

// ---------- HISTORY (localStorage) ----------

const HISTORY_KEY = "callshield_history";

export function saveToHistory(result: AnalysisResult) {
  if (typeof window === "undefined") return;
  const list = getHistory();
  list.unshift(result);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 25)));
}

export function getHistory(): AnalysisResult[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getMockHistory(): AnalysisResult[] {
  const stored = getHistory();
  if (stored.length > 0) return stored;
  return [
    generateMockAnalysis("call_support_amex.wav"),
    generateMockAnalysis("voicemail_irs_urgent.mp3"),
    generateMockAnalysis("ceo_wire_request.wav"),
    generateMockAnalysis("family_check_in.mp3"),
  ];
}
