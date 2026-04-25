import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Shield, Activity, History, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analyze", label: "Analyze", icon: Activity },
  { to: "/results", label: "Results", icon: Shield },
  { to: "/history", label: "History", icon: History },
] as const;

export function Layout() {
  const loc = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-40" />
      <header className="sticky top-0 z-40 glass-strong border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/40 blur-lg group-hover:bg-primary/60 transition-all" />
              <Shield className="relative h-7 w-7 text-primary" strokeWidth={2.2} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg tracking-tight">
                Call<span className="text-gradient-cyber">Shield</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Deepfake Defense
              </span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => {
              const active =
                n.to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(n.to);
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {n.label}
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-muted-foreground">System Online</span>
          </div>
        </div>
      </header>
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <footer className="relative z-10 border-t border-border/50 py-6 px-6 text-center text-xs text-muted-foreground">
        CallShield © {new Date().getFullYear()} — Real-Time Audio Deepfake Detection
      </footer>
    </div>
  );
}
