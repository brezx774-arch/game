import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  authLoading: boolean;
  profileLoading: boolean;
  onReady: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ authLoading, profileLoading, onReady }) => {
  const [statusText, setStatusText] = useState('GETTING READY FOR THE TOSS...');

  useEffect(() => {
    // Artificial progress stages just to make it feel alive, but UI stays simple
    const p1 = setTimeout(() => { setStatusText('CONNECTING TO SERVERS...'); }, 800);
    const p2 = setTimeout(() => { setStatusText('CHECKING FOR UPDATES...'); }, 1600);

    return () => { clearTimeout(p1); clearTimeout(p2); };
  }, []);

  useEffect(() => {
    // When the real data is loaded, finish
    if (!authLoading && !profileLoading) {
      const finishTimer = setTimeout(() => {
        setStatusText('READY!');
        setTimeout(() => {
          onReady();
        }, 500); 
      }, 2500); // Artificial minimum boot time
      
      return () => clearTimeout(finishTimer);
    }
  }, [authLoading, profileLoading, onReady]);

  return (
    <div className="fixed inset-0 bg-stone-950 flex flex-col items-center justify-end z-[200] overflow-hidden text-stone-100">
      {/* Background Image Container */}
      <img 
        src="/loading_bg.jpg"
        alt="Loading Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Dark gradient overlay for text readability at the bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
      
      {/* Loading Status UI */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex items-center justify-center gap-3 w-full px-8 pb-12"
      >
        <h2 className="text-sm sm:text-base font-bold tracking-widest text-white uppercase text-center drop-shadow-md">
          {statusText}
        </h2>
        <Loader2 className="w-5 h-5 text-white animate-spin drop-shadow-md" />
      </motion.div>
    </div>
  );
};
