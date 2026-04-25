import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Mic, Square, FileAudio, Play, X, Sparkles } from "lucide-react";
import { Pipeline, PIPELINE_STEPS } from "@/components/Pipeline";
import { generateMockAnalysis, saveToHistory, api } from "@/services/api";
import { resultStore } from "@/lib/store";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze Call — CallShield" },
      { name: "description", content: "Upload or record audio and run it through CallShield's deepfake detection pipeline." },
      { property: "og:title", content: "Analyze Call — CallShield" },
      { property: "og:description", content: "Run a suspicious recording through the CallShield defense pipeline." },
    ],
  }),
  component: AnalyzePage,
});

function AnalyzePage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | Blob | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [done, setDone] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl]);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setFileName(f.name);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(URL.createObjectURL(f));
    setDone(false);
  }, [audioUrl]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const name = `recording_${Date.now()}.webm`;
        setFile(blob);
        setFileName(name);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      mediaRef.current = mr;
      setRecording(true);
      setRecordTime(0);
      timerRef.current = window.setInterval(() => setRecordTime((t) => t + 1), 1000);
    } catch (err) {
      alert("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setRecording(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  const runAnalysis = async () => {
    if (!file) return;
    setRunning(true);
    setDone(false);
    setActiveStep(0);
    // Try real backend, fall back to mock
    const backendPromise = api
      .analyzeAudio(file, fileName)
      .catch(() => null);

    for (let i = 0; i < PIPELINE_STEPS.length; i++) {
      setActiveStep(i);
      await new Promise((r) => setTimeout(r, 850));
    }
    const backend = await backendPromise;
    const result = backend && backend.trustScore != null
      ? { ...generateMockAnalysis(fileName), ...backend, fileName }
      : generateMockAnalysis(fileName);

    resultStore.set(result);
    saveToHistory(result);
    setDone(true);
    setRunning(false);
    setTimeout(() => navigate({ to: "/results" }), 600);
  };

  const reset = () => {
    setFile(null); setFileName(""); setDone(false);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Analyze</div>
        <h1 className="text-4xl font-bold">Run a call through the defense pipeline</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Upload a recorded call, voicemail, or capture live audio from your microphone.
          CallShield will execute the full detection pipeline and produce a trust score.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT: input */}
        <div className="space-y-5">
          {/* Upload zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={`glass rounded-2xl p-8 border-2 border-dashed transition-all ${
              isDragging ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-2xl bg-primary/15 flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Drop audio file here</h3>
              <p className="text-sm text-muted-foreground mt-1">
                MP3, WAV, M4A, WebM — up to 50 MB
              </p>
              <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 cursor-pointer text-sm font-medium transition-colors">
                <FileAudio className="h-4 w-4" />
                Browse files
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </label>
            </div>
          </div>

          {/* Mic */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2"><Mic className="h-4 w-4 text-primary" /> Live Capture</h3>
                <p className="text-xs text-muted-foreground">Record directly from your microphone</p>
              </div>
              {recording && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                  <span className="tabular-nums">{String(Math.floor(recordTime/60)).padStart(2,'0')}:{String(recordTime%60).padStart(2,'0')}</span>
                </div>
              )}
            </div>
            <button
              onClick={recording ? stopRecording : startRecording}
              className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                recording
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-gradient-to-r from-primary to-accent text-primary-foreground glow-cyber"
              }`}
            >
              {recording ? (<><Square className="h-4 w-4" /> Stop Recording</>) : (<><Mic className="h-4 w-4" /> Start Recording</>)}
            </button>
          </div>

          {/* Selected file */}
          <AnimatePresence>
            {file && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-strong rounded-2xl p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                    <Play className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{fileName}</div>
                    <div className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB • ready
                    </div>
                    {audioUrl && (
                      <audio src={audioUrl} controls className="mt-3 w-full h-10" />
                    )}
                  </div>
                  <button onClick={reset} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={runAnalysis}
                  disabled={running}
                  className="mt-4 w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground glow-cyber disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {running ? "Analyzing..." : "Run CallShield Detection"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: pipeline */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold">Detection Pipeline</h3>
              <p className="text-xs text-muted-foreground">5-stage real-time analysis</p>
            </div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              {running ? "Active" : done ? "Complete" : "Idle"}
            </div>
          </div>
          <Pipeline active={activeStep} done={done} />
          <div className="mt-6 text-xs text-muted-foreground glass rounded-lg p-3">
            <span className="text-primary font-medium">ⓘ</span> Pipeline runs locally first, then forwards
            features to the backend at <code className="text-foreground">/analyze_audio</code>. Mock data is used
            when the backend is unreachable.
          </div>
        </div>
      </div>
    </div>
  );
}
