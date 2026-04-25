import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity, Shield, Zap, AudioLines, ArrowRight, Lock, Brain, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CallShield — Real-Time Audio Deepfake Detection" },
      { name: "description", content: "CallShield detects AI-generated voices and phishing calls in real time using a multi-stage trust scoring engine." },
      { property: "og:title", content: "CallShield — Real-Time Audio Deepfake Detection" },
      { property: "og:description", content: "Stop voice phishing and deepfake scams with a real-time AI defense pipeline." },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Calls Analyzed", value: "1,284,902", icon: AudioLines },
  { label: "Deepfakes Blocked", value: "37,418", icon: Shield },
  { label: "Avg. Detection Time", value: "1.8s", icon: Zap },
  { label: "Model Accuracy", value: "98.4%", icon: Brain },
];

const features = [
  {
    icon: AudioLines,
    title: "Voice Authenticity",
    desc: "Spectral and prosodic analysis isolates synthetic vocoder artifacts invisible to the human ear.",
  },
  {
    icon: Lock,
    title: "Identity Matching",
    desc: "Speaker embeddings compared against verified voiceprints to surface impersonation attempts.",
  },
  {
    icon: AlertTriangle,
    title: "Context Risk Engine",
    desc: "NLP scoring of urgency, financial keywords and social-engineering patterns in live transcripts.",
  },
];

function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      {/* Hero */}
      <div className="grid lg:grid-cols-5 gap-10 items-center">
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs uppercase tracking-widest text-primary mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Live Defense Engine v2.1
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]"
          >
            Stop voice phishing
            <br />
            <span className="text-gradient-cyber">before it happens.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg text-muted-foreground max-w-xl"
          >
            CallShield is a real-time defense layer that fingerprints every call,
            detects AI-cloned voices, and scores the conversation for social
            engineering risk — in under two seconds.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              to="/analyze"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-primary-foreground bg-gradient-to-r from-primary to-accent glow-cyber hover:scale-[1.02] transition-transform"
            >
              Start Analysis
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/history"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold glass hover:bg-secondary/60 transition-colors"
            >
              View History
            </Link>
          </motion.div>
        </div>

        {/* Animated visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 relative aspect-square max-w-md mx-auto w-full"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-3xl" />
          <div className="relative h-full w-full rounded-full glass-strong flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-30" />
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-primary/40"
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 1 }}
                style={{ inset: "30%" }}
              />
            ))}
            <Shield className="relative h-24 w-24 text-primary" strokeWidth={1.5} />
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="glass rounded-2xl p-5"
            >
              <Icon className="h-5 w-5 text-primary mb-3" />
              <div className="text-2xl font-bold tabular-nums">{s.value}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                {s.label}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Features */}
      <div className="mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">The Pipeline</div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Four layers of defense, one trust score.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 hover:border-primary/40 transition-colors"
              >
                <div className="h-11 w-11 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="font-semibold text-lg">{f.title}</div>
                <div className="text-sm text-muted-foreground mt-2">{f.desc}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-20 glass-strong rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <Activity className="relative h-10 w-10 mx-auto text-primary mb-4" />
        <h3 className="relative text-2xl md:text-3xl font-bold">Ready to analyze a call?</h3>
        <p className="relative text-muted-foreground mt-2 max-w-lg mx-auto">
          Upload a recording or capture audio live from your microphone. Results in seconds.
        </p>
        <Link
          to="/analyze"
          className="relative mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-primary-foreground bg-gradient-to-r from-primary to-accent"
        >
          Run Detection <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
