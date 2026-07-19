import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Award, TrendingUp, RefreshCw, AlertTriangle, 
  Brain, Calendar, Clock, ArrowRight, Zap, Target, BookOpen, 
  MessageSquare, BarChart, Settings, LogOut, FileText, UserCheck, CheckCircle2, User,
  ChevronDown, ArrowLeft, Play, Info, Flame, Eye, Edit3, CircleDot
} from 'lucide-react';

interface BentoDetailsProps {
  onBackToLanding?: () => void;
  onEnterApp?: () => void;
  isNestedInApp?: boolean;
}

export default function BentoDetails({ onBackToLanding, onEnterApp, isNestedInApp = false }: BentoDetailsProps) {
  const [activeSubsystem, setActiveSubsystem] = useState<string>('study_scheduler');
  
  // Subsystem 1: Study scheduler simulator
  const [targetExamDate, setTargetExamDate] = useState<string>("2026-11-20");
  const [dailyHours, setDailyHours] = useState<number>(6);
  
  // Subsystem 2: Written Evaluator simulator
  const [writtenQuestion, setWrittenQuestion] = useState<string>("পদ্মা সেতুর অর্থনৈতিক গুরুত্ব সংক্ষেপে আলোচনা করুন।");
  const [userWrittenAnswer, setUserWrittenAnswer] = useState<string>("পদ্মা সেতু বাংলাদেশের যোগাযোগ খাতের একটি অন্যতম মাইলফলক। এটি দেশের দক্ষিণ-পশ্চিমাঞ্চলের ২১টি জেলাকে সরাসরি সংযুক্ত করেছে। এর ফলে যাতায়াতের সময় সাশ্রয় হচ্ছে এবং ওই অঞ্চলের জিডিপি প্রবৃদ্ধি ১.২% বৃদ্ধি পাবে বলে ধারণা করা হচ্ছে।");
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Subsystem 3: Dynamic Job Registry warnings
  const [birthYear, setBirthYear] = useState<number>(1998);
  const [isFreedomFighterQuota, setIsFreedomFighterQuota] = useState<boolean>(false);

  const calculateAge = () => {
    // Current year in simulation is 2026 (based on current local date 2026)
    return 2026 - birthYear;
  };

  const getJobEligibility = () => {
    const age = calculateAge();
    const limit = isFreedomFighterQuota ? 32 : 30;
    const isEligible = age <= limit;
    return {
      age,
      limit,
      isEligible,
      warning: isEligible 
        ? `🟢 Eligible: You have ${limit - age} years left for normal BPSC applications.` 
        : `🔴 Overaged: You are ${age} years old. Standard BPSC circular limits are breached.`
    };
  };

  const handleSimulateEvaluation = () => {
    if (!userWrittenAnswer.trim()) return;
    setIsEvaluating(true);
    setEvaluationResult(null);

    setTimeout(() => {
      setIsEvaluating(false);
      setEvaluationResult({
        score: 7.5,
        maxScore: 10,
        grade: "A- Excellent Concept",
        pros: [
          "জিডিপি প্রবৃদ্ধির হার (১.২%) সঠিক ডাটা সহ উপস্থাপন করা হয়েছে।",
          "ভৌগোলিক গুরুত্বের ক্ষেত্রে দক্ষিণ-পশ্চিমাঞ্চলের ২১টি জেলার সঠিক উল্লেখ আছে।"
        ],
        cons: [
          "অর্থনৈতিক গুরুত্বের ক্ষেত্রে আঞ্চলিক ও আন্তর্জাতিক বানিজ্যিক কানেক্টিভিটি (যেমন মোংলা বন্দর ও পায়রা বন্দর) নিয়ে আরও আলোচনা করা যেত।"
        ],
        recommends: "পরবর্তী উত্তরের সাথে মোংলা ও পায়রা বন্দরের বাণিজ্যিক যোগসূত্র হাইলাইট করুন এবং অর্থনৈতিক জোনের পরিসংখ্যান যুক্ত করুন।"
      });
    }, 1500);
  };

  return (
    <div className={isNestedInApp ? "w-full text-neutral-100 font-sans pb-12 relative" : "min-h-screen bg-[#030303] text-neutral-100 font-sans pb-24 overflow-x-hidden relative"}>
      
      {/* Background decorations */}
      {!isNestedInApp && (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0c_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0c_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-indigo-500/5 blur-[120px] pointer-events-none rounded-full" />
          <div className="absolute bottom-20 left-10 w-[500px] h-[300px] bg-emerald-500/5 blur-[150px] pointer-events-none rounded-full" />
        </>
      )}

      {/* Hero Header */}
      {!isNestedInApp && (
        <header className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-xl">
                <Award className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <span className="text-sm font-bold tracking-tight font-mono text-neutral-100 flex items-center gap-2">
                  9TH GRADE <span className="text-[9px] bg-white/10 text-indigo-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest font-mono">BENTO ENGINE</span>
                </span>
                <p className="text-[10px] text-neutral-500 leading-none">Cognitive Operating Subsystems Hub</p>
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
        
        {/* Intro */}
        <div className="space-y-4 max-w-3xl">
          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/30 px-3 py-1.5 rounded-full border border-indigo-900/40 uppercase tracking-widest">
            OPERATIONAL SUBSYSTEMS
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white font-display tracking-tight leading-tight">
            System Cognitive <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">Integrated Subsystems</span>
          </h1>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
            র্যাংকফ্লো-র বেন্টো গ্রিড কোর সিস্টেমের ৩টি মেগা মডিউল এখানে লাইভ এক্সপ্লোর করুন। দেখুন কীভাবে ডাইনামিক স্টাডি প্ল্যানিং, এআই রিটেন ইভালুয়েশন এবং স্মার্ট সার্কুলার ম্যাপিং আপনার প্রস্তুতিকে সম্পূর্ণ অটোমেটিক করে তোলে।
          </p>
        </div>

        {/* Sidebar + Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Subsystem Navigation Cards */}
          <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-24">
            <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest px-1 block">CHOOSE SUBSYSTEM MODULE:</span>
            
            <div className="space-y-2">
              {[
                {
                  id: "study_scheduler",
                  title: "🗓️ 45-Day Study Scheduler",
                  sub: "DYNAMICAL PLANNER ENGINE",
                  desc: "আপনার পরীক্ষার তারিখ ও পড়ার সময় অনুযায়ী সম্পূর্ণ অটোমেটিক ডেইলি টার্গেট ম্যাট্রিক্স তৈরি করে।"
                },
                {
                  id: "written_evaluator",
                  title: "✍️ Written Gemini Evaluator",
                  sub: "AI ASSISTED GRADING ENGINE",
                  desc: "বিসিএস রিটেন ও ব্যাংক ফোকাস রাইটিং খাতা সেকেন্ডের মধ্যে এনালাইসিস করে মার্কিং ও রিকমেন্ডেশন প্রদানকারী।"
                },
                {
                  id: "circular_registry",
                  title: "💼 Career Circular & Age Limits",
                  sub: "BPSC CIRCULAR & ELIGIBILITY",
                  desc: "বয়সের ক্রান্তিকালীন সীমা, ক্যাডার চয়েস রুলস এবং জেলাভিত্তিক পদ বিন্যাস হিসাবকারী।"
                }
              ].map((sub) => {
                const isActive = activeSubsystem === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubsystem(sub.id)}
                    className={`w-full text-left p-4.5 rounded-2xl border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-neutral-900 border-white/10 text-white shadow-xl shadow-black/50' 
                        : 'bg-transparent border-transparent text-neutral-400 hover:bg-neutral-900/40'
                    }`}
                  >
                    <span className="text-xs font-bold block">{sub.title}</span>
                    <span className="text-[10px] font-mono text-indigo-400 block mt-0.5">{sub.sub}</span>
                    <p className="text-[10px] text-neutral-500 leading-relaxed font-sans mt-2">{sub.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Interactive Sandbox View */}
          <div className="lg:col-span-8 bg-[#090909] border border-white/5 rounded-3xl p-6 sm:p-8 min-h-[500px]">
            
            <AnimatePresence mode="wait">
              
              {/* MODULE 1: STUDY PLAN SCHEDULER */}
              {activeSubsystem === 'study_scheduler' && (
                <motion.div
                  key="study_scheduler"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="text-left space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">🗓️ COGNITIVE SCHEDULER SIMULATION</span>
                    <h3 className="text-xl font-bold text-white">45-Day Study Scheduler & Milestone Curve</h3>
                    <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                      পরীক্ষার তারিখ সেট করুন এবং প্রতিদিন কত ঘণ্টা পড়ার সময় দিতে পারবেন তা নির্ধারণ করুন। লাইভ ক্যালকুলেটরটি আপনার রিভিশন শিডিউল ভাগ করে প্রজেক্ট করবে।
                    </p>
                  </div>

                  {/* Simulator Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 text-left">
                      <label className="text-[9px] font-mono font-bold text-neutral-500 block uppercase">1. ESTIMATED EXAM DATE (পরীক্ষার সম্ভাব্য তারিখ):</label>
                      <input 
                        type="date" 
                        value={targetExamDate}
                        onChange={(e) => setTargetExamDate(e.target.value)}
                        className="w-full bg-black border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-neutral-300 font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[9px] font-mono font-bold text-neutral-500 block uppercase">2. STUDY HOURS PER DAY (দৈনিক পড়ার সময়):</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="range" 
                          min="2" 
                          max="16" 
                          value={dailyHours}
                          onChange={(e) => setDailyHours(parseInt(e.target.value))}
                          className="w-full accent-cyan-400 bg-neutral-900 h-2 rounded-lg cursor-pointer"
                        />
                        <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-900/30 whitespace-nowrap">{dailyHours} hours</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Milestone visual output */}
                  <div className="bg-black/50 border border-white/5 rounded-2xl p-5 space-y-4 font-mono text-xs">
                    <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold block">GENERATED 45-DAY COMPRESSION SCHEDULE:</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 bg-neutral-950 rounded-xl border border-white/5 text-left space-y-1">
                        <span className="text-[9px] text-neutral-500 uppercase">Phase 1: Syllabus Core (Day 1-20)</span>
                        <div className="text-sm font-bold text-neutral-200">
                          {dailyHours * 20} hours study
                        </div>
                        <p className="text-[9px] text-neutral-400 font-sans leading-normal">সবচেয়ে গুরুত্বপূর্ণ ডিস্ট্রিবিউশন টপিকগুলো কমপ্লিট করা হবে।</p>
                      </div>
                      <div className="p-3.5 bg-neutral-950 rounded-xl border border-white/5 text-left space-y-1">
                        <span className="text-[9px] text-neutral-500 uppercase">Phase 2: Error Buster (Day 21-35)</span>
                        <div className="text-sm font-bold text-neutral-200">
                          {dailyHours * 15} hours study
                        </div>
                        <p className="text-[9px] text-neutral-400 font-sans leading-normal">আপনার ভুল খাতার ডাটা অনুযায়ী উইক টপিক রিভিশন করা হবে।</p>
                      </div>
                      <div className="p-3.5 bg-neutral-950 rounded-xl border border-white/5 text-left space-y-1">
                        <span className="text-[9px] text-neutral-500 uppercase">Phase 3: Stress Run (Day 36-45)</span>
                        <div className="text-sm font-bold text-neutral-200">
                          {dailyHours * 10} hours study
                        </div>
                        <p className="text-[9px] text-neutral-400 font-sans leading-normal">১০০ মার্কসের স্পিড ককপিট মক টেস্ট ও কগনিটিভ স্পেসিং লুপ এনফোর্সমেন্ট।</p>
                      </div>
                    </div>

                    <div className="text-[10px] text-neutral-500 text-left pt-2 border-t border-white/5 font-sans leading-relaxed">
                      ✓ This dynamically adjust to matching your target exam timeline: <b className="text-neutral-300 font-mono">{targetExamDate}</b>. Total allocated core study is <b className="text-cyan-400 font-mono">{dailyHours * 45} hours</b> of high-retention learning.
                    </div>
                  </div>
                </motion.div>
              )}

              {/* MODULE 2: WRITTEN EVALUATOR */}
              {activeSubsystem === 'written_evaluator' && (
                <motion.div
                  key="written_evaluator"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 text-left"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest font-bold">✍️ AI WRITTEN EXAMINER INTERACTIVE</span>
                    <h3 className="text-xl font-bold text-white">Written Answer Gemini Evaluator Sim</h3>
                    <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                      বিসিএস রিটেন বা ব্যাংক আইবিএ ফোকাসড রাইটিং পরীক্ষায় ভালো করার পূর্বশর্ত হলো উত্তরটিকে সুন্দর উপাত্ত দিয়ে গুছিয়ে লেখা। এখানে ট্রায়াল দিয়ে দেখুন কীভাবে এআই খাতা মূল্যায়ণ করে।
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold">WRITTEN QUESTION PROMPT (পরীক্ষার রিটেন প্রশ্ন):</span>
                      <div className="p-3 bg-neutral-950 rounded-xl border border-white/5 text-xs text-neutral-200 font-sans font-bold">
                        {writtenQuestion}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold">YOUR DETAILED ANSWER (আপনার খসড়া উত্তরটি লিখুন বা পরিবর্তন করুন):</span>
                      <textarea 
                        rows={3}
                        value={userWrittenAnswer}
                        onChange={(e) => setUserWrittenAnswer(e.target.value)}
                        className="w-full bg-black border border-white/5 rounded-xl p-3.5 text-xs text-neutral-300 font-sans leading-relaxed focus:outline-none focus:border-indigo-500 resize-none"
                      />
                    </div>

                    {isEvaluating ? (
                      <div className="p-8 bg-neutral-950 border border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-3">
                        <RefreshCw className="w-6 h-6 text-rose-400 animate-spin" />
                        <span className="text-xs font-mono text-neutral-400">Gemini 2.5 Flash Analyzing Answer structure...</span>
                      </div>
                    ) : evaluationResult ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-5 bg-neutral-950 border border-white/5 rounded-2xl space-y-4 text-xs font-mono"
                      >
                        <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                          <span className="text-[10px] text-rose-400 font-bold block">🎯 EVALUATION SCORECARD:</span>
                          <span className="text-sm font-bold text-emerald-400">{evaluationResult.score} / {evaluationResult.maxScore} ({evaluationResult.grade})</span>
                        </div>

                        <div className="space-y-3 text-left">
                          <div>
                            <span className="text-[9px] text-neutral-500 uppercase font-bold block">✓ PROS / উত্তরের ইতিবাচক দিক:</span>
                            <ul className="list-disc pl-4 space-y-1 text-neutral-300 font-sans text-xs mt-1">
                              {evaluationResult.pros.map((p: string, i: number) => <li key={i}>{p}</li>)}
                            </ul>
                          </div>
                          <div>
                            <span className="text-[9px] text-neutral-500 uppercase font-bold block">⚠️ WEAK POINTS / কোথায় ঘাটতি ছিল:</span>
                            <ul className="list-disc pl-4 space-y-1 text-neutral-300 font-sans text-xs mt-1">
                              {evaluationResult.cons.map((c: string, i: number) => <li key={i}>{c}</li>)}
                            </ul>
                          </div>
                          <div className="p-3.5 bg-indigo-950/20 border border-indigo-900/40 rounded-xl">
                            <span className="text-[9px] text-indigo-400 font-bold block">💡 AI TUTOR RECOMMENDATION:</span>
                            <p className="text-neutral-300 font-sans text-xs mt-1 leading-relaxed">{evaluationResult.recommends}</p>
                          </div>
                        </div>

                        <button 
                          onClick={() => setEvaluationResult(null)}
                          className="px-3.5 py-1.5 bg-neutral-900 text-neutral-400 hover:text-white rounded border border-white/5 text-[9px] cursor-pointer transition-all"
                        >
                          RESET SIMULATOR
                        </button>
                      </motion.div>
                    ) : (
                      <button
                        onClick={handleSimulateEvaluation}
                        className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-mono uppercase font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-rose-600/10"
                      >
                        <Sparkles className="w-4 h-4 text-white" />
                        RUN AI EVALUATION ON WRITTEN ANSWER
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* MODULE 3: CIRCULAR REGISTRY & ELIGIBILITY */}
              {activeSubsystem === 'circular_registry' && (
                <motion.div
                  key="circular_registry"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 text-left"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">💼 CAREER BOUNDS & AGE RANGE</span>
                    <h3 className="text-xl font-bold text-white">BPSC Circular & Age Limit Warnings</h3>
                    <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                      বিসিএস প্রিলিতে ও ব্যাংকে আবেদনের ক্ষেত্রে সঠিক বয়স জানা জরুরি। নিচে আপনার জন্মসাল সিলেক্ট করে চেক করুন লাইভ এলিজিবিলিটি ও ক্রান্তিকালীন এলার্ট এনালাইসিস।
                    </p>
                  </div>

                  {/* Simulator Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono font-bold text-neutral-500 block uppercase">1. CHOOSE YEAR OF BIRTH (জন্মসাল):</label>
                      <select 
                        value={birthYear}
                        onChange={(e) => setBirthYear(parseInt(e.target.value))}
                        className="w-full bg-black border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 font-mono focus:outline-none focus:border-indigo-500"
                      >
                        {Array.from({ length: 25 }, (_, i) => 1985 + i).map(yr => (
                          <option key={yr} value={yr}>Year {yr}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono font-bold text-neutral-500 block uppercase">2. QUOTA (কোটা স্ট্যাটাস):</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setIsFreedomFighterQuota(false)}
                          className={`flex-1 p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs ${
                            !isFreedomFighterQuota ? 'bg-amber-950/20 border-amber-500/40 text-amber-300' : 'bg-black border-white/5 text-neutral-500'
                          }`}
                        >
                          No Quota (General)
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsFreedomFighterQuota(true)}
                          className={`flex-1 p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs ${
                            isFreedomFighterQuota ? 'bg-amber-950/20 border-amber-500/40 text-amber-300' : 'bg-black border-white/5 text-neutral-500'
                          }`}
                        >
                          Freedom Fighter Quota
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Eligibility Output Card */}
                  <div className="bg-black/50 border border-white/5 rounded-2xl p-5 space-y-4 font-mono text-xs text-left">
                    <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold block">LIVE SYSTEM CALCULATOR FEEDBACK:</span>
                    
                    <div className="p-4 bg-neutral-950 border border-white/5 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${getJobEligibility().isEligible ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                        <span className="text-xs font-bold text-neutral-200">Calculated Age: {getJobEligibility().age} Years Old</span>
                      </div>
                      <p className="text-xs font-sans text-neutral-300 leading-relaxed">
                        {getJobEligibility().warning}
                      </p>
                    </div>

                    <div className="space-y-2 text-[10px] text-neutral-400 font-sans leading-relaxed">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block font-bold">CIRCULAR TRACKING ENGINE HIGHLIGHTS:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                        <div className="p-3 bg-neutral-950 rounded-lg border border-white/5 text-[11px]">
                          <span><b>BPSC Civil Services Circular:</b> Target BPSC 46th & 47th prelim entries. Adaptive matching active.</span>
                        </div>
                        <div className="p-3 bg-neutral-950 rounded-lg border border-white/5 text-[11px]">
                          <span><b>IBA Banking Circular:</b> Combined Bank Senior Officer exam targets. Quantitative analytics active.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

          </div>

        </div>

      </main>

    </div>
  );
}
