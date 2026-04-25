import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

export interface PipelineStep {
  id: string;
  label: string;
  detail: string;
}

export const PIPELINE_STEPS: PipelineStep[] = [
  { id: "features", label: "Extracting Features", detail: "MFCC, spectral centroid, pitch contour" },
  { id: "voice", label: "Voice Authenticity Analysis", detail: "Deepfake / synthesis detector" },
  { id: "identity", label: "Identity Matching", detail: "Speaker embedding comparison" },
  { id: "context", label: "Context Risk Analysis", detail: "Transcript NLP / urgency scoring" },
  { id: "score", label: "Generating Trust Score", detail: "Fusion engine + risk weighting" },
];

export function Pipeline({ active, done }: { active: number; done: boolean }) {
  return (
    <div className="space-y-3">
      {PIPELINE_STEPS.map((step, idx) => {
        const isDone = done || idx < active;
        const isActive = !done && idx === active;
        const isPending = !done && idx > active;
        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={`glass rounded-xl p-4 flex items-center gap-4 transition-all ${
              isActive ? "border-primary/60 glow-cyber" : ""
            } ${isPending ? "opacity-50" : ""}`}
          >
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                isDone
                  ? "bg-success/20 text-success"
                  : isActive
                  ? "bg-primary/20 text-primary animate-pulse-ring"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isDone ? (
                <Check className="h-5 w-5" />
              ) : isActive ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="text-sm font-semibold">{idx + 1}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{step.label}</div>
              <div className="text-xs text-muted-foreground">{step.detail}</div>
              {isActive && (
                <div className="mt-2 h-1 bg-muted rounded overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.4, ease: "easeInOut" }}
                  />
                </div>
              )}
            </div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground shrink-0">
              {isDone ? "Done" : isActive ? "Running" : "Queued"}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
