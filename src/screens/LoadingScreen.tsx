import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedBackground } from '../components/AnimatedBackground';

interface LoadingScreenProps {
  authLoading: boolean;
  profileLoading: boolean;
  onReady: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ authLoading, profileLoading, onReady }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Engine...');
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    // Artificial progress stages
    const p1 = setTimeout(() => { setProgress(25); setStatusText('Connecting to Servers...'); }, 500);
    const p2 = setTimeout(() => { setProgress(55); setStatusText('Checking for Updates...'); }, 1200);
    const p3 = setTimeout(() => { setProgress(85); setStatusText('Verifying Game Files...'); }, 2000);

    return () => { clearTimeout(p1); clearTimeout(p2); clearTimeout(p3); };
  }, []);

  useEffect(() => {
    // When the real data is loaded, AND we've hit at least the "checking for updates" artificial mark (say, 2.5s)
    // We complete the bar.
    if (!authLoading && !profileLoading) {
      const finishTimer = setTimeout(() => {
        setProgress(100);
        setStatusText('Everything is up to date!');
        setIsFinishing(true);
        setTimeout(() => {
          onReady();
        }, 800); // give it time to show 100% and text
      }, 2500); // Artificial minimum boot time to show the update check
      
      return () => clearTimeout(finishTimer);
    }
  }, [authLoading, profileLoading, onReady]);

  return (
    <div className="fixed inset-0 bg-stone-950 flex flex-col items-center justify-center z-[200] overflow-hidden text-stone-100">
      <AnimatedBackground variant="STADIUM" inGame={false} />
      
      <div className="z-10 flex flex-col items-center w-full max-w-sm px-8">
        {/* Logo/Icon */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-24 h-24 mb-8 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-emerald-500 rounded-full blur-[40px] opacity-20 animate-pulse" />
          <img src="/icons/icon-512x512.png" alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10" onError={(e) => {
            // Fallback if no icon
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<div class="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl rotate-12 shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-300/30 flex items-center justify-center"><div class="w-12 h-12 bg-white rounded-full opacity-20"></div></div>');
          }} />
        </motion.div>

        {/* Status Text */}
        <motion.div
          key={statusText}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-8 mb-4 flex items-center justify-center"
        >
          <h2 className="text-sm font-bold tracking-[0.15em] text-emerald-400/90 uppercase text-center w-full">
            {statusText}
          </h2>
        </motion.div>

        {/* Progress Bar Container */}
        <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden border border-white/5 relative shadow-inner">
          <motion.div 
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-emerald-600 to-emerald-400"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut", duration: 0.5 }}
          />
          {/* Shine effect passing over the bar */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer pointer-events-none" />
        </div>
        
        {/* Percentage */}
        <div className="mt-3 text-xs font-mono text-stone-500 tracking-wider">
          {progress}%
        </div>
      </div>
    </div>
  );
};
