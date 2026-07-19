import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Award, TrendingUp, RefreshCw, AlertTriangle, 
  MapPin, Brain, Calendar, Clock, ArrowRight, Zap, BookOpen, UserCheck,
  Globe, Layers, Cpu, Database, Terminal, CheckCircle2, ChevronRight, Activity, 
  RotateCcw, Sliders, Play, ShieldAlert, Info, LineChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, RevisionSchedule, Circular } from '../types';

interface DashboardProps {
  profile: UserProfile;
  revisionItems: RevisionSchedule[];
  upcomingCirculars: Circular[];
  onNavigate: (section: string) => void;
  onQuickPractice: () => void;
}

// Stagger animation container
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 110,
      damping: 14
    }
  }
};

// Helper for rolling numeric stats
const StatCounter = ({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1200; // ms
    let startTime: number | null = null;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuad = (t: number) => t * (2 - t);
      const current = Math.floor(start + easeOutQuad(progress) * (end - start));
      setDisplayValue(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <span className="font-mono tabular-nums">{prefix}{displayValue.toLocaleString()}{suffix}</span>;
};

export default function Dashboard({ 
  profile, 
  revisionItems, 
  upcomingCirculars, 
  onNavigate,
  onQuickPractice
}: DashboardProps) {
  
  const urgentRevisions = revisionItems.filter(item => item.urgencyScore > 50).slice(0, 3);
  
  // Real-time ticking clock
  const [timeStr, setTimeStr] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");
  const [greeting, setGreeting] = useState<{ bn: string; en: string }>({ bn: "আসসালামু আলাইকুম", en: "Welcome" });
  
  // Interactive audit state
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [currentStepName, setCurrentStepName] = useState<string>("");

  // Hover position for card-glow effect tracking
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringHeader, setIsHoveringHeader] = useState(false);

  // Simulated live metrics ticker for "alive" UI
  const [cpuUsage, setCpuUsage] = useState(42);
  const [pingMs, setPingMs] = useState(38);
  const [neuralLoads, setNeuralLoads] = useState<number[]>([42, 45, 48, 55, 52, 58, 62]);

  // Selected bento sub-details state
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Simulated Log State
  const [systemLogs, setSystemLogs] = useState<string[]>([
    "[SYSTEM] Diagnostic module successfully mounted.",
    "[GATEWAY] Synced 12 daily practice routines with cloud store.",
    "[PSYCHOMETRICS] Computed retention curve for Bangla Grammar: সন্ধি বিচ্ছেদ",
    "[AI CORE] Cached 1.5 Pro syllabus weight models."
  ]);
  
  // Heatmap interactive state
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{ day: number; count: number; accuracy: number; duration: number } | null>({
    day: 12,
    count: 4,
    accuracy: 85,
    duration: 18
  });

  // Mouse move handler for premium cursor glow on header card
  const handleMouseMoveHeader = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Load live clock, BD greetings & neural activity simulations
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const optionsTime: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setTimeStr(now.toLocaleTimeString('en-US', optionsTime));
      
      const optionsDate: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      };
      setDateStr(now.toLocaleDateString('en-US', optionsDate));

      const hr = now.getHours();
      if (hr >= 5 && hr < 12) {
        setGreeting({ bn: "শুভ সকাল", en: "Good Morning" });
      } else if (hr >= 12 && hr < 16) {
        setGreeting({ bn: "শুভ দুপুর", en: "Good Afternoon" });
      } else if (hr >= 16 && hr < 18) {
        setGreeting({ bn: "শুভ বিকেল", en: "Good Afternoon" });
      } else if (hr >= 18 && hr < 23) {
        setGreeting({ bn: "শুভ সন্ধ্যা", en: "Good Evening" });
      } else {
        setGreeting({ bn: "শুভ রাত্রি", en: "Good Night" });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Live telemetry variations
    const telemetryInterval = setInterval(() => {
      setCpuUsage(prev => Math.min(95, Math.max(30, prev + Math.floor(Math.random() * 9) - 4)));
      setPingMs(prev => Math.min(120, Math.max(20, prev + Math.floor(Math.random() * 11) - 5)));
      setNeuralLoads(prev => {
        const next = [...prev.slice(1), Math.floor(Math.random() * 40) + 40];
        return next;
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(telemetryInterval);
    };
  }, []);

  // Simulating live rolling system logs
  useEffect(() => {
    const logTemplates = [
      "MEMORY: Analyzed spaced repetition triggers; 3 topics require immediate retention shielding.",
      "COMPILER: Refactored adaptive diagnostic bank weights for 9th Grade syllabus.",
      "TELEMETRY: Recalibrated predicted rank based on latest district median accuracy (74.8%).",
      "AI ENGINE: Hydrated local context cache using Gemini 1.5 core embeddings.",
      "PSYCHOMETRICS: Updated student confidence limit to 98.1% based on consistency index.",
      "COGNITIVE: Detected high active recall potential on English Literature revisions.",
      "GATEWAY: Handshake completed securely with core validation clusters."
    ];

    const logInterval = setInterval(() => {
      if (isAuditing) return;
      const randomMsg = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      setSystemLogs(prev => {
        const next = [...prev, `[${nowStr}] ${randomMsg}`];
        return next.slice(-4);
      });
    }, 6000);

    return () => clearInterval(logInterval);
  }, [isAuditing]);

  // Run mock full audit diagnostic
  const triggerAudit = () => {
    if (isAuditing) return;
    setIsAuditing(true);
    setAuditProgress(0);
    setCurrentStepName("INITIALIZING DYNAMIC COGNITIVE SCAN");
    
    setSystemLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString('en-US', { hour12: false })}] INITIALIZING DYNAMIC COGNITIVE SCAN...`
    ].slice(-4));

    let currentProg = 0;
    const interval = setInterval(() => {
      currentProg += 5;
      setAuditProgress(currentProg);
      
      if (currentProg === 15) {
        setCurrentStepName("Analyzing math formulas & syllabus matrices...");
        setSystemLogs(prev => [...prev, "[SCAN] Analyzing math formula templates and topic matrices..."].slice(-4));
      } else if (currentProg === 40) {
        setCurrentStepName("Mapping retention decay vectors...");
        setSystemLogs(prev => [...prev, "[AI ENGINE] Evaluating retention limits and memory decay paths..."].slice(-4));
      } else if (currentProg === 70) {
        setCurrentStepName("Simulating candidate percentile projections...");
        setSystemLogs(prev => [...prev, "[PSYCHOMETRICS] Projecting passing probability to 99.8% confidence level..."].slice(-4));
      } else if (currentProg === 90) {
        setCurrentStepName("Optimizing Gemini AI session embedding context...");
        setSystemLogs(prev => [...prev, "[AI ENGINE] Embedding space matched to 9th Grade Board Standards."].slice(-4));
      } else if (currentProg >= 100) {
        clearInterval(interval);
        setIsAuditing(false);
        setCurrentStepName("COGNITIVE STACK READY & SECURED");
        setSystemLogs(prev => [...prev, "[SUCCESS] DIAGNOSTIC COMPLETED: System fully synchronized and optimized!"].slice(-4));
      }
    }, 150);
  };

  // Generate 28 dummy days for contribution heatmap with advanced telemetry
  const heatmapCells = Array.from({ length: 28 }, (_, i) => {
    let count = 0;
    let accuracy = 0;
    let duration = 0;
    if (i % 7 === 0) { count = 5; accuracy = 78; duration = 15; }
    else if (i % 3 === 0) { count = 12; accuracy = 88; duration = 45; }
    else if (i % 5 === 0) { count = 8; accuracy = 82; duration = 30; }
    else if (i === 11 || i === 17 || i === 23) { count = 15; accuracy = 94; duration = 60; }
    else if (i % 2 === 0) { count = 2; accuracy = 70; duration = 8; }
    else { count = 0; accuracy = 0; duration = 0; }
    return { day: i + 1, count, accuracy, duration };
  });

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 text-slate-100 max-w-7xl mx-auto"
    >
      
      {/* 1. FUTURISTIC OPERATING SYSTEM HEADER WITH MOTION GRAPHICS */}
      <motion.header 
        variants={itemVariants}
        onMouseMove={handleMouseMoveHeader}
        onMouseEnter={() => setIsHoveringHeader(true)}
        onMouseLeave={() => setIsHoveringHeader(false)}
        className="relative rounded-3xl bg-slate-900/30 border border-slate-800/80 p-6 md:p-8 overflow-hidden backdrop-blur-xl group transition-all duration-500 hover:border-indigo-500/30"
      >
        {/* Spot cursor glow effect */}
        <div 
          className="absolute pointer-events-none transition-opacity duration-300 rounded-full blur-3xl"
          style={{
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(244,63,94,0.01) 70%, transparent 100%)",
            left: `${mousePosition.x - 175}px`,
            top: `${mousePosition.y - 175}px`,
            opacity: isHoveringHeader ? 1 : 0,
          }}
        />

        {/* Ambient constant glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-cyan-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-fuchsia-500/5 blur-3xl pointer-events-none" />
        
        {/* Dynamic Digital Grid Line System */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-50" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Welcome Text Section */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <motion.span 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                className="text-[10px] font-mono tracking-widest bg-gradient-to-r from-cyan-950 to-indigo-950 text-cyan-400 border border-cyan-500/20 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 uppercase font-black shadow-lg shadow-cyan-950/20"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                </span>
                {profile.archetype || "Analytical Strategist"}
              </motion.span>
              
              <motion.span 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                className="text-xs text-amber-400 font-mono flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-950/20 border border-amber-500/20 shadow-lg shadow-amber-950/20"
              >
                🔥 <StatCounter value={profile.streak} /> Days Active Streak
              </motion.span>

              {/* Dynamic live heartbeat indicator */}
              <span className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
                <Activity className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                Live Node Feed
              </span>
            </div>

            <div className="space-y-2">
              <motion.h1 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-none"
              >
                {greeting.bn}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 font-extrabold">{profile.name}</span>
              </motion.h1>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl font-sans">
                Targeting the <strong className="text-slate-200">{profile.targetYear} {profile.examType} Competitive Exam</strong>. You are currently positioned in the <strong className="text-cyan-400 font-mono">94th percentile</strong> among candidates in your division.
              </p>
            </div>
          </div>

          {/* Live Clock / OS System Panel */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            
            {/* Live Ticking Clock Display */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-center min-w-[190px] relative overflow-hidden shadow-2xl group"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-cyan-500 via-indigo-500 to-fuchsia-500" />
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-black">OPERATING SESSION</span>
              <span className="text-xl font-mono font-black tracking-tight text-white mt-1.5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                {timeStr || "00:00:00 AM"}
              </span>
              <span className="text-[10px] text-indigo-300 font-mono mt-1 font-semibold">{dateStr}</span>
            </motion.div>

            {/* Simulated Live System Metrics */}
            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 flex gap-5 min-w-[260px] shadow-2xl">
              <div className="flex-1 text-left space-y-1">
                <span className="text-[9px] text-slate-500 uppercase font-mono tracking-wider font-black">PREDICTED STANDING</span>
                <div className="text-2xl font-mono font-black text-rose-400">
                  #{profile.predictedRank ? profile.predictedRank.toLocaleString() : "342"}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-[9px] text-slate-400 block font-mono leading-none">out of {profile.totalStudents ? profile.totalStudents.toLocaleString() : "450k"}</span>
                </div>
              </div>
              <div className="w-[1px] h-12 bg-slate-800/60 self-center" />
              <div className="flex-1 text-left space-y-1">
                <span className="text-[9px] text-slate-500 uppercase font-mono tracking-wider font-black">PASS PROBABILITY</span>
                <div className="text-2xl font-mono font-black text-emerald-400">
                  <StatCounter value={profile.passingProbability || 82} suffix="%" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[9px] text-slate-400 block font-mono leading-none">Confidence Index</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.header>

      {/* 2. CORE SYSTEM ARCHITECTURE PIPELINE WITH HIGH FIDELITY DIAGRAMS */}
      <motion.section 
        variants={itemVariants}
        className="p-6 md:p-8 rounded-3xl bg-slate-900/30 border border-slate-800/80 relative overflow-hidden backdrop-blur-xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.03),transparent)] pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 bg-cyan-950/80 text-cyan-400 rounded border border-cyan-800/40">
                <Cpu className="w-3.5 h-3.5 animate-spin-slow text-cyan-400" />
              </span>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-black">SYSTEM TELEMETRY PIPELINE</span>
            </div>
            <h3 className="text-2xl font-black text-white font-display tracking-tight">Cognitive Processing Stack</h3>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={triggerAudit}
            disabled={isAuditing}
            className={`text-xs font-mono font-bold px-4 py-2.5 border rounded-xl flex items-center gap-2 transition-all select-none shadow-xl cursor-pointer ${
              isAuditing 
                ? "bg-indigo-950/50 border-indigo-500/40 text-indigo-300" 
                : "bg-slate-950 hover:bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
            }`}
          >
            <Sliders className={`w-3.5 h-3.5 ${isAuditing ? "animate-spin" : ""}`} />
            {isAuditing ? `Auditing (${auditProgress}%)` : "System Health Check"}
          </motion.button>
        </div>

        {/* Pipeline Map Overlay */}
        <div className="relative bg-slate-950/65 border border-slate-800/80 rounded-2xl p-6 overflow-hidden">
          
          {/* Scanning light band when auditing */}
          {isAuditing && (
            <motion.div 
              initial={{ left: "-100%" }}
              animate={{ left: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 w-1/3 h-full bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent pointer-events-none z-20"
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative z-10 items-stretch justify-between">
            
            {/* Node 1: Client Portal */}
            <motion.div 
              whileHover={{ y: -4, borderColor: "rgba(34,211,238,0.4)" }}
              className="flex flex-col items-center text-center space-y-4 p-5 bg-slate-900/50 border border-slate-800/80 rounded-2xl relative group transition-all duration-300 shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/5 group-hover:scale-105 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-cyan-500 uppercase tracking-widest font-black block">CLIENT INTERACTION</span>
                <h4 className="text-sm font-bold text-slate-100">User Interface Layer</h4>
                <p className="text-[10px] text-slate-500 font-mono">React 19 / Tailwind CSS v4</p>
              </div>
              
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-900/30 px-3 py-1 rounded-full font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE
              </div>
              
              {/* Connector line anchor */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-cyan-500/40" />
            </motion.div>

            {/* Node 2: Psychometrics (Validation Gate) */}
            <motion.div 
              whileHover={{ y: -4, borderColor: "rgba(245,158,11,0.4)" }}
              className="flex flex-col items-center text-center space-y-4 p-5 bg-slate-900/50 border border-slate-800/80 rounded-2xl relative group transition-all duration-300 shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-950/50 border border-amber-800/40 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/5 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest font-black block">VALIDATION MATRIX</span>
                <h4 className="text-sm font-bold text-slate-100">Psychometric Gate</h4>
                <p className="text-[10px] text-slate-500 font-mono">Cognitive Taxonomy Bounds</p>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400 bg-amber-950/30 border border-amber-900/30 px-3 py-1 rounded-full font-bold">
                <Sliders className="w-3 h-3 text-amber-400 animate-spin-slow" />
                ACTIVE ({pingMs}ms)
              </div>
              
              {/* Connector line anchor */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-amber-500/40" />
            </motion.div>

            {/* Node 3: AI Model Context Core */}
            <motion.div 
              whileHover={{ y: -4, borderColor: "rgba(99,102,241,0.4)" }}
              className="flex flex-col items-center text-center space-y-4 p-5 bg-slate-900/50 border border-slate-800/80 rounded-2xl relative group transition-all duration-300 shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/50 border border-indigo-800/40 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-500/5 group-hover:scale-105 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-indigo-500 uppercase tracking-widest font-black block">COGNITIVE COMPILER</span>
                <h4 className="text-sm font-bold text-slate-100">Gemini AI Model Core</h4>
                <p className="text-[10px] text-slate-500 font-mono">Contextual Pipeline Embeddings</p>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-mono text-indigo-400 bg-indigo-950/30 border border-indigo-900/30 px-3 py-1 rounded-full font-bold">
                <RefreshCw className="w-3 h-3 text-indigo-400 animate-spin" />
                STABLE
              </div>
              
              {/* Connector line anchor */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-indigo-500/40" />
            </motion.div>

          </div>

          {/* SVG Animated Connection Overlays */}
          <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="pathGrad-1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="pathGrad-2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              <path
                d="M 230 100 L 390 100"
                fill="none"
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth="2"
              />
              <motion.path
                d="M 230 100 L 390 100"
                fill="none"
                stroke="url(#pathGrad-1)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              <path
                d="M 490 100 L 650 100"
                fill="none"
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth="2"
              />
              <motion.path
                d="M 490 100 L 650 100"
                fill="none"
                stroke="url(#pathGrad-2)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }}
              />

              {/* Pulsing floating signals */}
              <motion.circle r="3" fill="#22d3ee" cx="230" animate={{ cx: [230, 390] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} cy="100" />
              <motion.circle r="3" fill="#f59e0b" cx="490" animate={{ cx: [490, 650] }} transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }} cy="100" />
            </svg>
          </div>
        </div>

        {/* Dynamic Running Command Terminal logs */}
        <div className="mt-5 bg-slate-950/85 rounded-2xl border border-slate-850 p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              Live Diagnostic Stream Console
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono text-emerald-400 font-black uppercase tracking-wider">Secured</span>
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-[10px] md:text-xs">
            <AnimatePresence mode="popLayout">
              {systemLogs.map((log, index) => {
                const isSuccess = log.includes("[SUCCESS]") || log.includes("OPTIMIZED") || log.includes("STABLE");
                const isScan = log.includes("[SCAN]") || log.includes("INITIALIZING") || log.includes("Mapping") || log.includes("Analyzing");
                const isErr = log.includes("[ERR]") || log.includes("decay");
                
                let textColor = "text-slate-400";
                if (isSuccess) textColor = "text-emerald-400 font-bold";
                else if (isScan) textColor = "text-cyan-400 font-medium";
                else if (isErr) textColor = "text-yellow-400";

                return (
                  <motion.div 
                    key={log + index}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.2 }}
                    className={`${textColor} flex items-start gap-1.5`}
                  >
                    <span className="text-indigo-500/60 flex-shrink-0 font-bold">&gt;</span>
                    <span className="break-all">{log}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          
          {isAuditing && (
            <div className="mt-3 pt-3 border-t border-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-cyan-400 font-bold flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                {currentStepName}
              </span>
              <div className="flex items-center gap-2 w-full sm:w-48">
                <div className="h-1.5 bg-slate-900 rounded-full w-full overflow-hidden border border-slate-800">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500" 
                    animate={{ width: `${auditProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-300 w-8 text-right">{auditProgress}%</span>
              </div>
            </div>
          )}
        </div>
      </motion.section>

      {/* 3. BENTO GRID OF CORE SYSTEMS WITH PREMIUM TRANSITIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* BENTO CARD 1: SYLLABUS READINESS RADIAL HUB (Left - Span 4) */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, borderColor: "rgba(99,102,241,0.2)" }}
          className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/30 border border-slate-800/80 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/5"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Syllabus Mastery</h3>
              <p className="text-lg font-black text-white font-display">AI Readiness Level</p>
            </div>
            <span className="p-2.5 bg-cyan-950/40 rounded-xl border border-cyan-850 text-cyan-400">
              <Brain className="w-4 h-4" />
            </span>
          </div>

          <div className="flex flex-col items-center justify-center py-6 space-y-5">
            
            {/* Elegant Circular dial with hover overlays */}
            <div className="relative w-44 h-44 flex items-center justify-center group cursor-pointer">
              {/* Dynamic glowing secondary background ring */}
              <div className="absolute inset-2 rounded-full border border-indigo-500/10 bg-slate-950/50 group-hover:scale-105 transition-transform duration-300" />
              
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="88" cy="88" r="74" stroke="#090d16" strokeWidth="8" fill="transparent" />
                <motion.circle 
                  cx="88" 
                  cy="88" 
                  r="74" 
                  stroke="url(#cyanBlueGlow)" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 74}
                  initial={{ strokeDashoffset: 2 * Math.PI * 74 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 74 * (1 - (profile.readinessScore || 78) / 100) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round" 
                />
                <defs>
                  <linearGradient id="cyanBlueGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#d946ef" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute flex flex-col items-center justify-center text-center">
                <motion.span 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-mono font-black tracking-tighter text-white"
                >
                  {profile.readinessScore || 78}<span className="text-lg text-indigo-400 font-semibold">%</span>
                </motion.span>
                <span className="text-[8px] uppercase tracking-widest text-cyan-400 font-mono font-black mt-1">
                  CADRE ALIGNED
                </span>
              </div>
            </div>

            {/* List of sub-skill category tags */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              {[
                { name: "Math", readiness: "88%", color: "border-emerald-500/20 text-emerald-400" },
                { name: "Bangla", readiness: "82%", color: "border-cyan-500/20 text-cyan-400" },
                { name: "English", readiness: "74%", color: "border-indigo-500/20 text-indigo-400" },
                { name: "GK", readiness: "62%", color: "border-amber-500/20 text-amber-400" }
              ].map((skill) => (
                <div 
                  key={skill.name}
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  className={`text-[9px] font-mono px-2 py-1 rounded border ${skill.color} cursor-help transition-all ${
                    hoveredSkill === skill.name ? "scale-105 bg-slate-900" : ""
                  }`}
                >
                  {skill.name}: {skill.readiness}
                </div>
              ))}
            </div>

            <div className="text-center space-y-1">
              <p className="text-xs text-slate-400 px-4 leading-relaxed font-sans min-h-[40px]">
                {hoveredSkill === "Math" && "Math: High analytical speed. Predicted score 46/50."}
                {hoveredSkill === "Bangla" && "Bangla: Steady. Sandhi Bicched accuracy needs restoration."}
                {hoveredSkill === "English" && "English: Moderate retention. Target literature cards."}
                {hoveredSkill === "GK" && "GK: Memory curve is decaying rapidly. Restudy now."}
                {!hoveredSkill && <>Your performance peaks in <strong className="text-cyan-400">Math & Bengali</strong>. Practice <strong className="text-amber-400">GK</strong> today to lift aggregate percentile.</>}
              </p>
            </div>

          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onQuickPractice}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 text-slate-950 font-black rounded-2xl text-xs uppercase hover:opacity-95 transition-all flex items-center justify-center gap-1.5 shadow-xl shadow-indigo-500/10 cursor-pointer active:scale-98 select-none"
          >
            Launch Smart Diagnostic MCQ <ArrowRight className="w-4 h-4 text-slate-950" />
          </motion.button>
        </motion.div>

        {/* BENTO CARD 2: REVISION PRIORITY BACKLOG (Center - Span 5) */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, borderColor: "rgba(99,102,241,0.2)" }}
          className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/30 border border-slate-800/80 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/5"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-start mb-5">
            <div className="space-y-0.5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Priority Objectives</h3>
              <p className="text-lg font-black text-white font-display">Cognitive Remediation Gaps</p>
            </div>
            <span className="p-2.5 bg-indigo-950/40 rounded-xl border border-indigo-850 text-indigo-400">
              <Zap className="w-4 h-4" />
            </span>
          </div>

          {/* List of custom dynamic objective tickets with stagger entry */}
          <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
            
            {/* Priority Item 1: International affairs */}
            <motion.div 
              whileHover={{ x: 4, borderColor: "rgba(244,63,94,0.3)" }}
              className="p-3.5 bg-slate-950/60 border border-slate-850 rounded-2xl flex items-center justify-between gap-3 group/item transition-all duration-300 hover:bg-slate-950/90"
            >
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0 animate-pulse shadow-lg shadow-rose-500/50" />
                <div className="text-xs space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-200">International: Org Structures</span>
                    <span className="text-[8px] bg-rose-950/40 text-rose-400 border border-rose-900/40 px-2 py-0.5 rounded uppercase font-mono font-bold">CRITICAL</span>
                  </div>
                  <p className="text-slate-500 text-[10px] leading-tight">High density syllabus area. 4 core board questions expected.</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onQuickPractice}
                className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 font-bold uppercase py-1.5 px-3 rounded-xl border border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 flex-shrink-0 cursor-pointer"
              >
                SOLVE
              </motion.button>
            </motion.div>

            {/* Priority Item 2: Bangla Grammar */}
            <motion.div 
              whileHover={{ x: 4, borderColor: "rgba(245,158,11,0.3)" }}
              className="p-3.5 bg-slate-950/60 border border-slate-850 rounded-2xl flex items-center justify-between gap-3 group/item transition-all duration-300 hover:bg-slate-950/90"
            >
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0 shadow-lg shadow-amber-500/50" />
                <div className="text-xs space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-200">Bangla Grammar: সন্ধি বিচ্ছেদ</span>
                    <span className="text-[8px] bg-amber-950/40 text-amber-400 border border-amber-900/40 px-2 py-0.5 rounded uppercase font-mono font-bold">RESTORATION DUE</span>
                  </div>
                  <p className="text-slate-500 text-[10px] leading-tight">Current correctness accuracy: 48% (Below regional median).</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('tutor')}
                className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 font-bold uppercase py-1.5 px-3 rounded-xl border border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 flex-shrink-0 cursor-pointer"
              >
                TUTOR
              </motion.button>
            </motion.div>

            {/* Priority Item 3: English Lit */}
            <motion.div 
              whileHover={{ x: 4, borderColor: "rgba(99,102,241,0.3)" }}
              className="p-3.5 bg-slate-950/60 border border-slate-850 rounded-2xl flex items-center justify-between gap-3 group/item transition-all duration-300 hover:bg-slate-950/90"
            >
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0 shadow-lg shadow-indigo-500/50" />
                <div className="text-xs space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-200">English: Modernist Writers</span>
                    <span className="text-[8px] bg-indigo-950/40 text-indigo-400 border border-indigo-900/40 px-2 py-0.5 rounded uppercase font-mono font-bold">MEMORY DECAY</span>
                  </div>
                  <p className="text-slate-500 text-[10px] leading-tight">Forgetting index triggered. Retention decay predicted in 14 hours.</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('revision')}
                className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 font-bold uppercase py-1.5 px-3 rounded-xl border border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 flex-shrink-0 cursor-pointer"
              >
                REVIEW
              </motion.button>
            </motion.div>

          </div>

          <div className="mt-4 p-4 bg-indigo-950/20 border border-indigo-500/15 rounded-2xl flex items-center gap-3 text-indigo-300 text-xs">
            <Award className="w-5 h-5 text-indigo-400 flex-shrink-0 animate-bounce" />
            <span className="leading-normal">
              Resolving these 3 priorities lifts aggregate predicted rank by <strong className="text-white">+142 spots</strong> based on simulation models.
            </span>
          </div>
        </motion.div>

        {/* BENTO CARD 3: REVISION HEATMAP MATRIX (Right - Span 3) */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, borderColor: "rgba(99,102,241,0.2)" }}
          className="lg:col-span-3 p-6 rounded-3xl bg-slate-900/30 border border-slate-800/80 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/5"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 blur-2xl pointer-events-none" />
          
          <div className="space-y-1 mb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Activity Streak</h3>
              <span className="text-[8px] font-mono bg-fuchsia-950/40 text-fuchsia-400 border border-fuchsia-900/40 px-2 py-0.5 rounded uppercase font-bold">
                MOCK HISTOGRAM
              </span>
            </div>
            <p className="text-lg font-black text-white font-display">Daily Diagnostics</p>
          </div>

          {/* Interactive heat-grid map */}
          <div className="py-2">
            <div className="grid grid-cols-7 gap-2">
              {heatmapCells.map((cell) => {
                let colorClass = "bg-slate-950 border-slate-900";
                if (cell.count > 0 && cell.count <= 3) colorClass = "bg-cyan-950/80 border-cyan-800/40 text-cyan-400";
                else if (cell.count > 3 && cell.count <= 6) colorClass = "bg-indigo-950/80 border-indigo-850 text-indigo-400";
                else if (cell.count > 6 && cell.count <= 11) colorClass = "bg-indigo-600/25 border-indigo-500/40 text-indigo-200";
                else if (cell.count > 11) colorClass = "bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-300";

                const isSelected = selectedHeatmapCell?.day === cell.day;

                return (
                  <motion.button
                    key={cell.day}
                    whileHover={{ scale: 1.15, zIndex: 10 }}
                    onClick={() => setSelectedHeatmapCell(cell)}
                    className={`w-full aspect-square rounded-lg border flex items-center justify-center text-[8px] font-mono font-bold transition-all cursor-pointer ${colorClass} ${
                      isSelected ? "ring-2 ring-indigo-400 scale-110 shadow-lg shadow-indigo-500/20" : ""
                    }`}
                    title={`Day ${cell.day}: ${cell.count} questions`}
                  />
                );
              })}
            </div>

            {/* Micro details panel for active selected heatmap node with transition */}
            <div className="mt-4 p-3 bg-slate-950/80 rounded-2xl border border-slate-850 flex items-center justify-between text-xs min-h-[58px]">
              <AnimatePresence mode="wait">
                {selectedHeatmapCell && (
                  <motion.div 
                    key={selectedHeatmapCell.day}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="space-y-0.5 text-left">
                      <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">Day {selectedHeatmapCell.day} Diagnostic</span>
                      <span className="font-bold text-slate-200">{selectedHeatmapCell.count} questions solved</span>
                    </div>
                    {selectedHeatmapCell.count > 0 && (
                      <div className="text-right">
                        <span className="text-cyan-400 font-mono font-black block">{selectedHeatmapCell.accuracy}% Acc</span>
                        <span className="text-[9px] text-slate-500 block font-mono">{selectedHeatmapCell.duration} mins</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('analytics')}
            className="w-full mt-4 py-3 rounded-2xl border border-slate-800 bg-slate-950 hover:bg-slate-900 text-xs font-semibold hover:text-white text-slate-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Explore Performance Analytics <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </motion.div>

      </div>

      {/* 4. RECENT EXAM REGISTRY & TRACKER TIMELINES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Memory Curve Curve alert triggers */}
        <motion.div 
          variants={itemVariants}
          className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/20 via-slate-900/40 to-indigo-950/20 border border-cyan-500/10 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group shadow-xl"
        >
          <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 rounded-2xl relative">
              <span className="absolute inset-0 rounded-2xl bg-cyan-400/10 animate-ping duration-3000" />
              <RefreshCw className="w-6 h-6 animate-spin-slow text-cyan-400" />
            </div>
            <div className="space-y-1 text-left">
              <span className="text-[9px] font-mono text-cyan-400 tracking-wider font-bold uppercase block">ACTIVE RETENTION ALIGNMENT</span>
              <h4 className="text-base font-bold text-white">Active Recall Gaps Detected</h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                There are <strong className="text-slate-200">{urgentRevisions.length || "3"} syllabus chapters</strong> currently due for forgetting cycle restoration today. Secure your learning curve!
              </p>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('revision')}
            className="w-full sm:w-auto px-5.5 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black rounded-2xl text-xs uppercase flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/10 cursor-pointer active:scale-98 select-none flex-shrink-0"
          >
            Open Memory Rails <ArrowRight className="w-4 h-4 text-slate-950" />
          </motion.button>
        </motion.div>

        {/* Circular tracker */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="p-6 rounded-3xl bg-slate-900/30 border border-slate-800/80 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/5"
        >
          <div className="flex justify-between items-center mb-5">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono text-indigo-400 uppercase font-black block tracking-wider">EXAM TIMELINE TRACKER</span>
              <h4 className="text-sm font-bold text-white">Registry Countdown Timelines</h4>
            </div>
            <span className="text-[9px] bg-slate-950 text-slate-400 border border-slate-800 px-2.5 py-1 rounded-full font-mono font-bold">
              CALENDAR
            </span>
          </div>

          <div className="space-y-3.5 flex-1">
            {upcomingCirculars.slice(0, 2).map((job) => {
              const maxRange = 90;
              const remainingPercent = Math.min(Math.max((job.countdownDays / maxRange) * 100, 0), 100);

              return (
                <div key={job.id} className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-850 space-y-2.5 text-xs hover:border-slate-800 transition-all duration-300">
                  <div className="flex justify-between items-start font-medium text-slate-200">
                    <div className="truncate pr-1.5 text-left">
                      <span className="block font-bold text-slate-200 truncate">{job.title}</span>
                      <span className="text-[10px] text-slate-500">{job.organization}</span>
                    </div>
                    <span className="text-[9px] text-rose-400 font-mono font-black flex-shrink-0 bg-rose-950/30 border border-rose-900/30 px-2 py-1 rounded-xl">
                      {job.countdownDays} Days Left
                    </span>
                  </div>
                  
                  {/* Styled Countdown Progress Line */}
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-850">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${100 - remainingPercent}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-rose-500 to-indigo-500 rounded-full" 
                      />
                    </div>
                    <div className="flex justify-between text-[8px] font-mono text-slate-500">
                      <span>Timeline Registry Open</span>
                      <span className="font-bold">{job.vacancyCount.toLocaleString()} Live Vacancies</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            onClick={() => onNavigate('career')}
            className="w-full mt-4 py-3 rounded-2xl border border-slate-800 bg-slate-950 hover:bg-slate-900 text-xs font-semibold hover:text-white text-slate-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Manage Career Timeline Calendar <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </motion.div>

      </div>

    </motion.div>
  );
}
