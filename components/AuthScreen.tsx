import React, { useState, useRef, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';
import Spinner from './Spinner';

const HalloweenAnimation = () => (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <i className="fa-solid fa-ghost text-gray-200/50 absolute text-5xl animate-ghost-drift-1" style={{ animationDelay: '0s' }}></i>
        <i className="fa-solid fa-ghost text-gray-200/40 absolute text-3xl animate-ghost-drift-2" style={{ animationDelay: '5s' }}></i>
        <i className="fa-solid fa-ghost text-gray-200/60 absolute text-4xl animate-ghost-drift-3" style={{ animationDelay: '10s' }}></i>
        <i className="fa-solid fa-ghost text-gray-200/30 absolute text-2xl animate-ghost-drift-2" style={{ animationDelay: '12s', animationDirection: 'reverse' }}></i>
    </div>
);

const AuthScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  const handleAuthAction = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    if (activeTab === 'signup') {
      const passwordConfirm = passwordConfirmRef.current?.value;
      if (password !== passwordConfirm) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }

      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setMessage("Check your email for the confirmation link!");
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
      }
    }
    setLoading(false);
  };
  
  const MagicFeelLogo = () => (
    <svg viewBox="0 0 100 60" className="w-24 h-auto mx-auto mb-2 text-yellow-500" fill="currentColor">
        <path d="M50,5 L5,30 L15,30 L15,55 L40,55 L40,40 L60,40 L60,55 L85,55 L85,30 L95,30 Z" stroke="#FBBF24" strokeWidth="2" fillOpacity="0.8"/>
        <path d="M65,55 L65,35 L80,35 L80,55 Z" stroke="#FBBF24" strokeWidth="2" fill="none"/>
        <path d="M45,20 L75,20 L60,10 Z" stroke="#FBBF24" strokeWidth="2" fill="none"/>
    </svg>
  );


  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gray-50 p-4 relative">
      <HalloweenAnimation />
      <div className="w-full max-w-sm mx-auto animate-fade-in-up z-10">
        <div className="text-center mb-6">
          <MagicFeelLogo />
          <h1 className="text-xl font-bold text-slate-800 tracking-wider uppercase">Magicfeel Studio LLP</h1>
          <p className="text-xs text-gray-500 tracking-widest uppercase mt-1">Live Beautiful</p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => { setActiveTab('signin'); setError(null); setMessage(null); }}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${activeTab === 'signin' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-500'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setError(null); setMessage(null); }}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${activeTab === 'signup' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-500'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuthAction} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                ref={emailRef}
                required
                className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                ref={passwordRef}
                required
                className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
              />
            </div>
            {activeTab === 'signup' && (
              <div>
                <label className="text-xs font-semibold text-gray-500" htmlFor="password-confirm">Confirm Password</label>
                <input
                  id="password-confirm"
                  type="password"
                  ref={passwordConfirmRef}
                  required
                  className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                />
              </div>
            )}
            
            {error && <p className="text-xs text-red-500 text-center">{error}</p>}
            {message && <p className="text-xs text-green-500 text-center">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-yellow-300 flex justify-center items-center"
            >
              {loading ? <Spinner /> : (activeTab === 'signin' ? 'Sign In' : 'Create Account')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;