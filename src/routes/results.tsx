import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ScoreRing } from "@/components/ScoreRing";
import { Waveform } from "@/components/Waveform";
import { MFCCHeatmap } from "@/components/MFCCHeatmap";
import { AlertBanner } from "@/components/AlertBanner";
import { resultStore } from "@/lib/store";
import { generateMockAnalysis } from "@/services/api";
import { ArrowLeft, Brain, Activity, Clock, FileAudio } from "lucide-react";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Analysis Results — CallShield" },
      { name: "description", content: "Detailed CallShield trust score, voice authenticity, identity match, and context risk results." },
      { property: "og:title", content: "Analysis Results — CallShield" },
      { property: "og:description", content: "Inspect the multi-score trust report for the analyzed call." },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const result = resultStore.get() ?? generateMockAnalysis("sample_call.wav");

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Link to="/analyze" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3">
            <ArrowLeft className="h-4 w-4" /> Back to Analyze
          </Link>
          <h1 className="text-4xl font-bold">Analysis Report</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><FileAudio className="h-4 w-4" /> {result.fileName}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {result.durationSec}s</span>
            <span>{new Date(result.timestamp).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <AlertBanner verdict={result.verdict} score={result.trustScore} />

      {/* Scores */}
      <div className="grid md:grid-cols-4 gap-5">
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="glass-strong rounded-2xl p-6 flex flex-col items-center md:col-span-1 md:row-span-1">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Final</div>
          <ScoreRing value={result.trustScore} label="Trust Score" size={170} />
        </motion.div>
        {[
          { label: "Voice Authenticity", value: result.voiceAuthenticity, invert: false },
          { label: "Identity Match", value: result.identityMatch, invert: false },
          { label: "Context Risk", value: result.contextRisk, invert: true },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{opacity:0,y:10}}
            animate={{opacity:1,y:0}}
            transition={{delay:0.1+i*0.08}}
            className="glass rounded-2xl p-6 flex flex-col items-center justify-center"
          >
            <ScoreRing value={s.value} label={s.label} invert={s.invert} />
            <div className="mt-4 w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${s.value}%` }}
                transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                className="h-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Visualizations */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Audio Waveform</h3>
              <p className="text-xs text-muted-foreground">Amplitude over time</p>
            </div>
          </div>
          <Waveform data={result.waveform} />
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2"><Brain className="h-4 w-4 text-primary" /> MFCC Heatmap</h3>
              <p className="text-xs text-muted-foreground">13 mel-frequency cepstral coefficients</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
              <span className="h-2 w-4 rounded" style={{ background: "rgb(20,180,220)" }} />
              low
              <span className="h-2 w-4 rounded" style={{ background: "rgb(255,20,220)" }} />
              high
            </div>
          </div>
          <MFCCHeatmap data={result.mfcc} />
        </div>
      </div>

      {/* Reasoning */}
      <div className="glass-strong rounded-2xl p-6">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-primary" /> AI Reasoning
        </h3>
        <ul className="space-y-3">
          {result.reasoning.map((r, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30"
            >
              <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                {i + 1}
              </div>
              <span className="text-sm">{r}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3">
        <Link to="/analyze" className="px-5 py-2.5 rounded-lg glass hover:bg-secondary/60 text-sm font-medium">
          Analyze another call
        </Link>
        <Link to="/history" className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-semibold">
          View history
        </Link>
      </div>
    </div>
  );
}
