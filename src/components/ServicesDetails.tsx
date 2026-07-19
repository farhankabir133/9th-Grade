import React, { useState, useEffect } from 'react';
import { 
  motion, AnimatePresence 
} from 'motion/react';
import { 
  Brain, Clock, Zap, Target, BookOpen, MessageSquare, 
  BarChart, RefreshCw, Calendar, Sparkles, CheckCircle2, 
  XCircle, ChevronRight, HelpCircle, AlertCircle, ShieldAlert, 
  ChevronDown, BookMarked, Activity, ArrowRight, CornerDownRight, 
  Flame, Award, Search, Compass, Info, FileText, Send, UserCheck, Play, ArrowLeft
} from 'lucide-react';

interface ServicesDetailsProps {
  onBackToLanding?: () => void;
  onEnterApp?: () => void;
  isNestedInApp?: boolean;
}

export default function ServicesDetails({ onBackToLanding, onEnterApp, isNestedInApp = false }: ServicesDetailsProps) {
  const [activeServiceTab, setActiveServiceTab] = useState<string>('quiz_cockpit');
  
  // -- Simulator States --
  
  // 1. Quiz Cockpit States
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(null);
  const [quizTimer, setQuizTimer] = useState<number>(0);
  const [quizPaceStatus, setQuizPaceStatus] = useState<string>('⚡ OPTIMAL');
  const [cockpitMode, setCockpitMode] = useState<'BCS' | 'BANK_AD'>('BCS');
  
  const simQuestion = {
    BCS: {
      text: "সংবিধানের কোন অনুচ্ছেদ অনুযায়ী বাংলাদেশ সরকারি কর্ম কমিশন (BPSC) গঠিত হয়?",
      options: [
        "অনুচ্ছেদ ১৩৫ (Article 135)",
        "অনুচ্ছেদ ১৩৭ (Article 137)",
        "অনুচ্ছেদ ১৪১ (Article 141)",
        "অনুচ্ছেদ ১৪২ (Article 142)"
      ],
      correctIndex: 1,
      explanation: "সংবিধানের ১৩৭ অনুচ্ছেদ অনুযায়ী বাংলাদেশ সরকারি কর্ম কমিশন গঠিত হয়। ১৩৫ অনুচ্ছেদে রয়েছে অসামরিক সরকারি কর্মচারীদের বরখাস্তকরণ এবং ১৪১ অনুচ্ছেদে রয়েছে জরুরি অবস্থা ঘোষণা সংক্রান্ত বিধান।"
    },
    BANK_AD: {
      text: "A trader sells a watch for Tk 1200 gaining 20% on the cost price. What is his cost price in Taka?",
      options: [
        "Tk 900",
        "Tk 1000",
        "Tk 1050",
        "Tk 1100"
      ],
      correctIndex: 1,
      explanation: "Let cost price be CP. Sells for Tk 1200 with 20% gain. 1.20 * CP = 1200 => CP = 1200 / 1.2 = 1000. Shortcut: Gain of 20% means 6/5 of cost price is Tk 1200. Thus, 1 unit is Tk 200, and 5 units is Tk 1000."
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!quizAnswered) {
      interval = setInterval(() => {
        setQuizTimer((prev) => {
          const next = prev + 1;
          if (cockpitMode === 'BANK_AD') {
            if (next > 45) setQuizPaceStatus('⚠️ DELAYED');
            else if (next > 20) setQuizPaceStatus('⏱️ AVERAGE');
            else setQuizPaceStatus('⚡ OPTIMAL');
          } else {
            if (next > 60) setQuizPaceStatus('⚠️ DELAYED');
            else if (next > 30) setQuizPaceStatus('⏱️ AVERAGE');
            else setQuizPaceStatus('⚡ OPTIMAL');
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizAnswered, cockpitMode]);

  const handleQuizAnswer = (idx: number) => {
    if (quizAnswered) return;
    setSelectedQuizIndex(idx);
    setQuizAnswered(true);
  };

  const resetQuizSim = () => {
    setQuizAnswered(false);
    setSelectedQuizIndex(null);
    setQuizTimer(0);
    setQuizPaceStatus('⚡ OPTIMAL');
  };

  // 2. Mistake Ledger States
  const [activeMistakeId, setActiveMistakeId] = useState<string>('m1');
  const [ledgerQuestions, setLedgerQuestions] = useState([
    {
      id: 'm1',
      topic: 'বাংলা সাহিত্য (চর্যাপদ)',
      question: "চর্যাপদের তিব্বতী অনুবাদ কে আবিষ্কার করেন?",
      options: ["হরপ্রসাদ শাস্ত্রী", "প্রবোধচন্দ্র বাগচী", "সুনীতিকুমার চট্টোপাধ্যায়", "মুহম্মদ শহীদুল্লাহ"],
      wrongAnswer: "হরপ্রসাদ শাস্ত্রী",
      correctAnswer: "প্রবোধচন্দ্র বাগচী",
      relevance: "BCS Prelim (বাংলা ভাষা ও সাহিত্য)",
      reason: "কনফিউশন উইথ হরপ্রসাদ শাস্ত্রী (যিনি মূল পুথি নেপাল থেকে আবিষ্কার করেছিলেন, কিন্তু তিব্বতী অনুবাদ আবিষ্কর্তা ড. প্রবোধচন্দ্র বাগচী)।",
      decongested: false
    },
    {
      id: 'm2',
      topic: 'Quantitative (Work & Time)',
      question: "A can do a work in 15 days and B in 20 days. Working together, in how many days can they complete it?",
      options: ["8 days", "8.5 days", "60/7 days", "10 days"],
      wrongAnswer: "8.5 days",
      correctAnswer: "60/7 days",
      relevance: "Bank AD / IBA Math Standards",
      reason: "গড় হিসাব করার ভুল। ১ দিনের কাজ যোগ করে উল্টাতে হবে: 1/15 + 1/20 = 7/60, সো কাজ শেষ হবে 60/7 দিনে।",
      decongested: false
    }
  ]);

  const handleDecongest = (id: string) => {
    setLedgerQuestions(prev => prev.map(q => q.id === id ? { ...q, decongested: true } : q));
  };

  // 3. Spaced Repetition States
  const [decayDays, setDecayDays] = useState<number>(1);
  const [simulatedRetention, setSimulatedRetention] = useState<number>(100);

  useEffect(() => {
    // Standard forgetting curve simulation: R = e^(-t/S) where S is strength
    // Let's model it simply for visual appeal
    const strength = 7; // days
    const retention = Math.max(15, Math.round(100 * Math.exp(-decayDays / strength)));
    setSimulatedRetention(retention);
  }, [decayDays]);

  // 4. Bilingual AI Tutor States
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [tutorOutput, setTutorOutput] = useState<{ bn: string; en: string; steps: string[]; code?: string } | null>(null);
  const [tutorTextLoading, setTutorTextLoading] = useState<boolean>(false);

  const handleSimulateTutor = (promptKey: string) => {
    setSelectedPrompt(promptKey);
    setTutorTextLoading(true);
    setTutorOutput(null);

    setTimeout(() => {
      setTutorTextLoading(false);
      if (promptKey === 'shortcut') {
        setTutorOutput({
          bn: "💡 নৌকা ও স্রোতের অংক মনে রাখার ম্যাজিক সূত্র:\nঅনুকূল বেগ = নৌকার বেগ + স্রোতের বেগ\nপ্রতিকূল বেগ = নৌকার বেগ - স্রোতের বেগ\n\nযদি অনুকূল ও প্রতিকূল বেগ দেওয়া থাকে, তবে:\nনৌকার বেগ = (অনুকূল বেগ + প্রতিকূল বেগ) / ২\nস্রোতের বেগ = (অনুকূল বেগ - প্রতিকূল বেগ) / ২",
          en: "⚡ Shortcut Logic:\nLet Speed downstream = D, and Speed upstream = U.\nSpeed of Boat in still water = (D + U)/2\nSpeed of Stream = (D - U)/2\n\nExample: If Downstream speed is 15 km/h and Upstream is 9 km/h, Boat Speed = (15+9)/2 = 12 km/h. Stream Speed = (15-9)/2 = 3 km/h.",
          steps: [
            "১. ডাউনস্ট্রিম (অনুকূল) এবং আপস্ট্রিম (প্রতিকূল) স্পিড আইডেন্টিফাই করুন।",
            "২. দুটি যোগ করে ২ দিয়ে ভাগ করলে নৌকার নিজস্ব গতি বের হবে।",
            "৩. ডাউনস্ট্রিম থেকে আপস্ট্রিম বিয়োগ করে ২ দিয়ে ভাগ করলে স্রোতের গতি বের হবে।"
          ]
        });
      } else if (promptKey === 'chronology') {
        setTutorOutput({
          bn: "📜 ভাষা আন্দোলন ও যুক্তফ্রন্ট ক্রনোলজি মনে রাখার টেকনিক:\n১৯৪৭: দেশভাগ ও তমুদ্দুন মজলিশ গঠন (ভাষা আন্দোলনের সূচনা)\n১৯৪৮: জিন্নাহর উর্দুকে একমাত্র রাষ্ট্রভাষা করার ঘোষণা ও প্রতিবাদ\n১৯৫২: ২১শে ফেব্রুয়ারি ১৪৪ ধারা অমান্য করে মিছিল এবং গুলিবর্ষণ\n১৯৫৪: যুক্তফ্রন্ট নির্বাচন (২১ দফা ইশতেহার ও বিপুল বিজয়)",
          en: "🔑 Key Chronological Sequence:\n1947: Partition & Formation of Tamaddun Majlish.\n1948: Jinnah declares Urdu as sole official language, triggering massive dissent.\n1952: Feb 21 - Violation of section 144, police firing, and martyrdom of Language Heroes.\n1954: United Front Elections - Historic landslide 21-point victory defeating the Muslim League.",
          steps: [
            "১. ১৯৪৭ সালেই তমুদ্দুন মজলিশ দিয়ে সূচনা মনে রাখুন।",
            "২. ১৯৪৮ সালে প্রথম রাষ্ট্রভাষা সংগ্রাম পরিষদ এবং জিন্নাহর বিতর্কিত উক্তি।",
            "৩. ১৯৫২ সালের ২১শে ফেব্রুয়ারি ও ২২শে ফেব্রুয়ারির ট্র্যাজিক ঘটনাপ্রবাহ।",
            "৪. ১৯৫৪ সালের যুক্তফ্রন্টের ২১ দফার সাথে ভাষা আন্দোলনের সম্পর্ক।"
          ]
        });
      } else if (promptKey === 'english_rule') {
        setTutorOutput({
          bn: "✍️ Subject-Verb Agreement: 'Neither/Either... or/nor' রুল:\nযখন দুইটি Subject 'neither... nor' বা 'either... or' দ্বারা যুক্ত হয়, তখন Verb টি তার সবচাইতে কাছে থাকা Subject (দ্বিতীয় Subject) অনুযায়ী নির্ধারিত হবে।",
          en: "📘 Essential Grammar Standard:\nWhen using correlative conjunctions like 'either... or' or 'neither... nor', the verb must agree in person and number with the nearest noun/pronoun (usually the second subject).\n\nExample: 'Neither the manager nor the employees were present.' (Employees is plural, so 'were' is correct).",
          steps: [
            "Identify the subjects connected by the correlative conjunctions.",
            "Locate the subject immediately preceding the verb.",
            "Match the singular or plural state of that nearest subject with the verb."
          ]
        });
      }
    }, 1200);
  };

  return (
    <div className={isNestedInApp ? "w-full text-neutral-100 font-sans pb-12 relative" : "min-h-screen bg-[#030303] text-neutral-100 font-sans pb-24 overflow-x-hidden relative"}>
      
      {/* Visual background decorations */}
      {!isNestedInApp && (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0c_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0c_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-indigo-500/5 blur-[120px] pointer-events-none rounded-full" />
          <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/5 blur-[150px] pointer-events-none rounded-full" />
        </>
      )}

      {/* Hero Header */}
      {!isNestedInApp && (
        <header className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-xl">
                <Sparkles className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <span className="text-sm font-bold tracking-tight font-mono text-neutral-100 flex items-center gap-2">
                  9TH GRADE <span className="text-[9px] bg-white/10 text-indigo-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest font-mono">SERVICES SYSTEM</span>
                </span>
                <p className="text-[10px] text-neutral-500 leading-none">Interactive Capabilities Command Center</p>
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

      {/* Main Container */}
      <main className={`${isNestedInApp ? "w-full" : "max-w-7xl mx-auto px-6"} pt-12 space-y-12 relative z-10 text-left`}>
        
        {/* Intro */}
        <div className="space-y-4 max-w-3xl">
          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/30 px-3 py-1.5 rounded-full border border-indigo-900/40 uppercase tracking-widest">
            Try Before You Register
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white font-display tracking-tight leading-tight">
            The Interactive <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">Services Command Center</span>
          </h1>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
            বিসিএস ও ব্যাংক প্রিপারেশনকে গতিশীল করতে র্যাংকফ্লো এআই অপারেটিং সিস্টেমের ৫টি মূল সার্ভিস নিচে রিয়েল-টাইম সিমুলেটরের মাধ্যমে এক্সপ্লোর করুন। বুঝুন কেন এটি সাধারণ পোর্টাল বা মুখস্থ করার অ্যাপের চেয়ে সম্পূর্ণ আলাদা ও অত্যন্ত কার্যকারী।
          </p>
        </div>

        {/* Services Console Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Tabs Bar */}
          <div className="lg:col-span-4 space-y-2 lg:sticky lg:top-24">
            <p className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest px-2">CHOOSE CAPABILITY DISCIPLINE</p>
            
            <div className="space-y-1.5">
              {[
                { 
                  id: 'quiz_cockpit', 
                  title: '১. লাইভ কুইজ ককপিট', 
                  sub: 'Live Quiz Cockpit Sim', 
                  desc: 'স্ট্রেস টাইমার ও স্পিড প্রেসার গজ সমৃদ্ধ রিয়েল টাইম এক্সাম এনভায়রনমেন্ট।', 
                  icon: Target,
                  color: 'text-emerald-400 bg-emerald-950/25 border-emerald-500/20'
                },
                { 
                  id: 'mistake_ledger', 
                  title: '২. স্মার্ট ভুল খাতা', 
                  sub: 'Smart Mistake Ledger Sim', 
                  desc: 'ভুলের কারণ বিশ্লেষণ এবং দুর্বল টপিকগুলোর স্বয়ংক্রিয় সংগ্রহশালা।', 
                  icon: BookOpen,
                  color: 'text-rose-400 bg-rose-950/25 border-rose-500/20'
                },
                { 
                  id: 'spaced_memory', 
                  title: '৩. স্পেসড মেমোরি রিভিশন', 
                  sub: 'Spaced Revision Curve Sim', 
                  desc: 'স্মৃতিশক্তি ক্ষয় ট্র্যাকার ও এআই শিডিউল রিমাইন্ডার মডিউল।', 
                  icon: RefreshCw,
                  color: 'text-cyan-400 bg-cyan-950/25 border-cyan-500/20'
                },
                { 
                  id: 'bilingual_tutor', 
                  title: '৪. দ্বীভাষিক এআই মেন্টর', 
                  sub: 'Bilingual AI Tutor Sim', 
                  desc: 'যেকোনো জটিল ম্যাথ শর্টকাট ও বিস্তারিত লিখিত বিশ্লেষণ কারিগর।', 
                  icon: MessageSquare,
                  color: 'text-indigo-400 bg-indigo-950/25 border-indigo-500/20'
                },
                { 
                  id: 'weakness_diagnostic', 
                  title: '৫. দুর্বলতা ও ক্লান্তি এনালাইটিক্স', 
                  sub: 'Diagnostic & Cognitive Maps', 
                  desc: 'আপনার পড়ার গতি, অনুমানের হার ও সাবজেক্টভিত্তিক দুর্বলতা ম্যাপার।', 
                  icon: BarChart,
                  color: 'text-amber-400 bg-amber-950/25 border-amber-500/20'
                }
              ].map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeServiceTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveServiceTab(tab.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer group ${
                      isActive 
                        ? 'bg-neutral-900 border-white/10 text-white shadow-xl shadow-black/50' 
                        : 'bg-transparent border-transparent text-neutral-400 hover:bg-neutral-900/40 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex gap-3.5 items-start">
                      <div className={`p-2.5 rounded-xl border transition-colors ${
                        isActive ? tab.color : 'bg-neutral-950 border-white/5 text-neutral-500 group-hover:text-neutral-300'
                      }`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold block">{tab.title}</span>
                        <span className="text-[10px] font-mono text-neutral-500 block uppercase">{tab.sub}</span>
                        <p className="text-[10px] text-neutral-500 line-clamp-2 mt-1 group-hover:text-neutral-400 font-sans leading-normal">{tab.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick action button inside details side menu */}
            <div className="p-4 bg-gradient-to-tr from-indigo-950/20 to-neutral-950 border border-white/5 rounded-2xl mt-4 text-center space-y-3">
              <span className="text-[9px] font-mono text-indigo-400 block uppercase font-bold tracking-widest">GET FULL ACCESS</span>
              <p className="text-[10px] text-neutral-500 font-sans leading-relaxed">
                Unlock real database persistence, full syllabus exams, and custom 45-day Study Plans.
              </p>
              {onEnterApp && (
                <button
                  onClick={onEnterApp}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-[10px] uppercase font-mono tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  Confirm and Launch <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Right Interface Console Board */}
          <div className="lg:col-span-8">
            <div className="bg-[#090909] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative min-h-[500px]">
              
              {/* Header Status of the Sim board */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 font-mono text-xs">
                <span className="flex items-center gap-2 text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  CAPABILITY SIMULATOR CORE : <span className="text-white font-bold uppercase">{activeServiceTab.replace('_', ' ')}</span>
                </span>
                <span className="text-[9px] text-neutral-500">v2.4.0 • SANDBOX MODE</span>
              </div>

              {/* SERVICE TAB 1: QUIZ COCKPIT SIMULATOR */}
              {activeServiceTab === 'quiz_cockpit' && (
                <div className="space-y-6">
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">1. TIME PRESSURE ENGINE SIMULATION</span>
                    <h3 className="text-lg sm:text-xl font-bold text-white">রিয়েল-টাইম কুইজ এনভায়রনমেন্ট</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      পরীক্ষার হলে সময়ের সাথে লড়াই করাই আসল চ্যালেঞ্জ। এখানে পরীক্ষা দিয়ে দেখুন কীভাবে আপনার উত্তর দেওয়ার স্পিড ট্র্যাকিং এবং স্পিড গজ রেসপন্স ক্যালকুলেট করে।
                    </p>
                  </div>

                  {/* Mode switcher */}
                  <div className="grid grid-cols-2 gap-3 max-w-sm font-mono text-[10px]">
                    <button
                      onClick={() => {
                        setCockpitMode('BCS');
                        resetQuizSim();
                      }}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        cockpitMode === 'BCS' ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400' : 'bg-neutral-950 border-white/5 text-neutral-500'
                      }`}
                    >
                      BPSC / BCS Mode
                    </button>
                    <button
                      onClick={() => {
                        setCockpitMode('BANK_AD');
                        resetQuizSim();
                      }}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        cockpitMode === 'BANK_AD' ? 'bg-rose-950/20 border-rose-500/40 text-rose-400' : 'bg-neutral-950 border-white/5 text-neutral-500'
                      }`}
                    >
                      Bank AD / IBA Mode
                    </button>
                  </div>

                  {/* Simulator Box */}
                  <div className="bg-black/50 border border-white/5 p-5 rounded-2xl space-y-4 text-left">
                    {/* Live HUD indicators */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-[10px] border-b border-white/5 pb-4">
                      <div>
                        <span className="text-neutral-500 block">⏱️ RESPONSE ELAPSED:</span>
                        <span className="text-sm font-bold text-neutral-200">{quizTimer}s</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">⚡ CURRENT PACE:</span>
                        <span className={`text-sm font-bold ${
                          quizPaceStatus.includes('⚠️') ? 'text-rose-400 animate-pulse' : quizPaceStatus.includes('⏱️') ? 'text-amber-400' : 'text-emerald-400'
                        }`}>{quizPaceStatus}</span>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-neutral-500 block">🛑 THRESHOLD TARGET:</span>
                        <span className="text-neutral-300 font-bold">{cockpitMode === 'BANK_AD' ? '45s Max (Analytical Math)' : '36s Max (General Studies)'}</span>
                      </div>
                    </div>

                    {/* Question representation */}
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[9px] bg-indigo-950 text-indigo-300 border border-indigo-900/40 px-2 py-0.5 rounded font-mono uppercase font-bold">
                          {cockpitMode === 'BCS' ? 'BCS PRELIM MCQ' : 'BANK AD ADVANCED MATH'}
                        </span>
                        <p className="text-sm sm:text-base font-bold text-neutral-100 font-sans">
                          {simQuestion[cockpitMode].text}
                        </p>
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {simQuestion[cockpitMode].options.map((opt, i) => {
                          const isCorrect = i === simQuestion[cockpitMode].correctIndex;
                          const isSelected = i === selectedQuizIndex;
                          return (
                            <button
                              key={i}
                              disabled={quizAnswered}
                              onClick={() => handleQuizAnswer(i)}
                              className={`p-3.5 rounded-xl border text-left font-sans transition-all cursor-pointer ${
                                !quizAnswered 
                                  ? 'bg-[#050505] border-white/5 hover:border-indigo-500/40 text-neutral-300 hover:text-white'
                                  : isCorrect 
                                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-bold shadow-lg shadow-emerald-950/20'
                                    : isSelected
                                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 font-bold'
                                      : 'bg-[#050505]/40 border-transparent text-neutral-600'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span>{i + 1}. {opt}</span>
                                {quizAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                                {quizAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Post Answer Reveals */}
                      <AnimatePresence>
                        {quizAnswered && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="bg-neutral-950 rounded-xl p-4 border border-white/5 text-xs font-mono space-y-3 overflow-hidden text-left"
                          >
                            <span className="text-[10px] text-indigo-400 uppercase font-bold block">🧠 COGNITIVE EXAMINER REPORT:</span>
                            <p className="font-sans text-neutral-300 leading-relaxed text-xs">
                              {simQuestion[cockpitMode].explanation}
                            </p>
                            <div className="flex flex-wrap gap-3 pt-2 text-[9px] border-t border-white/5 text-neutral-500">
                              <span>⏱️ Your Speed: <b className="text-white">{quizTimer} seconds</b></span>
                              <span>📈 Cohort Avg: <b className="text-white">{cockpitMode === 'BANK_AD' ? '41s' : '28s'}</b></span>
                              <span>🏆 Cognitive Score: <b className="text-emerald-400">{selectedQuizIndex === simQuestion[cockpitMode].correctIndex ? '100% Correct' : '0% Incorrect'}</b></span>
                            </div>
                            <button
                              onClick={resetQuizSim}
                              className="px-3 py-1.5 bg-indigo-950 border border-indigo-900 text-indigo-300 font-bold text-[9px] rounded-md hover:bg-indigo-900 hover:text-white transition-all cursor-pointer font-mono"
                            >
                              TRY SIMULATOR AGAIN
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  </div>
                </div>
              )}

              {/* SERVICE TAB 2: SMART MISTAKE LEDGER SIMULATOR */}
              {activeServiceTab === 'mistake_ledger' && (
                <div className="space-y-6">
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest font-bold">2. AUTOMATED ERROR LEDGER MODULE</span>
                    <h3 className="text-lg sm:text-xl font-bold text-white">ভুল খাতা - দি কগনিটিভ এরর বাস্টার</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      পরীক্ষায় ভুল হওয়া খুব স্বাভাবিক। কিন্তু যে ভুল একবার করেছেন, তা দ্বিতীয়বার না হওয়াই হচ্ছে আসল উইন। র্যাংকফ্লো-র 'ভুল খাতা' আপনার প্রতিটি ভুলকে এনালাইসিস করে তা ডি-কনজেস্ট করার মাধ্যমে দীর্ঘস্থায়ী মেমোরিতে পরিণত করে।
                    </p>
                  </div>

                  {/* Simulator Container */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-left">
                    
                    {/* List of logged mistakes */}
                    <div className="md:col-span-5 space-y-2">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold tracking-widest px-1 block">SIMULATED MISTAKE FLUX:</span>
                      {ledgerQuestions.map((q) => (
                        <button
                          key={q.id}
                          onClick={() => setActiveMistakeId(q.id)}
                          className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            activeMistakeId === q.id 
                              ? 'bg-rose-950/20 border-rose-500/40 text-rose-300 shadow-lg shadow-rose-950/10' 
                              : 'bg-neutral-950 border-white/5 text-neutral-400 hover:bg-neutral-900/60'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] font-mono font-bold bg-neutral-900 px-2 py-0.5 rounded border border-white/5 text-neutral-400">{q.topic}</span>
                            {q.decongested && <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/30 px-1.5 py-0.2 rounded font-bold">DECONGESTED</span>}
                          </div>
                          <p className="text-xs font-sans text-neutral-200 line-clamp-1">{q.question}</p>
                        </button>
                      ))}
                    </div>

                    {/* Active mistake details and AI decongestion action */}
                    <div className="md:col-span-7 bg-black/60 border border-white/5 rounded-2xl p-4.5 space-y-4">
                      {ledgerQuestions.filter(q => q.id === activeMistakeId).map((q) => (
                        <div key={q.id} className="space-y-3.5">
                          <div>
                            <div className="flex items-center gap-2 text-[9px] text-neutral-500 font-mono mb-1">
                              <span>SYLLABUS CLASS:</span>
                              <span className="text-neutral-300 font-bold">{q.relevance}</span>
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-neutral-200 font-sans leading-snug">{q.question}</h4>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-[#050505] p-3 rounded-xl border border-white/5">
                            <div>
                              <span className="text-rose-400 font-bold block">❌ Your Selected Answer:</span>
                              <span className="text-neutral-400 text-[11px] font-sans">{q.wrongAnswer}</span>
                            </div>
                            <div>
                              <span className="text-emerald-400 font-bold block">✓ Verified Correct:</span>
                              <span className="text-neutral-200 text-[11px] font-sans">{q.correctAnswer}</span>
                            </div>
                          </div>

                          <div className="space-y-1 font-mono text-[11px] text-left">
                            <span className="text-neutral-500 font-bold uppercase text-[9px]">⚠️ WHY YOU FAILED / বিভ্রান্তির মূল কারণ:</span>
                            <p className="font-sans text-neutral-400 leading-relaxed p-3 bg-neutral-950 rounded-xl border border-white/5">
                              {q.reason}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-white/5">
                            {q.decongested ? (
                              <motion.div 
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-emerald-950/20 border border-emerald-900/40 p-3.5 rounded-xl space-y-2"
                              >
                                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                                  AI Mnemonic Mapped to Spaced Recall:
                                </span>
                                <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                                  {q.id === 'm1' 
                                    ? "💡 চর্যাপদের পুথি আবিষ্কার হরপ্রসাদ শাস্ত্রী (নেপাল থেকে), তিব্বতী অনুবাদ আবিষ্কার প্রবোধচন্দ্র বাগচী (ত দিয়ে তিব্বতী, ব দিয়ে প্রবোধচন্দ্রের শেষের অক্ষর বাগচী)। ভুলবেন না!"
                                    : "💡 কাজের অংক শর্টকাট: (A*B)/(A+B) = (15*20)/(15+20) = 300 / 35 = 60/7 দিনে। সরাসরি ৩ সেকেন্ডে উত্তর।"
                                  }
                                </p>
                              </motion.div>
                            ) : (
                              <button
                                onClick={() => handleDecongest(q.id)}
                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/10"
                              >
                                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                                Run AI Concept Decongestion
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              )}

              {/* SERVICE TAB 3: SPACED MEMORY REVISION */}
              {activeServiceTab === 'spaced_memory' && (
                <div className="space-y-6 text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">3. MEMORY DECAY FORECASTER SIMULATION</span>
                    <h3 className="text-lg sm:text-xl font-bold text-white">স্পেসড মেমোরি রিভিশন ও ক্ষয় গণনা</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      যেকোনো তথ্য পড়ার ৪৮ ঘণ্টার মধ্যে আমাদের মস্তিষ্ক প্রায় ৬০% ভুলে যায়। র্যাংকফ্লো-র Spaced Learning Algorithm ট্র্যাকিং স্লাইডার দিয়ে আপনার স্মৃতি ক্ষয়ের হার এবং রিভিশন অ্যালার্ম রিয়েল-টাইমে টেস্ট করুন।
                    </p>
                  </div>

                  {/* Simulator Box */}
                  <div className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-6">
                    
                    {/* Slider control */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-neutral-400">DAYS ELAPSED SINCE STUDY (পড়ার পর অতিবাহিত দিন):</span>
                        <span className="text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/30 text-xs">Day {decayDays}</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="30" 
                        value={decayDays}
                        onChange={(e) => setDecayDays(parseInt(e.target.value))}
                        className="w-full accent-cyan-500 bg-neutral-900 h-2 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
                        <span>Day 1 (Fresh Concept)</span>
                        <span>Day 7 (Critical Point)</span>
                        <span>Day 15 (Severe Loss)</span>
                        <span>Day 30 (Complete Wipe)</span>
                      </div>
                    </div>

                    {/* Dynamic Status Graph */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                      
                      {/* Metric Display Card */}
                      <div className="space-y-4">
                        <div className="p-4 bg-[#050505] rounded-xl border border-white/5 space-y-1 text-center">
                          <span className="text-[10px] font-mono text-neutral-500 uppercase">RETENTION PROBABILITY (স্মৃতিতে থাকার সম্ভাবনা)</span>
                          <div className="text-3xl font-mono font-extrabold text-white transition-all duration-300">
                            {simulatedRetention}%
                          </div>
                          
                          {/* Progress Gauge */}
                          <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden mt-2">
                            <motion.div 
                              animate={{ width: `${simulatedRetention}%` }}
                              transition={{ duration: 0.3 }}
                              className={`h-full ${
                                simulatedRetention > 70 
                                  ? 'bg-emerald-500' 
                                  : simulatedRetention > 45 
                                    ? 'bg-amber-500' 
                                    : 'bg-rose-500 animate-pulse'
                              }`}
                            />
                          </div>
                        </div>

                        {/* System Action Warning Box */}
                        <div className="p-3 rounded-xl text-xs font-mono text-left">
                          {simulatedRetention > 70 ? (
                            <div className="text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 p-3 rounded-xl flex gap-2">
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                              <span>Memory stability is safe. No active review is triggered right now.</span>
                            </div>
                          ) : simulatedRetention > 45 ? (
                            <div className="text-amber-400 bg-amber-950/20 border border-amber-900/30 p-3 rounded-xl flex gap-2">
                              <AlertCircle className="w-4 h-4 flex-shrink-0" />
                              <span>Critical Point: AI algorithm schedules review task on your dashboard within 24 hours.</span>
                            </div>
                          ) : (
                            <div className="text-rose-400 bg-rose-950/20 border border-rose-900/30 p-3 rounded-xl flex gap-2">
                              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                              <span>Memory wiped out! Highly urgent revision triggered. Dashboard has flagged this topic as high-priority revision node.</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Visual Curve Representation */}
                      <div className="bg-[#050505] rounded-xl p-4 border border-white/5 space-y-3 font-mono text-[10px]">
                        <span className="text-neutral-500 uppercase font-bold tracking-wider block">Spaced Algorithm Recall Schedule:</span>
                        <div className="space-y-2 text-left font-sans text-xs text-neutral-300">
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold font-mono text-[9px] border border-indigo-900/40">1</span>
                            <span><b>Day 1 (Immediate Quiz):</b> Enforces sensory focus and records response delay parameters.</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold font-mono text-[9px] border border-indigo-900/40">2</span>
                            <span><b>Day 3 (Active recall checklist):</b> Measures recall retention without complete memory erosion.</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold font-mono text-[9px] border border-indigo-900/40">3</span>
                            <span><b>Day 7 & Day 14 (Sustained recall):</b> Solidifies facts in permanent neurological paths.</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* SERVICE TAB 4: BILINGUAL AI TUTOR */}
              {activeServiceTab === 'bilingual_tutor' && (
                <div className="space-y-6 text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold">4. CONVERSATIONAL SHORTCUTS & MEMORY MNEMONICS</span>
                    <h3 className="text-lg sm:text-xl font-bold text-white">দ্বীভাষিক এআই টিউটর ও ম্যাজিক ট্রিকস</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      যেকোনো প্রশ্নের পাশে থাকা 'Ask AI Tutor' বাটনে ক্লিক করলেই সেকেন্ডের মধ্যে সেই টপিকটির বাংলা ও ইংরেজি বিশ্লেষণ, মনে রাখার বিশেষ ট্রিক এবং শর্টকাট লিখিত ফর্মে পেয়ে যাবেন। নিচে সিমুলেট করুন:
                    </p>
                  </div>

                  {/* Simulator Prompts */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleSimulateTutor('shortcut')}
                        className={`px-3.5 py-2.5 rounded-xl border text-[11px] font-mono font-bold transition-all cursor-pointer ${
                          selectedPrompt === 'shortcut' ? 'bg-indigo-950 border-indigo-500 text-indigo-300' : 'bg-neutral-950 border-white/5 text-neutral-400 hover:border-white/10'
                        }`}
                      >
                        🛶 Math Boat & Stream Shortcut (নৌকা ও স্রোতের শর্টকাট)
                      </button>
                      <button
                        onClick={() => handleSimulateTutor('chronology')}
                        className={`px-3.5 py-2.5 rounded-xl border text-[11px] font-mono font-bold transition-all cursor-pointer ${
                          selectedPrompt === 'chronology' ? 'bg-indigo-950 border-indigo-500 text-indigo-300' : 'bg-neutral-950 border-white/5 text-neutral-400 hover:border-white/10'
                        }`}
                      >
                        📜 1952 Language Movement Chronology (মনে রাখার কৌশল)
                      </button>
                      <button
                        onClick={() => handleSimulateTutor('english_rule')}
                        className={`px-3.5 py-2.5 rounded-xl border text-[11px] font-mono font-bold transition-all cursor-pointer ${
                          selectedPrompt === 'english_rule' ? 'bg-indigo-950 border-indigo-500 text-indigo-300' : 'bg-neutral-950 border-white/5 text-neutral-400 hover:border-white/10'
                        }`}
                      >
                        ✍️ Subject-Verb Concord (Correlative Rules)
                      </button>
                    </div>

                    {/* Output Screen */}
                    <div className="bg-black/50 border border-white/5 rounded-2xl p-5 min-h-[220px] relative">
                      {tutorTextLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#090909]/90 rounded-2xl space-y-3 font-mono text-xs text-indigo-400">
                          <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
                          <span>Gemini 2.5 Flash Core Processing Live Response...</span>
                        </div>
                      )}

                      {!tutorTextLoading && !tutorOutput && (
                        <div className="flex flex-col items-center justify-center text-center py-10 space-y-2 text-neutral-500">
                          <MessageSquare className="w-8 h-8 text-neutral-700 animate-bounce" />
                          <p className="text-xs font-mono">উপরে যেকোনো একটি এআই প্রম্পটে ক্লিক করে দেখুন টিউটর কীভাবে উত্তর জেনারেট করে।</p>
                        </div>
                      )}

                      {!tutorTextLoading && tutorOutput && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-emerald-950/15 border border-emerald-900/20 p-4 rounded-xl space-y-2">
                              <span className="text-[10px] font-mono text-emerald-400 font-bold block">💡 shortcut mnemonic / বাংলা বিশ্লেষণ:</span>
                              <p className="text-neutral-200 text-xs font-sans leading-relaxed whitespace-pre-wrap">{tutorOutput.bn}</p>
                            </div>
                            <div className="bg-indigo-950/15 border border-indigo-900/20 p-4 rounded-xl space-y-2">
                              <span className="text-[10px] font-mono text-indigo-400 font-bold block">📘 English Synthesis & Written Standard:</span>
                              <p className="text-neutral-300 text-xs font-sans leading-relaxed whitespace-pre-wrap">{tutorOutput.en}</p>
                            </div>
                          </div>

                          <div className="bg-neutral-950 p-4 rounded-xl border border-white/5 text-xs text-left font-mono space-y-1.5">
                            <span className="text-[9px] text-neutral-500 uppercase">STEP-BY-STEP CONCEPT DECOMPOSITION (ধাপভিত্তিক বিশ্লেষণ):</span>
                            <ol className="list-decimal pl-4 space-y-1 text-neutral-400 font-sans">
                              {tutorOutput.steps.map((step, i) => (
                                <li key={i}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SERVICE TAB 5: DIAGNOSTICS & COGNITIVE WEAKNESS */}
              {activeServiceTab === 'weakness_diagnostic' && (
                <div className="space-y-6 text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">5. COGNITIVE METRICS & FATIGUE COEFFICIENTS</span>
                    <h3 className="text-lg sm:text-xl font-bold text-white">দুর্বলতা ম্যাপ ও পারফরম্যান্স এনালাইটিক্স</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      শুধু মুখস্থ করলেই হবে না, বুঝতে হবে আপনার শক্তি ও দুর্বলতা কোথায়। র্যাংকফ্লো-র ইন্টেলিজেন্ট ড্যাশবোর্ড আপনার পড়ার গতি, নির্ভুলতার হার এবং প্রতিদিনের ক্লান্তি বিশ্লেষণ করে সম্পূর্ণ গাণিতিক উপায়ে প্রজেকশন দেয়।
                    </p>
                  </div>

                  {/* Simulated Metrics Charts & Indicators */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[11px]">
                    
                    {/* Gauge 1 */}
                    <div className="bg-black/50 border border-white/5 p-4.5 rounded-2xl space-y-3">
                      <span className="text-neutral-500 uppercase text-[9px] block">GUESSWORK RATE (অনুমান নির্ভরতার হার):</span>
                      <div className="flex justify-between items-end border-b border-white/5 pb-2">
                        <span className="text-sm font-bold text-neutral-200">Bangla Lit: 12%</span>
                        <span className="text-emerald-400 text-[10px] font-bold">✓ Safe</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-neutral-200">English Lit: 42%</span>
                        <span className="text-rose-400 text-[10px] font-bold">⚠️ High Risk</span>
                      </div>
                      <p className="text-[9px] text-neutral-500 leading-relaxed font-sans pt-1">
                        আইডেন্টিফাইড উইকনেস: ইংরেজি লিটারেচারে প্রশ্ন এটেম্পট করার সময় অনুমানের হার অনেক বেশি, যা নেগেটিভ মার্কিং বাড়াচ্ছে।
                      </p>
                    </div>

                    {/* Gauge 2 */}
                    <div className="bg-black/50 border border-white/5 p-4.5 rounded-2xl space-y-3">
                      <span className="text-neutral-500 uppercase text-[9px] block">COGNITIVE FATIGUE INDEX (ক্লান্তি সূচক):</span>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px]">
                          <span>1st Hour: 12% fatigue</span>
                          <span className="text-emerald-400">Fresh</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span>3rd Hour: 45% fatigue</span>
                          <span className="text-amber-400">Normal</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span>5th Hour: 89% fatigue</span>
                          <span className="text-rose-400">Critical</span>
                        </div>
                      </div>
                      <p className="text-[9px] text-neutral-500 leading-relaxed font-sans pt-1">
                        সুপারিশ: একটানা ৪ ঘণ্টার বেশি প্র্যাকটিস করলে ভুলের হার ৪১% বেড়ে যায়। প্রতি ২ ঘণ্টা পর ১৫ মিনিটের এআই-রিফ্রেশ বিরতি নিন।
                      </p>
                    </div>

                    {/* Gauge 3 */}
                    <div className="bg-black/50 border border-white/5 p-4.5 rounded-2xl space-y-3">
                      <span className="text-neutral-500 uppercase text-[9px] block">NATIONAL PERCENTILE PREDICTION:</span>
                      <div className="text-center py-2 space-y-1">
                        <span className="text-3xl font-extrabold text-white">98.2%</span>
                        <span className="text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-900/40 px-2 py-0.5 rounded block w-fit mx-auto font-bold">PROJECTED RANK: #342</span>
                      </div>
                      <p className="text-[9px] text-neutral-500 leading-relaxed font-sans text-center">
                        ৪ লক্ষ প্রার্থীর মাঝে আপনার অবস্থান বর্তমান প্রস্তুতি সাপেক্ষে প্রথম ৫০০ এর মধ্যে প্রজেক্টেড।
                      </p>
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Feature comparison table and usefulness matrix */}
        <section className="pt-12 text-left space-y-6">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display">কেন র্যাংকফ্লো সাধারণ প্রিপারেশন অ্যাপ থেকে আলাদা?</h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              সরাসরি তুলনামূলক বিশ্লেষণ দেখে নিন। আমরা মেথডোলজি এবং ডাটা সাইন্স প্রয়োগ করে নিশ্চিত করি যেন আপনার প্রস্তুতির প্রতিটি সেকেন্ড সর্বোচ্চ রিডিউসড ইফোর্টে ৩ গুণ বেশি কাজ দেয়।
            </p>
          </div>

          <div className="bg-neutral-950 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-neutral-900/40 text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                    <th className="p-4 sm:p-5">ফিচার / সার্ভিস নাম</th>
                    <th className="p-4 sm:p-5">সাধারণ ফেসবুক গ্রুপ / বইয়ের মডেল টেস্ট</th>
                    <th className="p-4 sm:p-5 text-indigo-400 font-bold bg-indigo-950/10">র্যাংকফ্লো এআই ওএস সুবিধা</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-300">
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-white">প্রশ্ন কোয়ালিটি ও ডিস্ট্রাক্টর এনালাইসিস</td>
                    <td className="p-4 sm:p-5 text-neutral-500">গাইড বইয়ের মানহীন কপি-পেস্ট টাইপো যুক্ত প্রশ্ন।</td>
                    <td className="p-4 sm:p-5 text-indigo-300 bg-indigo-950/5 font-medium">BPSC মডারেটর নিয়মে সাইকোমেট্রিক পরীক্ষা ও নিখুঁত ভুল অপশন বিশ্লেষণ।</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-white">ভুল সংরক্ষণ মেথডলজি</td>
                    <td className="p-4 sm:p-5 text-neutral-500">খাতায় নিজে লিখে বা স্ক্রিনশট নিয়ে রাখা, যা কখনো রিভিশন দেওয়া হয় না।</td>
                    <td className="p-4 sm:p-5 text-indigo-300 bg-indigo-950/5 font-medium">স্বয়ংক্রিয় ডিজিটাল 'ভুল খাতা' এবং রিয়েল-টাইম এআই কনসেপ্ট ডি-কনজেস্ট।</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-white">ভুলে যাওয়ার প্রবণতা ট্র্যাকিং</td>
                    <td className="p-4 sm:p-5 text-neutral-500">কোনো ট্র্যাকিং নেই। পরীক্ষার ৩ দিন আগে রিভিশন দিতে গিয়ে হাহাকার।</td>
                    <td className="p-4 sm:p-5 text-indigo-300 bg-indigo-950/5 font-medium">Spaced Memory forgetting curve গণনা করে মেমোরি ক্ষয়ের শেষ মূহুর্তে রিভিশন নোটিফিকেশন।</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-white">সহায়তা ও লিখিত সমাধান মেন্টরশিপ</td>
                    <td className="p-4 sm:p-5 text-neutral-500">গ্রুপে পোস্ট দিয়ে উত্তর পাওয়ার দীর্ঘ অপেক্ষা বা ভুল গাইডলাইন।</td>
                    <td className="p-4 sm:p-5 text-indigo-300 bg-indigo-950/5 font-medium">২৪/৭ এআই মেন্টরশিপ, ইনস্ট্যান্ট বাংলা শর্টকাট ট্রিকস ও ইংরেজি লিখিত ফ্রেমওয়ার্ক।</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-white">মেধাতালিকা ও প্রজেকশন রেটিং</td>
                    <td className="p-4 sm:p-5 text-neutral-500">শুধুমাত্র কত মার্কস পেয়েছেন তা জানা যায়, প্রতিযোগী পজিশন অদৃশ্য।</td>
                    <td className="p-4 sm:p-5 text-indigo-300 bg-indigo-950/5 font-medium">২ লক্ষ পরীক্ষার্থীর ডাটার সাথে রিয়েল টাইম কম্পেয়ার করে সম্ভাব্য পাসিং পার্সেন্টাইল।</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Closing Action Banner */}
        <section className="bg-gradient-to-tr from-indigo-950/40 via-neutral-900 to-black rounded-3xl p-8 sm:p-12 border border-indigo-900/40 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">আপনার কগনিটিভ ক্যারিয়ার অপটিমাইজেশন শুরু করুন আজই</h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              সিমুলেটর টেস্ট তো করলেন, এবার রিয়েল-টাইম ড্যাশবোর্ড ও ক্লাউড ডাটাবেজ ইন্টিগ্রেশনের মাধ্যমে আপনার প্রিপারেশনকে প্রফেশনাল পর্যায়ে নিয়ে যান সম্পূর্ণ ফ্রিতে।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
            {onEnterApp && (
              <button
                onClick={onEnterApp}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-400 to-indigo-500 text-neutral-950 font-extrabold rounded-full text-xs uppercase font-mono tracking-wider hover:scale-[1.01] transition-transform shadow-lg shadow-indigo-500/15 cursor-pointer"
              >
                Launch Live App Now
              </button>
            )}
            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="w-full sm:w-auto px-6 py-3 border border-white/5 hover:border-white/10 bg-neutral-950/50 text-neutral-300 font-bold rounded-full text-xs font-mono transition-all cursor-pointer"
              >
                Back to Landing
              </button>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
