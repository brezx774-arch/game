import React, { useState, useEffect } from 'react';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../lib/firebase';
import { Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { Capacitor } from '@capacitor/core';

export const LoginScreen: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Check for the result of a redirect login (essential for Android APK)
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("Successfully logged in via redirect");
        }
      } catch (err: any) {
        console.error("Redirect error:", err);
        setError(err.message || 'Failed during redirect login. Check Authorized Domains.');
      } finally {
        setLoading(false);
      }
    };
    
    checkRedirectResult();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      if (Capacitor.isNativePlatform()) {
        // Native APKs block popups. We MUST use redirect.
        await signInWithRedirect(auth, googleProvider);
      } else {
        // Web browsers prefer popups
        await signInWithPopup(auth, googleProvider);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setLoading(true);
      setError('');
      if (Capacitor.isNativePlatform()) {
        await signInWithRedirect(auth, facebookProvider);
      } else {
        await signInWithPopup(auth, facebookProvider);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Facebook');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-950 flex flex-col items-center justify-center p-6 text-stone-100 z-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm bg-stone-900/80 backdrop-blur-xl border border-stone-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/50 mb-6">
          <Trophy className="w-8 h-8 text-stone-50" />
        </div>
        
        <h1 className="text-3xl font-black italic text-stone-50 mb-2 tracking-tight">CRICKET ROYALE</h1>
        <p className="text-stone-400 text-sm text-center mb-8 font-medium">
          Sign in to save your stats and play multiplayer matches.
        </p>

        {error && (
          <div className="w-full bg-red-900/50 border border-red-500/50 text-red-200 text-xs p-3 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <div className="w-full space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full relative flex items-center justify-center gap-3 bg-white text-stone-900 py-3.5 px-4 rounded-xl font-bold text-sm transition-transform active:scale-95 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <button
            onClick={handleFacebookLogin}
            disabled={loading}
            className="w-full relative flex items-center justify-center gap-3 bg-[#1877F2] text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-transform active:scale-95 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.938 5.858-5.938 1.273 0 2.427.152 2.927.208v3.667l-1.937.001c-1.55 0-2.327.91-2.327 2.434v1.208h3.94l-.392 3.667h-3.548v7.98h-4.52z"/>
            </svg>
            Continue with Facebook
          </button>
        </div>
      </motion.div>
    </div>
  );
};
