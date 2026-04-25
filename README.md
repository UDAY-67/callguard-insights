# 🛡️ CallShield — Real-Time Audio Deepfake Detection

> A cybersecurity-grade frontend for detecting AI-cloned voices and voice-phishing (vishing) attacks in real time.

CallShield ingests an audio call (uploaded file or live microphone capture), pushes it through a 5-stage detection pipeline, and produces a **Trust Score (0–100)** along with three sub-scores: **Voice Authenticity**, **Identity Match**, and **Context Risk**.

---

## ✨ Features

- **Multi-page product UI** — Dashboard, Analyze, Results, History
- **Audio input** — drag-and-drop file upload + live microphone recording
- **Real-time pipeline visualization** — animated 5-step detection flow
- **Multi-score system** — 4 distinct scores rendered as animated rings
- **Verdict banner** — `SAFE` / `SUSPICIOUS` / `SCAM` color-coded alert
- **Visual analytics** — waveform chart (Recharts) and MFCC heatmap
- **AI reasoning panel** — human-readable explanation of the decision
- **History** — persisted past analyses (localStorage) + mock fixtures
- **Dark cybersecurity theme** with glassmorphism, scan lines, glow effects
- **Framer Motion animations** throughout
- **Backend-ready** — clean API service layer with graceful mock fallback

---

## 🧱 Tech Stack

- **React 19** + **TanStack Start** (file-based routing, SSR-ready)
- **Tailwind CSS v4** (semantic design tokens via `oklch`)
- **Framer Motion** (page + element animations)
- **Recharts** (waveform visualization)
- **Lucide React** (icons)
- **TypeScript** (strict)

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── Layout.tsx          # Shell + top navigation
│   ├── Pipeline.tsx        # Animated 5-step pipeline
│   ├── ScoreRing.tsx       # Circular score indicator
│   ├── Waveform.tsx        # Recharts audio waveform
│   ├── MFCCHeatmap.tsx     # MFCC coefficient heatmap
│   └── AlertBanner.tsx     # SAFE/SUSPICIOUS/SCAM banner
├── routes/
│   ├── __root.tsx          # Root layout + meta
│   ├── index.tsx           # / → Dashboard
│   ├── analyze.tsx         # /analyze → Upload + record + run pipeline
│   ├── results.tsx         # /results → Full report
│   └── history.tsx         # /history → Past analyses
├── services/
│   └── api.ts              # FastAPI client + mock generator
├── lib/
│   └── store.ts            # Cross-route result store
└── styles.css              # Design system (dark cyber theme)
```

---

## 🚀 Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173 (or the port shown in your terminal).

Build for production:
```bash
npm run build
```

---

## 🔌 Backend Integration Guide

CallShield's frontend is wired to call a FastAPI backend exposing three endpoints:

| Method | Endpoint           | Purpose                                  |
|--------|--------------------|------------------------------------------|
| POST   | `/analyze_audio`   | Run full deepfake pipeline on audio file |
| POST   | `/compare_voice`   | Speaker embedding identity match         |
| POST   | `/risk_score`      | NLP-based context risk on transcript     |

### Step 1 — Start your FastAPI server

```bash
uvicorn main:app --reload --port 8000
```

Make sure CORS allows your frontend origin:
```python
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 2 — Update API base URL

Create a `.env` file at the project root:
```
VITE_API_BASE_URL=http://localhost:8000
```

The default is `http://localhost:8000` (see `src/services/api.ts`).

### Step 3 — Replace mock data with real API

The frontend already calls the backend in `src/routes/analyze.tsx`:
```ts
const backend = await api.analyzeAudio(file, fileName).catch(() => null);
```
If the backend responds with a valid payload, it's used directly. If unreachable, mock data from `generateMockAnalysis()` is used so the UI is always demoable.

### Step 4 — Test endpoints

Example request format (multipart/form-data):
```bash
curl -X POST http://localhost:8000/analyze_audio \
  -F "file=@sample_call.wav"
```

Example expected response shape:
```json
{
  "voiceAuthenticity": 72,
  "identityMatch": 65,
  "contextRisk": 38,
  "trustScore": 71,
  "verdict": "SAFE",
  "reasoning": [
    "Natural prosody and pitch variation detected.",
    "Voice fingerprint aligns with verified speaker pattern."
  ],
  "waveform": [{ "t": 0, "v": 0.12 }, { "t": 1, "v": 0.18 }],
  "mfcc": [[0.1, -0.2, 0.3]],
  "fileName": "sample_call.wav",
  "durationSec": 12,
  "timestamp": "2026-04-25T10:30:00Z"
}
```

---

## 🧠 Detection Pipeline

```
Audio → Features → Voice Analysis → Identity → Context → Risk Engine → Trust Score
```

1. **Extract features** — MFCC, spectral centroid, pitch contour
2. **Voice authenticity** — deepfake / vocoder detector
3. **Identity matching** — speaker embedding vs. known profile
4. **Context risk** — NLP urgency / financial keyword scoring
5. **Score fusion** — weighted aggregate → final Trust Score

---

## 🔮 Future Improvements

- WebSocket streaming for real-time call monitoring
- Browser extension for in-call protection (Zoom / Meet / Teams)
- Authenticated voiceprint enrollment per user
- Multi-language NLP risk scoring
- Mobile native app (React Native)
- On-device inference via ONNX Web

---

Built for hackathons. Demo-ready. Backend-optional.
