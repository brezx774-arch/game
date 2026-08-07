import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CommentaryBannerProps {
  message: string;
  subMessage?: string;
  isPowerplay?: boolean;
  isWicket?: boolean;
}

export const CommentaryBanner: React.FC<CommentaryBannerProps> = ({
  message,
  subMessage,
  isWicket,
}) => {
  const [key, setKey] = useState(0);

  // Re-trigger animation when message changes
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [message, subMessage]);

  return (
    <div id="banner-commentary" className="w-full max-w-xl mx-auto px-1 my-1">
      <div className={`relative h-8 flex items-center overflow-hidden rounded-sm border-l-4 shadow-lg ${
        isWicket
          ? 'bg-[#450a0a] border-[#ef4444]'
          : 'bg-[#0f172a] border-[#3b82f6]'
      }`}>
        
        {/* Ticker Label */}
        <div className={`z-10 h-full flex items-center justify-center px-3 font-black text-[10px] tracking-widest text-white shrink-0 shadow-[4px_0_10px_rgba(0,0,0,0.5)] ${
           isWicket ? 'bg-[#ef4444]' : 'bg-[#3b82f6]'
        }`}>
           LIVE
        </div>

        {/* Scrolling Text Container */}
        <div className="flex-1 overflow-hidden relative h-full flex items-center bg-[#1e293b]">
           <AnimatePresence mode="popLayout">
             <motion.div
               key={key}
               initial={{ x: '100%' }}
               animate={{ x: '-100%' }}
               transition={{ duration: 12, ease: "linear" }}
               className="absolute whitespace-nowrap flex items-center gap-4 text-xs font-bold text-white tracking-wide"
             >
                <span>{message}</span>
                {subMessage && (
                  <>
                    <span className="text-[#94a3b8]">|</span>
                    <span className="text-[#facc15]">{subMessage}</span>
                  </>
                )}
             </motion.div>
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
