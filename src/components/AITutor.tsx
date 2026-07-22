import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, Award, Trash2, ArrowRight, Brain, 
  HelpCircle, CheckCircle2, Globe, Flame, RefreshCw, MessageCircle 
} from 'lucide-react';
import { Message, ExamType } from '../types';
import { useAuth } from '../lib/AuthContext.tsx';

interface AITutorProps {
  examType: ExamType;
  initialTopic?: string;
}

export default function AITutor({ examType, initialTopic }: AITutorProps) {
  
  const { accessToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "wel-1",
      sender: "ai",
      text: "স্বাগতম! আমি আপনার 9Th Grade AI টিউটর। BCS সিভিল সার্ভিস ক্যাডার প্রিপারেশন এবং বিশ্ববিদ্যালয় এডমিশনের কঠিন টপিকগুলো সহজভাবে ব্যাখ্যা করাই আমার কাজ।",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      bilingual: {
        bn: "যেকোনো বিষয় যেমন গাণিতিক যুক্তি, সন্ধি বিচ্ছেদ, ইংরেজি সাহিত্য বা সংবিধানের কোনো অনুচ্ছেদ বুঝতে পারছেন না? আমাকে বাংলায় অথবা ইংরেজিতে জিজ্ঞেস করুন।",
        en: "Confused about English literature periods, constitutional articles, or mathematical algorithms? Drop me a question and I will decompose it step-by-step!"
      },
      stepByStep: [
        "১. আপনার সিলেবাসের দুর্বল টপিকটি ইনপুটে লিখুন।",
        "২. 'Simplified Mode' অথবা 'Advanced Mode' সিলেক্ট করুন।",
        "৩. তাৎক্ষণিক বাংলা ও ইংরেজি ব্যাখ্যা বিশ্লেষণ ডাউনলোড করুন।"
      ],
      conceptDecomposition: "BCS এবং এডমিশন টেস্টে ৬০% প্রশ্ন আসে সম্পূর্ণ তাত্ত্বিক ধারণা থেকে। বাকি ৪০% আসে ধারণাগত সংমিশ্রণ থেকে।"
    }
  ]);

  const [input, setInput] = useState<string>(initialTopic ? `ব্যাখ্যা করুন: ${initialTopic}` : '');
  const [subjectFilter, setSubjectFilter] = useState<string>('General Study');
  const [reasoningLevel, setReasoningLevel] = useState<'simplified' | 'advanced'>('simplified');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: "u-" + Math.random().toString(36).substring(7),
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({
          message: userMsg.text,
          history: messages.slice(-6), // Send last 3 rounds
          examType,
          subject: subjectFilter
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          ...data,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error("Tutor backend offline or unconfigured");
      }
    } catch (err) {
      console.error("AI Tutor call failed, loading fallback...", err);
      // Fallback message
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: "fallback-" + Math.random(),
          sender: "ai",
          text: `[offline fallback concerning "${userMsg.text}"] দুঃখিত, সাময়িকভাবে AI সার্ভারের সাথে যোগাযোগ স্থাপন বাধাগ্রস্ত হয়েছে। তবে BCS সিলেবাস অনুযায়ী এই বিষয়ের গুরুত্বপূর্ণ তথ্যগুলো নিচে দেওয়া হলো:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          bilingual: {
            bn: `আপনার প্রশ্ন: "${userMsg.text}" এর ব্যাখ্যায় সংবিধানের ধারা ও গাণিতিক সূত্রের যথার্থ ব্যবহার নিশ্চিত করতে হবে। BCS প্রিলিতে ১ নম্বর এর জন্য এই অংশ গুরুত্বপূর্ণ।`,
            en: `Regarding: "${userMsg.text}". Focus on historical precedents, essential exceptions, and correct syntactic structures.`
          },
          stepByStep: [
            "১. চর্যাপদ বাংলা সাহিত্যের প্রথম আদি নিদর্শন। এটি নেপাল থেকে ১৯০৭ সালে উদ্ধার করা হয়।",
            "২. ব্যাকরণের ধ্বনি তত্ত্ব অংশে উচ্চারণ স্থান মনে রাখার শর্টকাট টেকনিকসমূহ বারংবার অনুশীলন করুন।"
          ],
          conceptDecomposition: "Syllabus mapping: Area historically tests candidates on basic memory cues and recall indexes."
        }]);
      }, 800);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([messages[0]]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn h-auto lg:h-[calc(100vh-14rem)] lg:max-h-[750px] text-slate-100">
      
      {/* Left Column Chat control settings */}
      <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-cyan-950 text-cyan-400 border border-cyan-800/30 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider">AI Assistant Options</h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Configure your AI tutor system instructions dynamically to get tailored solutions for BCS examinations.
          </p>

          <div className="space-y-3 font-sans text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-500 font-semibold uppercase block text-[10px]">Subject Context</label>
              <select 
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 p-2.5 rounded-xl outline-none"
              >
                <option value="Bangla Language & Literature">Bangla Language & Literature</option>
                <option value="English Literature">English Language & Literature</option>
                <option value="Mathematical Reasoning">Mathematical Reasoning</option>
                <option value="Bangladesh Constitution">Bangladesh & Global Constitution</option>
                <option value="General Science & Computer">Science & IT Informatics</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-500 font-semibold uppercase block text-[10px]">Decomposition Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setReasoningLevel('simplified')}
                  className={`py-2 rounded-xl border text-center transition-colors ${
                    reasoningLevel === 'simplified' 
                      ? 'bg-cyan-950/40 text-cyan-400 border-cyan-500/30 font-bold' 
                      : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                  }`}
                >
                  Simplified Mode
                </button>
                <button
                  type="button"
                  onClick={() => setReasoningLevel('advanced')}
                  className={`py-2 rounded-xl border text-center transition-colors ${
                    reasoningLevel === 'advanced' 
                      ? 'bg-indigo-950/40 text-indigo-400 border-indigo-500/30 font-bold' 
                      : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                  }`}
                >
                  Advanced Mode
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Core Quick Prompts */}
        <div className="space-y-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono block">SUGGESTED DISCUSSIONS</span>
          <div className="space-y-1">
            {[
              "চর্যাপদ আবিষ্কারের ইতিহাস বলুন",
              "Constitution Article 137 explain",
              "সরল সুদ দ্বিগুন হবার শর্টকাট সূত্র",
              "English Romantic period milestones"
            ].map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInput(p)}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 duration-150 text-slate-300 border border-slate-850 text-xs truncate font-sans"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={clearChat}
          className="w-full py-2.5 text-rose-400 hover:text-white hover:bg-rose-950/20 text-xs font-semibold rounded-xl border border-rose-950 border-transparent hover:border-rose-900/40 transition-all flex items-center justify-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Tutor History
        </button>
      </div>

      {/* Right Column Core Chat Area */}
      <div className="lg:col-span-8 flex flex-col justify-between p-4 md:p-6 rounded-2xl bg-slate-900 border border-slate-850">
        
        {/* Messages viewport */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-[250px] max-h-[400px] lg:max-h-[500px]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Visual Avatar icons */}
                <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center ${
                  isUser ? 'bg-indigo-600' : 'bg-slate-950 border border-cyan-500/20'
                }`}>
                  {isUser ? <span className="font-bold text-xs uppercase font-sans">ME</span> : <Brain className="w-4 h-4 text-cyan-400" />}
                </div>

                <div className="space-y-2">
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-950 text-slate-100 border border-slate-850 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Bilingual details */}
                  {!isUser && msg.bilingual && (
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 space-y-3">
                      <div>
                        <span className="text-[9px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded uppercase font-mono tracking-wider font-bold mb-1.5 inline-block">
                          বাংলা বিবরণী
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                          {msg.bilingual.bn}
                        </p>
                      </div>
                      
                      {msg.bilingual.en && (
                        <div className="pt-2 border-t border-slate-800">
                          <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded uppercase font-mono tracking-wider font-bold mb-1.5 inline-block">
                            English Equivalent
                          </span>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {msg.bilingual.en}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step by step calculations or lists */}
                  {!isUser && msg.stepByStep && msg.stepByStep.length > 0 && (
                    <div className="p-4 rounded-xl bg-indigo-950/10 border border-indigo-900/20 space-y-2">
                      <span className="text-[9px] text-[#a5b4fc] tracking-widest font-mono uppercase block font-semibold">
                        Step-by-Step Solving (ধাপসমূহ)
                      </span>
                      <div className="space-y-1.5">
                        {msg.stepByStep.map((step, sIdx) => (
                          <div key={sIdx} className="text-xs text-slate-300 font-sans pl-1">
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* High Yield syllabus insights */}
                  {!isUser && msg.conceptDecomposition && (
                    <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 bg-slate-950/40 px-2.5 py-1 rounded w-fit border border-slate-850">
                      <Award className="w-3.5 h-3.5 text-yellow-500" /> Syllabus Weight Check: {msg.conceptDecomposition}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-[80%] items-center animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl rounded-tl-none text-xs font-mono text-slate-500 border border-slate-850">
                9Th Grade AI Tutor is thinking deeply bilingually...
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Input prompt entry */}
        <form onSubmit={handleSendMessage} className="mt-4 flex gap-2 pt-3 border-t border-slate-900">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type any competitive topic or specific question in Bangla/English..."
            className="flex-1 bg-slate-950 text-slate-200 text-xs sm:text-sm border border-slate-800 px-4 py-3 rounded-xl focus:border-cyan-400 outline-none"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4 text-slate-950" />
          </button>
        </form>

      </div>

    </div>
  );
}
