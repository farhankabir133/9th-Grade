import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Target, Compass, Eye, Shield, Users, ArrowLeft, ArrowRight,
  TrendingUp, Award, Cpu, Globe, Terminal, Calendar, Bookmark, Flame, Zap
} from 'lucide-react';

interface VisionDetailsProps {
  onBackToLanding?: () => void;
  onEnterApp?: () => void;
  isNestedInApp?: boolean;
}

export default function VisionDetails({ onBackToLanding, onEnterApp, isNestedInApp = false }: VisionDetailsProps) {
  const [activeTab, setActiveTab] = useState<'mission' | 'goals' | 'roadmap'>('mission');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Visionary values/principles
  const principles = [
    {
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      title: "Cognitive Augmentation",
      description: "Moving beyond passive informational apps to active learning machines that match the brain's retrieval and synthesis rates."
    },
    {
      icon: <Users className="w-5 h-5 text-indigo-400" />,
      title: "Democratized Intelligence",
      description: "Equipping every ambitious candidate, regardless of geographic or financial barriers, with the absolute elite training level."
    },
    {
      icon: <Globe className="w-5 h-5 text-emerald-400" />,
      title: "Sovereign Infrastructure",
      description: "Building custom, hyper-optimized models trained with local nuances, curriculum syllabus structures, and bilingual requirements."
    },
    {
      icon: <Flame className="w-5 h-5 text-rose-400" />,
      title: "Absolute Technical Rigor",
      description: "Employing agentic AI pipelines, spaced repetition logic, and robust evaluators to transform learning benchmarks forever."
    }
  ];

  // Specific high-level goals
  const goals = [
    {
      id: 1,
      tag: "IMMEDIATE TARGET",
      title: "BCS & Bank AD Cognitive Superiority",
      metric: "10x Faster Review cycles",
      description: "To completely overhaul Bangladesh's competitive exam ecosystem. By integrating real-time error analysis, sub-second topic indexing, and personalized learning trajectories, 9Th Grade AI aims to reduce candidate review fatigue by 75% while boosting cognitive retention.",
      actions: ["Bilingual Semantic Search", "Real-Time Spaced Repetition", "Generative Written Scripts Evaluator"]
    },
    {
      id: 2,
      tag: "MID-TERM FRONTIER",
      title: "Agentic Knowledge Compilation Systems",
      metric: "98% Accuracy in Feedback",
      description: "Developing custom agents that read complex policy books, constitutional amendments, and historical archives, rendering them into interactive exam simulation environments. Bridging scientific literature and practical test frameworks.",
      actions: ["Automatic Distractor Synthesis", "Contextual Prompt Grounding", "Cross-Subject Vector Mapping"]
    },
    {
      id: 3,
      tag: "LONG-TERM MANDATE",
      title: "Global Educational Operating System",
      metric: "1M+ Lifelong Learners",
      description: "Pioneering the Personal Operating System paradigm globally. Building software that respects human attention, gamifies real intellectual challenges, and enables everyone to map, analyze, and expand their cognitive boundaries.",
      actions: ["Decentralized Learner Credentials", "Peer-to-Peer Collaborative Canvases", "Adaptive Neural Core Engines"]
    }
  ];

  // Roadmap details
  const roadmapSteps = [
    {
      period: "Q3 - Q4 2026",
      title: "9Th Grade AI Foundation & Agent Deployment",
      status: "ACTIVE DEVELOPMENT",
      color: "border-cyan-500/30 text-cyan-400 bg-cyan-950/10",
      bullets: [
        "Rollout full bilingual generative tutor with context memory",
        "Introduce the Spaced Memory revision deck algorithm (SuperMemo-derived)",
        "Optimize mobile application viewport parameters to ensure flawless native navigation"
      ]
    },
    {
      period: "Q1 - Q2 2027",
      title: "Sovereign Fine-Tuning & Multi-Modal Evaluation",
      status: "RESEARCH PHASE",
      color: "border-indigo-500/30 text-indigo-400 bg-indigo-950/10",
      bullets: [
        "Train fine-tuned models on specific national curriculum textbooks and legal gazettes",
        "Enable voice-to-text live speech evaluation for competitive viva preparation",
        "Integrate collaborative real-time study rooms with smart synchronized scoreboards"
      ]
    },
    {
      period: "2028 - 2030",
      title: "The Universal Cognitive Coprocessor",
      status: "FUTURE HORIZON",
      color: "border-emerald-500/30 text-emerald-400 bg-emerald-950/10",
      bullets: [
        "Expand 9Th Grade AI into a multi-discipline OS used in university and professional fields globally",
        "Build deep analytics profiles tracking lifelong intellectual progress safely",
        "Integrate non-invasive, high-focus productivity frameworks natively within the browser"
      ]
    }
  ];

  return (
    <div className={isNestedInApp ? "w-full text-neutral-100 font-sans pb-12 relative" : "min-h-screen bg-[#030303] text-neutral-100 font-sans pb-24 overflow-x-hidden relative"}>
      
      {/* Dynamic Ambient Background Glows */}
      {!isNestedInApp && (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />
          <div className="absolute bottom-20 right-10 w-[500px] h-[300px] bg-indigo-500/5 blur-[150px] pointer-events-none rounded-full" />
        </>
      )}

      {/* Sticky Premium Header */}
      {!isNestedInApp && (
        <header className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-xl">
                <Eye className="w-5 h-5 text-slate-950 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">Farhan Kabir's Vision</span>
                <h1 className="text-sm font-bold tracking-tight text-white uppercase font-mono">Cognitive Learning OS</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onBackToLanding}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
              </button>
              <button
                onClick={onEnterApp}
                className="flex items-center gap-2 px-4.5 py-2 bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 hover:opacity-90 font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer font-mono"
              >
                Launch App <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Container */}
      <main className={`${isNestedInApp ? "w-full" : "max-w-7xl mx-auto px-6"} pt-12 relative z-10`}>
        
        {/* Intro Typographic Display Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 text-[10px] font-mono uppercase tracking-widest"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" /> Shaping Future Human Cognition
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent font-sans"
          >
            The Personal Operating System for Ambitious Minds.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm md:text-base text-neutral-400 font-mono leading-relaxed max-w-2xl mx-auto"
          >
            9Th Grade AI is not merely an exam preparation portal. It is a live blueprint of how high-stakes academic preparation, engineering precision, and interactive AI research merge to empower the next generation of leadership.
          </motion.p>
        </div>

        {/* Tab Selection Navigation Bar */}
        <div className="flex justify-center mb-12">
          <div className="flex p-1 bg-[#090909] border border-white/5 rounded-2xl gap-1">
            {[
              { id: 'mission', label: '1. Core Mission', icon: Eye },
              { id: 'goals', label: '2. Strategic Goals', icon: Target },
              { id: 'roadmap', label: '3. Roadmap & Milestones', icon: Compass }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-tr from-cyan-950/40 to-indigo-950/40 border border-cyan-500/20 text-cyan-400 font-bold shadow-inner' 
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Render with Animated Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            
            {/* Core Mission Panel */}
            {activeTab === 'mission' && (
              <div className="space-y-12">
                
                {/* Manifesto Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#090909]/40 rounded-3xl border border-white/5 p-8 md:p-12">
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">MANIFOLD OF VALUES</span>
                    <h3 className="text-2xl font-bold tracking-tight text-white font-sans">
                      Our Philosophy: Amplifying Human Capacity Through Intelligent Software
                    </h3>
                    <p className="text-neutral-400 text-sm font-mono leading-relaxed">
                      We believe traditional education systems are fundamentally bottlenecked. Information is linear, feedback is delayed, and memory decay remains unmanaged. 
                    </p>
                    <p className="text-neutral-400 text-sm font-mono leading-relaxed">
                      9Th Grade AI operates on the fundamental pillar that <strong className="text-neutral-200">the human brain deserves high-fidelity inputs</strong>. By combining retrieval-augmented diagnostics, sub-second active recall prompts, and custom fine-tuned Large Language Models, we turn chaotic study schedules into structured neural feedback loops.
                    </p>
                    <div className="pt-4 border-t border-white/5 flex flex-wrap gap-4 text-[10px] font-mono text-indigo-300">
                      <span>✓ 100% AGENTIC EVALUATION</span>
                      <span>✓ ADAPTIVE REPETITION ENGINE</span>
                      <span>✓ BILINGUAL BANGLADESH CORE</span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 relative">
                    {/* Visual Art Card */}
                    <div className="aspect-video lg:aspect-square bg-gradient-to-tr from-indigo-950/20 to-cyan-950/20 rounded-2xl border border-white/10 p-6 flex flex-col justify-between overflow-hidden relative group">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000" />
                      
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded">COGNITION LEVEL</span>
                        <Zap className="w-5 h-5 text-yellow-400 animate-bounce" />
                      </div>

                      <div className="space-y-4 relative z-10">
                        <div className="font-mono text-xs text-neutral-400 space-y-1">
                          <p>&gt; sys_status: mapping_intelligence...</p>
                          <p>&gt; neural_density: 98.4% active</p>
                          <p>&gt; latency_average: 140ms</p>
                        </div>
                        <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 w-4/5 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Principles Grid */}
                <div className="space-y-6">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 text-left border-b border-white/5 pb-2">
                    Core Pillars of the Platform
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {principles.map((pr, idx) => (
                      <div
                        key={idx}
                        onMouseEnter={() => setHoveredCard(idx)}
                        onMouseLeave={() => setHoveredCard(null)}
                        className={`p-6 rounded-2xl bg-[#090909] border transition-all duration-300 text-left space-y-4 ${
                          hoveredCard === idx ? 'border-indigo-500/30 bg-[#0c0c0c] scale-[1.02]' : 'border-white/5'
                        }`}
                      >
                        <div className="p-2.5 bg-white/5 rounded-xl inline-block">
                          {pr.icon}
                        </div>
                        <h5 className="font-bold font-sans text-white text-sm uppercase tracking-wide">{pr.title}</h5>
                        <p className="text-neutral-400 font-mono text-xs leading-relaxed">{pr.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Strategic Goals Panel */}
            {activeTab === 'goals' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                {goals.map((goal) => (
                  <div 
                    key={goal.id} 
                    className="p-6 md:p-8 rounded-3xl bg-[#090909] border border-white/5 flex flex-col justify-between space-y-8 relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-300"
                  >
                    {/* Glowing Accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/10 to-transparent blur-xl" />

                    <div className="space-y-4">
                      <span className="text-[9px] font-mono text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        {goal.tag}
                      </span>
                      <h4 className="text-lg font-bold tracking-tight text-white font-sans">{goal.title}</h4>
                      <p className="text-xs text-neutral-400 font-mono leading-relaxed">{goal.description}</p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-neutral-500">PROJECTED METRIC</span>
                        <span className="text-xs font-mono font-bold text-cyan-400">{goal.metric}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono text-neutral-500 block uppercase">Key Deliverables</span>
                        <div className="flex flex-col gap-1.5">
                          {goal.actions.map((act, i) => (
                            <span key={i} className="text-[10px] font-mono text-neutral-300 flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-cyan-400" />
                              {act}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Roadmap & Timeline Panel */}
            {activeTab === 'roadmap' && (
              <div className="space-y-8 text-left max-w-4xl mx-auto">
                <div className="relative border-l border-white/5 pl-6 ml-4 space-y-12">
                  {roadmapSteps.map((step, idx) => (
                    <div key={idx} className="relative group">
                      
                      {/* Timeline Dot Indicator */}
                      <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#030303] border-2 border-indigo-500 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      </div>

                      <div className="p-6 md:p-8 rounded-2xl bg-[#090909] border border-white/5 space-y-4 hover:bg-[#0c0c0c] transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                          <div>
                            <span className="text-xs font-mono text-cyan-400 font-bold block">{step.period}</span>
                            <h4 className="text-md font-bold tracking-tight text-white font-sans mt-0.5">{step.title}</h4>
                          </div>
                          <div>
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${step.color} font-bold tracking-widest block uppercase text-center`}>
                              {step.status}
                            </span>
                          </div>
                        </div>

                        <ul className="space-y-2.5">
                          {step.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="text-xs font-mono text-neutral-400 leading-relaxed flex items-start gap-2.5">
                              <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Closing Platform Summary Vision Card */}
        <div className="mt-16 bg-[#090909]/40 border border-white/5 p-8 rounded-3xl max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-left relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <h4 className="text-lg font-bold text-white font-sans">Ready to upgrade your preparation standard?</h4>
            <p className="text-xs text-neutral-400 font-mono">Join thousands of students utilizing Farhan's custom rank estimation and memory loops.</p>
          </div>
          <button
            onClick={onEnterApp}
            className="flex-shrink-0 px-6 py-3 bg-white hover:bg-neutral-200 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer font-mono"
          >
            Get Started (পরীক্ষা শুরু করুন)
          </button>
        </div>

      </main>
    </div>
  );
}
