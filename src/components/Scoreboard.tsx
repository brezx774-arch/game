import React from 'react';
import { PlayerState, GamePhase } from '../types';
import { Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScoreboardProps {
  youState: PlayerState;
  aiState: PlayerState;
  currentStrike: 'YOU' | 'AI' | 'PLAYER_2';
  phase: GamePhase;
  maxOvers: number;
  isPowerplay: boolean;
  targetRuns?: number;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  youState,
  aiState,
  currentStrike,
  phase,
  maxOvers,
  isPowerplay,
  targetRuns,
}) => {
  // Calculate Run Rate
  const calcRR = (runs: number, totalLegalBalls: number) => {
    if (totalLegalBalls === 0) return '0.00';
    const oversFraction = totalLegalBalls / 6;
    return (runs / oversFraction).toFixed(2);
  };

  const activePlayer = currentStrike === 'YOU' ? youState : aiState;
  const currentRR = calcRR(activePlayer.runs, activePlayer.ballsBowled);

  // Remaining target info if 2nd Innings
  let targetText = '';
  if (phase === 'INNINGS_2' && targetRuns !== undefined) {
    const ballsRemaining = maxOvers * 6 - activePlayer.ballsBowled;
    const runsNeeded = Math.max(0, targetRuns - activePlayer.runs);
    targetText = `NEED ${runsNeeded} RUNS OFF ${ballsRemaining} BALLS`;
  }
  
  const ballsInOver = activePlayer.ballsBowled % 6;
  const oversCompleted = Math.floor(activePlayer.ballsBowled / 6);

  return (
    <div id="card-scoreboard" className="w-full max-w-2xl mx-auto px-1 mt-1 z-50 pointer-events-none">
      
      {/* Target Banner / Powerplay Banner (Slides down from behind main scoreboard) */}
      <AnimatePresence>
         {(targetText || isPowerplay) && (
           <motion.div 
             initial={{ y: -20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             exit={{ y: -20, opacity: 0 }}
             className="flex justify-center -mb-2"
           >
             <div className="bg-[#facc15] text-black text-[10px] sm:text-xs font-black tracking-widest px-6 pb-2 pt-1 rounded-t-lg shadow-lg flex items-center gap-2 border-x-2 border-t-2 border-[#ca8a04]">
                {targetText ? (
                  <span>{targetText}</span>
                ) : (
                  <>
                    <Zap className="w-3 h-3 fill-black" />
                    <span>POWERPLAY 2X ZONE</span>
                    <Zap className="w-3 h-3 fill-black" />
                  </>
                )}
             </div>
           </motion.div>
         )}
      </AnimatePresence>

      {/* Main TV Broadcast Graphic Container */}
      <div className="flex bg-[#0f172a] rounded-sm shadow-2xl overflow-hidden border border-[#334155] relative z-10 pointer-events-auto">
        
        {/* Left: Batting Team Logo/Color */}
        <div className={`w-12 sm:w-16 flex flex-col justify-center items-center ${currentStrike === 'YOU' ? 'bg-[#0ea5e9]' : 'bg-[#ef4444]'}`}>
           <span className="text-white font-black text-sm sm:text-lg drop-shadow-md tracking-tighter" style={{ textOrientation: 'upright', writingMode: 'vertical-rl' }}>
              {activePlayer.name.slice(0, 3)}
           </span>
        </div>

        {/* Center: Main Score Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Row: Score & Overs */}
          <div className="flex justify-between items-center px-3 sm:px-5 py-2 bg-gradient-to-r from-[#1e293b] to-[#0f172a]">
            {/* Score */}
            <div className="flex items-baseline gap-1 sm:gap-2">
              <motion.span 
                 key={`runs-${activePlayer.runs}`}
                 initial={{ scale: 1.5, color: '#facc15' }}
                 animate={{ scale: 1, color: '#ffffff' }}
                 className="text-3xl sm:text-4xl font-black text-white tracking-tighter"
              >
                {activePlayer.runs}
              </motion.span>
              <span className="text-xl sm:text-2xl font-bold text-[#94a3b8] mb-1">-</span>
              <motion.span 
                 key={`wickets-${activePlayer.wickets}`}
                 initial={{ scale: 1.5, color: '#ef4444' }}
                 animate={{ scale: 1, color: '#ffffff' }}
                 className="text-3xl sm:text-4xl font-black text-white tracking-tighter"
              >
                {activePlayer.wickets}
              </motion.span>
            </div>

            {/* Overs Info */}
            <div className="flex flex-col items-end">
               <div className="flex items-baseline gap-1">
                 <span className="text-xl sm:text-2xl font-black text-white">{oversCompleted}.{ballsInOver}</span>
                 <span className="text-[10px] sm:text-xs font-bold text-[#94a3b8] uppercase tracking-wider">Overs</span>
               </div>
               <div className="text-[9px] sm:text-[10px] font-bold text-[#64748b] tracking-widest mt-[-2px]">
                 TARGET {targetRuns ? targetRuns : '---'}
               </div>
            </div>
          </div>

          {/* Bottom Row: Batter info & Run Rate */}
          <div className="flex justify-between items-center px-3 sm:px-5 py-1 sm:py-1.5 bg-[#cbd5e1]">
             <div className="flex items-center gap-2">
               <span className="text-[10px] sm:text-xs font-black text-[#0f172a] uppercase tracking-wider">
                 {activePlayer.name} (BAT)
               </span>
               <div className="w-1.5 h-1.5 bg-[#ef4444] rounded-full animate-pulse" /> {/* Strike indicator */}
             </div>
             
             <div className="text-[10px] sm:text-xs font-black text-[#0f172a] tracking-widest flex items-center">
                <span className="hidden sm:inline">REQ {targetRuns && phase === 'INNINGS_2' ? calcRR(targetRuns - activePlayer.runs, maxOvers * 6 - activePlayer.ballsBowled) : '---'}</span>
                <span className="hidden sm:inline text-[#64748b] mx-1">|</span> 
                CRR {currentRR}
             </div>
          </div>
        </div>

        {/* Right: Tournament Logo or Series Info */}
        <div className="hidden sm:flex w-16 bg-[#1e293b] flex-col justify-center items-center border-l border-[#334155] p-2">
           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#facc15] to-[#f59e0b] shadow-[0_0_10px_rgba(250,204,21,0.5)] flex items-center justify-center border border-[#ca8a04]">
             <span className="text-[10px] font-black text-black">T20</span>
           </div>
        </div>
      </div>
    </div>
  );
};
