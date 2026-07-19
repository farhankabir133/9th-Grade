import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Sparkles, X, AlertCircle, Chrome } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { signUpEmail, signInEmail, signInGoogle, signInAsGuest } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAuthError = (err: any) => {
    console.error(err);
    const code = err?.code || '';
    const message = err?.message || '';

    if (code === 'auth/email-already-in-use' || message.includes('auth/email-already-in-use')) {
      setError('এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হচ্ছে। অনুগ্রহ করে লগইন করার চেষ্টা করুন (This email is already in use. Please try logging in instead)');
    } else if (code === 'auth/operation-not-allowed' || message.includes('auth/operation-not-allowed')) {
      setError('ফায়ারবেস অথেনটিকেশন প্যানেলে ইমেইল/পাসওয়ার্ড বা গুগল প্রোভাইডার সচল করা নেই। অনুগ্রহ করে আপনার ফায়ারবেস কনসোল থেকে এটি সচল করুন (Email/Password or Google Sign-in is disabled in your Firebase console. Please enable it in your project Settings)');
    } else if (code === 'auth/weak-password' || message.includes('auth/weak-password')) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে (Password must be at least 6 characters)');
    } else if (code === 'auth/invalid-email' || message.includes('auth/invalid-email')) {
      setError('দয়া করে সঠিক ইমেইল প্রদান করুন (Please provide a valid email)');
    } else if (
      code === 'auth/user-not-found' || 
      code === 'auth/wrong-password' || 
      code === 'auth/invalid-credential' ||
      message.includes('auth/user-not-found') ||
      message.includes('auth/wrong-password') ||
      message.includes('auth/invalid-credential')
    ) {
      setError('ভুল ইমেইল অথবা পাসওয়ার্ড প্রদান করেছেন (Incorrect email or password)');
    } else {
      setError(err?.message || 'একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন (An error occurred. Please try again)');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInGoogle();
      setLoading(false);
      onSuccess();
    } catch (err: any) {
      setLoading(false);
      handleAuthError(err);
    }
  };

  const handleGuestSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInAsGuest(name || email.split('@')[0] || 'Farhan Kabir (Guest)');
      setLoading(false);
      onSuccess();
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Guest/Sandbox login failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('সবগুলো ফিল্ড পূরণ করুন (Please fill out all fields)');
      return;
    }
    if (activeTab === 'register' && !name) {
      setError('আপনার নাম প্রদান করুন (Please enter your name)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (activeTab === 'login') {
        await signInEmail(email, password);
      } else {
        await signUpEmail(email, password, name);
      }
      setLoading(false);
      onSuccess();
    } catch (err: any) {
      setLoading(false);
      handleAuthError(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden font-sans"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-2.5 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-xl shadow-lg shadow-cyan-500/10 mx-auto">
            <Sparkles className="w-6 h-6 text-slate-950" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            {activeTab === 'login' ? 'স্বাগতম (Welcome Back)' : 'নতুন অ্যাকাউন্ট (Create Account)'}
          </h2>
          <p className="text-xs text-slate-400">
            {activeTab === 'login' 
              ? 'বাংলাদেশী প্রতিযোগিতামূলক পরীক্ষার সেরা AI প্ল্যাটফর্ম'
              : '৪.৫ লাখ+ শিক্ষার্থীর সাথে আপনার ক্যারিয়ার যাত্রা শুরু করুন'}
          </p>
        </div>

        {/* Error Alert details */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-slate-850 gap-1 mb-6">
          <button
            onClick={() => { setActiveTab('login'); setError(null); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'login' 
                ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-600/15 text-cyan-400 border border-cyan-500/10' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            লগইন (Sign In)
          </button>
          <button
            onClick={() => { setActiveTab('register'); setError(null); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'register' 
                ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-600/15 text-cyan-400 border border-cyan-500/10' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            অ্যাকাউন্ট তৈরি (Register)
          </button>
        </div>

        {/* Normal Inputs Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {activeTab === 'register' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-1.5"
              >
                <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">পূর্ণ নাম (Full Name)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="আপনার নাম লিখুন..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 pl-10 pr-4 text-xs font-sans text-slate-200 focus:border-cyan-400 outline-none transition-colors"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">ইমেইল এড্রেস (Email Address)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 pl-10 pr-4 text-xs font-sans text-slate-200 focus:border-cyan-400 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">পাসওয়ার্ড (Password)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 pl-10 pr-4 text-xs font-mono text-slate-200 focus:border-cyan-400 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold rounded-xl text-xs uppercase hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
            ) : activeTab === 'login' ? (
              'লগইন করুন (Login)'
            ) : (
              'অ্যাকাউন্ট তৈরি করুন (Sign Up)'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-[10px] font-mono uppercase bg-slate-900 px-3 text-slate-500">
            অথবা (Or Continue With)
          </div>
        </div>

        {/* Alternative Google Provider Auth */}
        <div className="grid grid-cols-1 gap-2.5">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 hover:border-cyan-500/20 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Chrome className="w-4 h-4 text-cyan-400" />
            <span>Google দিয়ে সাইন-ইন (Sign In with Google)</span>
          </button>

          <button
            onClick={handleGuestSignIn}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/15 hover:to-teal-500/15 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/5"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>অতিথি হিসেবে প্রবেশ (Continue as Guest / Local Sandbox)</span>
          </button>
        </div>

        {/* Guide notification details */}
        <div className="mt-5 text-[10px] text-slate-500 leading-normal text-center bg-slate-950/40 p-2.5 rounded-lg border border-slate-850/30">
          📨 <strong>গুরুত্বপূর্ণ নির্দেশাবলী:</strong> ইমেইল এবং পাসওয়ার্ড দিয়ে অ্যাকাউন্ট তৈরি করতে সরাসরি নিবন্ধন সম্পন্ন করুন। গুগল সাইন-ইন দিয়ে তাৎক্ষণিক শুরু করতে পারেন।
        </div>
      </motion.div>
    </div>
  );
}
