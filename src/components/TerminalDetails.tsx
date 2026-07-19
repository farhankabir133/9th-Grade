import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Terminal, ArrowLeft, Play, ArrowRight, Sparkles, 
  Command, Cpu, Shield, RefreshCw, Send, HelpCircle
} from 'lucide-react';

interface TerminalDetailsProps {
  onBackToLanding?: () => void;
  onEnterApp?: () => void;
  isNestedInApp?: boolean;
}

interface CommandOutput {
  text: string;
  type: 'input' | 'system' | 'success' | 'error' | 'info';
}

export default function TerminalDetails({ onBackToLanding, onEnterApp, isNestedInApp = false }: TerminalDetailsProps) {
  const [inputVal, setInputVal] = useState<string>('');
  const [terminalHistory, setTerminalHistory] = useState<CommandOutput[]>([
    { text: '9TH GRADE (9-OS) [Version 2.4.0.81]', type: 'system' },
    { text: '(c) 2026 9Th Grade AI Laboratories. All rights reserved.', type: 'system' },
    { text: 'Proust-Engine Connection established: Secure Handshake complete.', type: 'success' },
    { text: 'Type "help" to see available interactive sandbox operations.', type: 'info' }
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const handleCommandRun = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    const newLogs: CommandOutput[] = [
      ...terminalHistory,
      { text: `rf-guest@ros:~# ${cmd}`, type: 'input' }
    ];

    const parts = trimmed.split(' ');
    const baseCmd = parts[0];
    const args = parts.slice(1).join(' ');

    switch (baseCmd) {
      case 'help':
        newLogs.push(
          { text: '----------------------------------------', type: 'system' },
          { text: 'AVAILABLE COGNITIVE COMMANDS:', type: 'system' },
          { text: '  help            - View this operations reference list', type: 'info' },
          { text: '  diagnose        - Initiate dynamic BPSC / Bank syllabus diagnostic run', type: 'info' },
          { text: '  tutor <topic>   - Ask AI Tutor (topics: math, english, constitution)', type: 'info' },
          { text: '  spaced-recall   - View cognitive memory forgetting curve parameters', type: 'info' },
          { text: '  sysinfo         - Print system resource mapping and active AI models', type: 'info' },
          { text: '  profile         - Render platform creator & archetype information', type: 'info' },
          { text: '  clear           - Wipe the terminal output buffer', type: 'info' },
          { text: '----------------------------------------', type: 'system' }
        );
        break;

      case 'clear':
        setTerminalHistory([]);
        setInputVal('');
        return;

      case 'diagnose':
        newLogs.push(
          { text: '⚡ Running psychometric evaluation array...', type: 'system' },
          { text: '✓ Checking BPSC General Studies memory blocks...', type: 'success' },
          { text: '✓ Evaluating IBA Analytical Math speed coefficients...', type: 'success' },
          { text: '----------------------------------------', type: 'system' },
          { text: 'DIAGNOSTIC REPORT FOR: GUEST_ASPIRANT', type: 'info' },
          { text: '  • English Grammar: 82% (Excellent modifiers control)', type: 'success' },
          { text: '  • Quantitative Math: 41% (⏱️ Slow response speed - Average 54s per question)', type: 'error' },
          { text: '  • Bangladesh Constitution: 58% (Weak Article spacing)', type: 'error' },
          { text: '🤖 AI recommendation: math/english focus, daily target: 40mcqs.', type: 'success' }
        );
        break;

      case 'tutor':
        if (!args) {
          newLogs.push(
            { text: 'Error: Please specify a topic, e.g. "tutor math", "tutor english", "tutor constitution"', type: 'error' }
          );
        } else if (args === 'math') {
          newLogs.push(
            { text: '🧠 AI TUTOR (QUANTITATIVE MATH):', type: 'system' },
            { text: 'রুল: কাজের অংক (Work & Days) সেকেন্ডে করার কৌশল:', type: 'info' },
            { text: 'A কোনো কাজ করে x দিনে, B করে y দিনে। একসাথে করলে কাজ শেষ হবে: (x*y)/(x+y) দিনে।', type: 'success' },
            { text: 'উদাহরণ: A করে ১০ দিনে, B করে ১৫ দিনে। একত্রে করবে: (১০*১৫)/(১০+১৫) = ১৫০/২৫ = ৬ দিনে।', type: 'success' }
          );
        } else if (args === 'english') {
          newLogs.push(
            { text: '✍️ AI TUTOR (ENGLISH GRAMMAR modifier):', type: 'system' },
            { text: 'Rule: "Dangling Modifiers" error avoidance.', type: 'info' },
            { text: 'A modifier must clearly reference the immediate noun that follows the comma.', type: 'success' },
            { text: 'Incorrect: "Walking on the road, a snake bit him." (Snake was not walking!)', type: 'error' },
            { text: 'Correct: "Walking on the road, he was bitten by a snake." (He was walking)', type: 'success' }
          );
        } else if (args === 'constitution') {
          newLogs.push(
            { text: '📜 AI TUTOR (BANGLADESH CONSTITUTION):', type: 'system' },
            { text: 'মনে রাখার এমনেমোনিক: মৌলিক অধিকারের অনুচ্ছেদসমূহ (২৭ থেকে ৪৪):', type: 'info' },
            { text: 'অনুচ্ছেদ ২৭: আইনের দৃষ্টিতে সমতা (সব নাগরিক আইনের চোখে সমান)।', type: 'success' },
            { text: 'অনুচ্ছেদ ২৯: সরকারি নিয়োগে সুযোগের সমতা (চাকরি সবার সমান অধিকার)।', type: 'success' },
            { text: 'অনুচ্ছেদ ৩৬: চলাফেরার স্বাধীনতা (বাংলাদেশজুড়ে ফ্রিডম অফ মুভমেন্ট)।', type: 'success' }
          );
        } else {
          newLogs.push(
            { text: `No specific tutor module found for "${args}". Try "tutor math", "tutor english", or "tutor constitution"`, type: 'error' }
          );
        }
        break;

      case 'spaced-recall':
        newLogs.push(
          { text: '🧬 ACCESSING MEMORY RETENTION COEFFICIENT...', type: 'system' },
          { text: '  - Forgetting curve damping factor: S=7.2', type: 'info' },
          { text: '  - Current recall probability: 84% (Steady)', type: 'success' },
          { text: '  - Active revision schedules scheduled: 2 units for tomorrow morning.', type: 'info' }
        );
        break;

      case 'sysinfo':
        newLogs.push(
          { text: '🖥️ 9TH GRADE SYSTEM ARCHITECTURE:', type: 'system' },
          { text: '  - Kernel: 9-OS 2.4.0 (TypeScript Hybrid Dev)', type: 'info' },
          { text: '  - LLM Integration: Gemini 2.5 Flash API (Server-side)', type: 'info' },
          { text: '  - Database: Firebase Firestore Persistent Sync (Active)', type: 'info' },
          { text: '  - Memory: Proust cognitive state representation', type: 'info' },
          { text: '  - Client Port: 3000 (Ingress proxy OK)', type: 'success' }
        );
        break;

      case 'profile':
        newLogs.push(
          { text: '👤 OWNER ARCHETYPE CARD:', type: 'system' },
          { text: '  - Name: Farhan Kabir', type: 'info' },
          { text: '  - Roles: AI Engineer, Full Stack Developer, Researcher', type: 'info' },
          { text: '  - Specialization: Custom LLM workflows, adaptive learning graphs', type: 'success' },
          { text: '  - Project: 9Th Grade AI (Personalized OS for BCS & Bank)', type: 'success' }
        );
        break;

      default:
        newLogs.push(
          { text: `ros: command not found: "${baseCmd}". Type "help" to see valid sandbox actions.`, type: 'error' }
        );
        break;
    }

    setTerminalHistory(newLogs);
    setInputVal('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommandRun(inputVal);
    }
  };

  return (
    <div className={isNestedInApp ? "w-full text-[#00ff66] font-mono pb-12 relative text-left" : "min-h-screen bg-[#020202] text-[#00ff66] font-mono pb-24 overflow-x-hidden relative text-left"}>
      
      {/* Background scanline simulation overlay */}
      {!isNestedInApp && (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none z-10" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#00ff66]/10 pointer-events-none" />
        </>
      )}

      {/* Header */}
      {!isNestedInApp && (
        <header className="border-b border-[#00ff66]/10 bg-[#050505]/90 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 border border-[#00ff66]/30 rounded-lg">
                <Terminal className="w-5 h-5 text-[#00ff66] animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold tracking-tight text-[#00ff66] flex items-center gap-2">
                  9TH GRADE-OS <span className="text-[8px] border border-[#00ff66]/30 text-[#00ff66] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">SANDBOX TERM v2.4</span>
                </span>
                <p className="text-[9px] text-[#00ff66]/60 leading-none">Proust Neural Connection Module</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {onBackToLanding && (
                <button 
                  onClick={onBackToLanding}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded border border-[#00ff66]/20 bg-black text-[#00ff66]/80 hover:text-[#00ff66] hover:bg-[#00ff66]/10 text-xs transition-all cursor-pointer font-mono"
                >
                  ← EXIT TERMINAL
                </button>
              )}
              {onEnterApp && (
                <button 
                  onClick={onEnterApp}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#00ff66] hover:opacity-90 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-[#00ff66]/20 cursor-pointer font-mono"
                >
                  LAUNCH MAIN OS [ENTER] <Play className="w-2.5 h-2.5 fill-current" />
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      <main className={`${isNestedInApp ? "w-full" : "max-w-5xl mx-auto px-6"} pt-12 space-y-8 relative z-20`}>
        
        {/* Intro */}
        <div className="space-y-2 max-w-2xl text-[#00ff66]">
          <span className="text-[10px] border border-[#00ff66]/30 px-2.5 py-1 rounded uppercase tracking-widest font-bold">
            INTERACTIVE SHELL TRIAL
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
            9Th Grade OS Command Terminal
          </h1>
          <p className="text-[#00ff66]/70 text-xs leading-relaxed">
            এটি ৯থ গ্রেড এআই-এর লাইভ ট্রায়াল সেল। ইন্টারফেসের ডাইনামিক ডাটা ও এআই অ্যাসিস্ট্যান্ট লজিক ট্র্যাকিং করতে নিচের ইনপুট বক্সে কমান্ড টাইপ করুন বা রেডি বাটনে ক্লিক করে কুইক অপারেশন ট্রিগার করুন।
          </p>
        </div>

        {/* Dynamic Shortcut Action Cards */}
        <div className="space-y-1.5">
          <span className="text-[9px] text-[#00ff66]/60 uppercase tracking-widest block font-bold">QUICK COMMAND TARGETS (ক্লিক করে সরাসরি কমান্ড চালান):</span>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Run Diagnostic Test', cmd: 'diagnose' },
              { label: 'Tutor Math Trick', cmd: 'tutor math' },
              { label: 'Tutor modifier Rule', cmd: 'tutor english' },
              { label: 'Tutor Constitution', cmd: 'tutor constitution' },
              { label: 'Check Memory Decay', cmd: 'spaced-recall' },
              { label: 'Print System Core Stats', cmd: 'sysinfo' }
            ].map((shortcut) => (
              <button
                key={shortcut.label}
                onClick={() => handleCommandRun(shortcut.cmd)}
                className="px-3 py-1.5 rounded border border-[#00ff66]/20 bg-black text-[#00ff66]/70 hover:bg-[#00ff66]/5 hover:text-[#00ff66] text-[10px] font-mono transition-all cursor-pointer"
              >
                &gt; {shortcut.cmd}
              </button>
            ))}
          </div>
        </div>

        {/* Real Shell UI Window */}
        <div className="bg-[#030303]/90 border border-[#00ff66]/20 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-[#00ff66]/5 space-y-4">
          
          {/* Shell Output Log Window */}
          <div className="h-96 overflow-y-auto space-y-2 text-xs md:text-sm border-b border-[#00ff66]/15 pb-4 custom-scrollbar">
            {terminalHistory.map((log, index) => {
              let cl = 'text-[#00ff66]/80';
              if (log.type === 'input') cl = 'text-[#00ff66] font-bold';
              else if (log.type === 'success') cl = 'text-[#33ff33] font-bold';
              else if (log.type === 'error') cl = 'text-[#ff3333] font-mono';
              else if (log.type === 'info') cl = 'text-[#3399ff]';
              return (
                <div key={index} className={`whitespace-pre-wrap leading-relaxed ${cl}`}>
                  {log.text}
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>

          {/* Shell Input Prompt */}
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <span className="text-[#00ff66] font-bold">rf-guest@ros:~#</span>
            <input 
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 bg-transparent text-[#00ff66] focus:outline-none border-none caret-[#00ff66]"
              placeholder='Type a command (e.g. "help", "diagnose")...'
              autoFocus
            />
            <button
              onClick={() => handleCommandRun(inputVal)}
              className="p-1 border border-[#00ff66]/30 rounded text-[#00ff66] hover:bg-[#00ff66]/10 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </main>

    </div>
  );
}
