import React, { useEffect, useState } from 'react';
import { PlayerState } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { User, Bot } from 'lucide-react';

interface MatchPlayersBannerProps {
  playerLevel: number;
  opponentLevel: number;
  youState: PlayerState;
  aiState: PlayerState;
  emojiEvent: { player: 'YOU' | 'AI'; emoji: string; id: number } | null;
}

export const MatchPlayersBanner: React.FC<MatchPlayersBannerProps> = ({ youState, aiState, emojiEvent, playerLevel, opponentLevel }) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-2 mt-2 flex justify-between items-end relative z-30">
      {/* Player 1 Banner */}
      <div className="relative">
        <AnimatePresence>
          {emojiEvent?.player === 'YOU' && (
             <motion.div key={emojiEvent.id} initial={{ opacity: 0, scale: 0.5, y: -10 }} animate={{ opacity: 1, scale: 1.2, y: 10 }} exit={{ opacity: 0 }} className="absolute top-full left-4 text-4xl z-50 mt-2 pointer-events-none">
               {emojiEvent.emoji}
             </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center gap-2 bg-stone-900/80 border-2 border-stone-700 p-1.5 pr-4 rounded-full shadow-lg backdrop-blur-sm">
           <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center border-2 border-white shadow-inner">
             {youState.avatar === 'robot' ? <Bot className="text-white w-5 h-5" /> : <User className="text-white w-5 h-5" />}
           </div>
           <div className="flex flex-col">
             <span className="text-xs font-black text-white uppercase tracking-wider">{youState.name}</span>
             <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">Level {playerLevel}</span>
           </div>
        </div>
      </div>
      
      {/* VS Badge */}
      <div className="bg-amber-500 rounded-full w-8 h-8 flex items-center justify-center font-black text-xs text-black border-2 border-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10 mb-2 shrink-0 mx-2">
        VS
      </div>

      {/* Player 2 Banner */}
      <div className="relative">
        <AnimatePresence>
          {emojiEvent?.player === 'AI' && (
             <motion.div key={emojiEvent.id} initial={{ opacity: 0, scale: 0.5, y: -10 }} animate={{ opacity: 1, scale: 1.2, y: 10 }} exit={{ opacity: 0 }} className="absolute top-full right-4 text-4xl z-50 mt-2 pointer-events-none">
               {emojiEvent.emoji}
             </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center gap-2 bg-stone-900/80 border-2 border-stone-700 p-1.5 pl-4 rounded-full shadow-lg backdrop-blur-sm flex-row-reverse">
           <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center border-2 border-white shadow-inner">
             {aiState.avatar === 'robot' ? <Bot className="text-white w-5 h-5" /> : <User className="text-white w-5 h-5" />}
           </div>
           <div className="flex flex-col items-end">
             <span className="text-xs font-black text-white uppercase tracking-wider">{aiState.name}</span>
             <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">Level {opponentLevel}</span>
           </div>
        </div>
      </div>
    </div>
  );
};
