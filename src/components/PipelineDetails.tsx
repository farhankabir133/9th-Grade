import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Activity, Cpu, ArrowRight, ArrowLeft, RefreshCw, 
  CheckCircle2, Settings, ShieldAlert, Database, ChevronRight, 
  Layers, Zap, Play, Pause, HelpCircle
} from 'lucide-react';

interface PipelineDetailsProps {
  onBackToLanding?: () => void;
  onEnterApp?: () => void;
  isNestedInApp?: boolean;
}

export default function PipelineDetails({ onBackToLanding, onEnterApp, isNestedInApp = false }: PipelineDetailsProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  
  // Custom Demo Input
  const [rawText, setRawText] = useState<string>("চর্যাপদের প্রাচীনতম কবি কে? অপশন: লুইপা, ভুসুকুপা, সরহপা, কানহপা।");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Medium");
  const [selectedTopic, setSelectedTopic] = useState<string>("বাংলা সাহিত্য (প্রাচীন যুগ)");

  // Simulated live steps
  const steps = [
    {
      title: "১. Raw AI Extraction (আইডেন্টিফিকেশন)",
      desc: "বাংলা টেক্সট ও এমসিকিউ স্ট্রাকচারকে আইডেন্টিফাই করে পার্সিং ডেটায় রূপান্তর করা হয়।",
      icon: Database,
      badge: "STEP 01: EXTRACT",
      color: "border-cyan-500/30 text-cyan-400 bg-cyan-950/25"
    },
    {
      title: "২. Psychometric Index Weighting (কগনিটিভ ইনডেক্সিং)",
      desc: "প্রশ্নটির বৈষম্য সূচক (Discrimination Index) এবং বিসিএস ক্যাডারদের উত্তরের প্যাটার্ন মেপে ডিফিকাল্টি রিয়েল-টাইমে রিক্যালকুলেট করা হয়।",
      icon: Cpu,
      badge: "STEP 02: ANALYSIS",
      color: "border-indigo-500/30 text-indigo-400 bg-indigo-950/25"
    },
    {
      title: "৩. Spatial Knowledge Graph Positioning (স্পেশাল গ্রাফ পজিশনিং)",
      desc: "চর্যাপদের সাথে প্রাচীন যুগের অন্যান্য বিষয়াবলির (যেমন নাথ সাহিত্য, ডাক ও খনার বচন) পারস্পরিক দূরত্বের সম্পর্ক তৈরি করা হয়।",
      icon: Layers,
      badge: "STEP 03: POSITIONING",
      color: "border-emerald-500/30 text-emerald-400 bg-emerald-950/25"
    },
    {
      title: "৪. Personalized Adaptive Queueing (লুপ শিডিউলিং)",
      desc: "পরীক্ষার্থীর কগনিটিভ লেভেলের ওপর ভিত্তি করে স্পেসড রিভিশন শিডিউল তৈরি করে ড্যাশবোর্ডে পুশ করা হয়।",
      icon: RefreshCw,
      badge: "STEP 04: SCHEDULE",
      color: "border-rose-500/30 text-rose-400 bg-rose-950/25"
    }
  ];

  // Autoplay progression interval (4.5s transition rate)
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, steps.length]);

  return (
    <div className={isNestedInApp ? "w-full text-neutral-100 font-sans pb-12 relative" : "min-h-screen bg-[#030303] text-neutral-100 font-sans pb-24 overflow-x-hidden relative"}>
      
      {/* Background patterns */}
      {!isNestedInApp && (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0c_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0c_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
          <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-indigo-500/5 blur-[120px] pointer-events-none rounded-full" />
          <div className="absolute bottom-20 right-10 w-[500px] h-[300px] bg-cyan-500/5 blur-[150px] pointer-events-none rounded-full" />
        </>
      )}

      {/* Hero Header */}
      {!isNestedInApp && (
        <header className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-xl">
                <Activity className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <span className="text-sm font-bold tracking-tight font-mono text-neutral-100 flex items-center gap-2">
                  9TH GRADE <span className="text-[9px] bg-white/10 text-indigo-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest font-mono">PIPELINE CORE</span>
                </span>
                <p className="text-[10px] text-neutral-500 leading-none">AI Psychometric Workflow Engine</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {onBackToLanding && (
                <button 
                  onClick={onBackToLanding}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/5 hover:border-white/10 bg-neutral-950 text-neutral-400 hover:text-white text-xs font-mono transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Landing
                </button>
              )}
              {onEnterApp && (
                <button 
                  onClick={onEnterApp}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 hover:opacity-90 text-neutral-950 text-xs font-bold transition-all shadow-lg shadow-indigo-500/10 cursor-pointer"
                >
                  Launch Platform <Play className="w-3 h-3 fill-current" />
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`${isNestedInApp ? "w-full" : "max-w-7xl mx-auto px-6"} pt-12 space-y-12 relative z-10 text-left`}>
        
        {/* Intro Info */}
        <div className="space-y-4 max-w-3xl">
          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/30 px-3 py-1.5 rounded-full border border-indigo-900/40 uppercase tracking-widest">
            Behind The AI Logic
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white font-display tracking-tight leading-tight">
            How The Psychometric <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">Processing Pipeline Operates</span>
          </h1>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
            র্যাংকফ্লো-র লাইভ সিস্টেম কীভাবে প্রতিটি এমসিকিউ প্রশ্ন বিশ্লেষণ করে আপনার ড্যাশবোর্ডে মেমোরি রিভিশন নোড হিসেবে ক্রিয়েট করে, তা নিজে ইনপুট দিয়ে লাইভ ট্র্যাকিংয়ের মাধ্যমে দেখে নিন। 
          </p>
        </div>

        {/* Dynamic Sandbox Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Interactive Left Input Control Console */}
          <div className="lg:col-span-4 bg-[#090909] border border-white/5 rounded-3xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-5 text-left">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3 font-mono text-xs text-neutral-400">
                <Settings className="w-4 h-4 text-indigo-400" />
                <span>SANDBOX PARAMETERS</span>
              </div>

              {/* Topic Select */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-neutral-400 block uppercase">1. TARGET TOPIC (সিলেক্ট টপিক)</label>
                <select 
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full bg-black border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 font-sans focus:outline-none focus:border-indigo-500"
                >
                  <option value="বাংলা সাহিত্য (প্রাচীন যুগ)">বাংলা সাহিত্য (প্রাচীন যুগ)</option>
                  <option value="English Grammar (Modifier)">English Grammar (Modifier)</option>
                  <option value="Analytical Math (Speed & Distance)">Analytical Math (Speed & Distance)</option>
                  <option value="বাংলাদেশ বিষয়াবলি (সংবিধান)">বাংলাদেশ বিষয়াবলি (সংবিধান)</option>
                </select>
              </div>

              {/* Difficulty Factor */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-neutral-400 block uppercase">2. DIFFICULTY RATING</label>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                  {['Easy', 'Medium', 'Hard'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        selectedDifficulty === diff 
                          ? 'bg-indigo-950/20 border-indigo-500/40 text-indigo-300 font-bold' 
                          : 'bg-black border-white/5 text-neutral-500'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Raw MCQ Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-neutral-400 block uppercase">3. RAW QUESTIONS CORPUS</label>
                <textarea 
                  rows={4}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="w-full bg-black border border-white/5 rounded-xl p-3.5 text-xs text-neutral-300 font-sans focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                  placeholder="Paste question body..."
                />
              </div>
            </div>

            {/* Simulated Live Generation Status */}
            <div className="p-4 bg-neutral-950 rounded-2xl border border-white/5 text-left space-y-2">
              <div className="flex justify-between items-center text-[9px] font-mono text-neutral-500">
                <span>PIPELINE CAPACITY INDEX</span>
                <span className="text-emerald-400 font-bold">100% ONLINE</span>
              </div>
              <p className="text-[10px] text-neutral-400 leading-normal font-sans">
                Below, click through each step to trigger the visualizer pipeline processing sequence.
              </p>
            </div>
          </div>

          {/* Interactive Visualizer Pipeline Steps */}
          <div className="lg:col-span-8 bg-[#090909] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-8 flex flex-col justify-between">
            
            {/* Live Autoplay State Indicator Controller */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-black/60 p-3.5 rounded-2xl border border-white/5 gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  {isAutoPlaying && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isAutoPlaying ? 'bg-cyan-400' : 'bg-rose-500'}`}></span>
                </span>
                <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest leading-none">
                  {isAutoPlaying ? "AUTO LIVE STREAMING • ACTIVE (৪.৫ সেকেন্ড পরপর পরিবর্তন)" : "AUTO PLAY IS PAUSED (স্থির আছে)"}
                </span>
              </div>
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                  isAutoPlaying 
                    ? 'border-cyan-500/20 bg-cyan-950/20 text-cyan-400 hover:bg-cyan-950/30' 
                    : 'border-white/10 bg-neutral-900 text-neutral-300 hover:text-white'
                }`}
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="w-3 h-3" /> Pause Flow
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" /> Resume Auto Flow
                  </>
                )}
              </button>
            </div>

            {/* Steps Navigation Rail */}
            <div className="grid grid-cols-4 gap-2 border-b border-white/5 pb-4">
              {steps.map((s, idx) => {
                const IconComp = s.icon;
                const isActive = activeStep === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveStep(idx);
                      setIsAutoPlaying(false);
                    }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#111] border-white/10 text-white shadow-md' 
                        : 'bg-transparent border-transparent text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <IconComp className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-neutral-500'}`} />
                      <span className="text-[9px] font-mono font-bold hidden sm:inline uppercase">STEP 0{idx+1}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Step Core Visualization Box */}
            <div className="flex-1 py-4 text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Step Header */}
                  <div className="space-y-1.5">
                    <span className={`inline-block text-[9px] font-mono font-bold border rounded px-2.5 py-0.5 ${steps[activeStep].color}`}>
                      {steps[activeStep].badge}
                    </span>
                    <h3 className="text-lg font-bold text-neutral-100">{steps[activeStep].title}</h3>
                    <p className="text-xs text-neutral-400 font-sans leading-relaxed">{steps[activeStep].desc}</p>
                  </div>

                  {/* Active Simulator Board Visual */}
                  <div className="bg-black/50 border border-white/5 rounded-2xl p-5 relative overflow-hidden font-mono text-xs">
                    
                    {/* STEP 1: PARSING RESULTS */}
                    {activeStep === 0 && (
                      <div className="space-y-3.5">
                        <span className="text-[9px] text-neutral-500 uppercase tracking-widest block font-bold">SIMULATED PARSED DICTIONARY VALUE:</span>
                        <div className="p-3.5 bg-neutral-950 rounded-xl border border-white/5 space-y-2 text-[11px]">
                          <div><span className="text-cyan-400">"raw_input":</span> <span className="text-neutral-300">"{rawText}"</span></div>
                          <div><span className="text-cyan-400">"extracted_topic":</span> <span className="text-indigo-300">"{selectedTopic}"</span></div>
                          <div><span className="text-cyan-400">"suggested_difficulty":</span> <span className="text-amber-400">"{selectedDifficulty}"</span></div>
                          <div><span className="text-cyan-400">"hash":</span> <span className="text-neutral-500">"rf_node_ea928b_028"</span></div>
                        </div>
                        <p className="text-[10px] text-neutral-500 leading-normal font-sans">
                          ✓ BPSC Standard regex parser verified option tags structure without trailing punctuation errors.
                        </p>
                      </div>
                    )}

                    {/* STEP 2: PSYCHOMETRIC METRICS */}
                    {activeStep === 1 && (
                      <div className="space-y-4">
                        <span className="text-[9px] text-neutral-500 uppercase tracking-widest block font-bold">COGNITIVE COMPLEXITY GAIN COEFFICIENT:</span>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-neutral-950 rounded-xl border border-white/5 space-y-1">
                            <span className="text-[9px] text-neutral-500 uppercase">Discrimination index</span>
                            <div className="text-lg font-extrabold text-neutral-100">0.68</div>
                            <span className="text-[9px] text-emerald-400">⚡ Highly discriminating</span>
                          </div>
                          <div className="p-3 bg-neutral-950 rounded-xl border border-white/5 space-y-1">
                            <span className="text-[9px] text-neutral-500 uppercase">Estimated Error Rate</span>
                            <div className="text-lg font-extrabold text-neutral-100">
                              {selectedDifficulty === 'Hard' ? '68%' : selectedDifficulty === 'Medium' ? '42%' : '15%'}
                            </div>
                            <span className="text-[9px] text-neutral-500">Cohort threshold standard</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-neutral-500 leading-normal font-sans">
                          বিসিএস প্রিলিতে যারা ক্যাডার লিস্টে স্থান পায় এবং যারা অল্পের জন্য বাদ পড়ে, তাদের উত্তরের সূক্ষ্ম পার্থক্য বিশ্লেষণ করার সূচক গণনা করছে 9Th Grade AI.
                        </p>
                      </div>
                    )}

                    {/* STEP 3: SPATIAL KNOWLEDGE GRAPH */}
                    {activeStep === 2 && (
                      <div className="space-y-4">
                        <span className="text-[9px] text-neutral-500 uppercase tracking-widest block font-bold">DYNAMIC NODE SPATIAL COORDINATES:</span>
                        
                        {/* Fake Node Cluster Graph rendering */}
                        <div className="h-28 bg-[#050505] rounded-xl border border-white/5 relative flex items-center justify-center">
                          <div className="absolute w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                          <div className="absolute w-2 h-2 bg-indigo-500 rounded-full" />
                          
                          {/* Connected satellite nodes */}
                          <div className="absolute top-6 left-12 p-1.5 bg-neutral-900 border border-white/5 text-[9px] rounded text-neutral-400">
                            {selectedTopic} (Current Node)
                          </div>
                          <div className="absolute bottom-6 right-16 p-1 bg-neutral-900 border border-white/5 text-[8px] rounded text-neutral-500">
                            নাথ সাহিত্য (Weight: 0.74)
                          </div>
                          <div className="absolute top-10 right-1/4 p-1 bg-neutral-900 border border-white/5 text-[8px] rounded text-neutral-500">
                            ডিমেনশন ক্লাস্টার (Weight: 0.62)
                          </div>

                          <div className="absolute inset-0 border border-dashed border-white/5 rounded-xl pointer-events-none" />
                        </div>

                        <p className="text-[10px] text-neutral-500 leading-normal font-sans">
                          সরাসরি মুখস্থ না করিয়ে সংশ্লিষ্ট অন্যান্য সাব-টপিকগুলোর সাথে মেমোরি ইন্টারকনেকশন ম্যাপ ক্যালকুলেট করে।
                        </p>
                      </div>
                    )}

                    {/* STEP 4: RETENTION QUEUE */}
                    {activeStep === 3 && (
                      <div className="space-y-3">
                        <span className="text-[9px] text-neutral-500 uppercase tracking-widest block font-bold">NEXT REVISION INTERVAL SCHEDULED:</span>
                        <div className="p-3 bg-neutral-950 rounded-xl border border-white/5 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-rose-400 uppercase font-bold block">🚨 INITIAL SPACING TIMEOUT:</span>
                            <span className="text-[11px] text-neutral-300 font-sans">Next active diagnostic review in 48 hours</span>
                          </div>
                          <div className="p-2 bg-rose-950/20 border border-rose-900/30 rounded-lg">
                            <RefreshCw className="w-4 h-4 text-rose-400 animate-spin" />
                          </div>
                        </div>
                        <p className="text-[10px] text-neutral-500 leading-normal font-sans">
                          এই টপিকে আপনার পারফরম্যান্স অনুযায়ী ড্যাশবোর্ডে স্পেসড রিভিশন মডিউলে এটি অটোমেটিক জমা হয়ে গেছে।
                        </p>
                      </div>
                    )}

                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Step triggers buttons */}
            <div className="flex justify-between items-center border-t border-white/5 pt-4">
              <button
                disabled={activeStep === 0}
                onClick={() => {
                  setActiveStep(prev => prev - 1);
                  setIsAutoPlaying(false);
                }}
                className="px-4 py-2 text-xs font-mono font-bold text-neutral-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                ← PREVIOUS STEP
              </button>
              
              {activeStep < 3 ? (
                <button
                  onClick={() => {
                    setActiveStep(prev => prev + 1);
                    setIsAutoPlaying(false);
                  }}
                  className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-lg shadow-indigo-600/15"
                >
                  NEXT PIPELINE STAGE <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                onEnterApp && (
                  <button
                    onClick={onEnterApp}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-neutral-950 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-lg shadow-emerald-500/10"
                  >
                    READY • ENTER APP <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                  </button>
                )
              )}
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
