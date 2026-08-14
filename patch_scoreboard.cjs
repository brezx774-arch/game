const fs = require('fs');

const code = `import React from 'react';
import { PlayerState, GamePhase } from '../types';
import { Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScoreboardProps {
  youState: PlayerState;
  aiState: PlayerState;
  isPowerplay: boolean;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  youState,
  aiState,
  isPowerplay,
}) => {
  return (
    <div id="card-scoreboard" className="w-full max-w-2xl mx-auto px-1 mt-1 z-50 pointer-events-none">
      
      {/* Powerplay Banner */}
      <AnimatePresence>
         {isPowerplay && (
           <motion.div
             initial={{ y: -20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             exit={{ y: -20, opacity: 0 }}
             className="flex justify-center -mb-2"
           >
             <div className="bg-[#facc15] text-black text-[10px] sm:text-xs font-black tracking-widest px-6 pb-2 pt-1 rounded-t-lg shadow-lg flex items-center gap-2 border-x-2 border-t-2 border-[#ca8a04]">
                <Zap className="w-3 h-3 fill-black" />
                <span>POWERPLAY 2X ZONE</span>
                <Zap className="w-3 h-3 fill-black" />
             </div>
           </motion.div>
         )}
      </AnimatePresence>

      {/* Main Split Scoreboard */}
      <div className="flex bg-[#0f172a] rounded-sm shadow-2xl overflow-hidden border border-[#334155] relative z-10 pointer-events-auto">
        
        {/* Player 1 (YOU) */}
        <div className="flex-1 flex flex-col border-r-2 border-[#1e293b] bg-gradient-to-br from-[#0ea5e9]/20 to-[#0f172a]">
           <div className="bg-[#0ea5e9] px-2 py-0.5 text-[10px] font-black text-white tracking-widest uppercase flex justify-between items-center">
             <span>{youState.name}</span>
             <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_5px_#34d399] animate-pulse" />
           </div>
           <div className="p-2 flex justify-between items-center">
             <div className="flex items-baseline gap-1">
               <motion.span 
                 key={\`runs-\${youState.runs}\`}
                 initial={{ scale: 1.5, color: '#facc15' }}
                 animate={{ scale: 1, color: '#ffffff' }}
                 className="text-3xl font-black text-white tracking-tighter"
               >
                 {youState.runs}
               </motion.span>
               <span className="text-lg font-bold text-[#94a3b8]">-</span>
               <motion.span 
                 key={\`w-\${youState.wickets}\`}
                 initial={{ scale: 1.5, color: '#ef4444' }}
                 animate={{ scale: 1, color: '#ffffff' }}
                 className="text-2xl font-black text-white tracking-tighter"
               >
                 {youState.wickets}
               </motion.span>
             </div>
             <div className="flex flex-col items-end">
               <span className="text-lg font-black text-white">{Math.floor(youState.ballsBowled / 6)}.{youState.ballsBowled % 6}</span>
               <span className="text-[8px] font-bold text-[#64748b] tracking-widest uppercase mt-[-2px]">Overs</span>
             </div>
           </div>
        </div>

        {/* Player 2 (AI/Opponent) */}
        <div className="flex-1 flex flex-col bg-gradient-to-bl from-[#ef4444]/20 to-[#0f172a]">
           <div className="bg-[#ef4444] px-2 py-0.5 text-[10px] font-black text-white tracking-widest uppercase flex justify-between items-center flex-row-reverse">
             <span>{aiState.name}</span>
             <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_5px_#34d399] animate-pulse" />
           </div>
           <div className="p-2 flex justify-between items-center flex-row-reverse">
             <div className="flex items-baseline gap-1 flex-row-reverse">
               <motion.span 
                 key={\`runs-\${aiState.runs}\`}
                 initial={{ scale: 1.5, color: '#facc15' }}
                 animate={{ scale: 1, color: '#ffffff' }}
                 className="text-3xl font-black text-white tracking-tighter"
               >
                 {aiState.runs}
               </motion.span>
               <span className="text-lg font-bold text-[#94a3b8]">-</span>
               <motion.span 
                 key={\`w-\${aiState.wickets}\`}
                 initial={{ scale: 1.5, color: '#ef4444' }}
                 animate={{ scale: 1, color: '#ffffff' }}
                 className="text-2xl font-black text-white tracking-tighter"
               >
                 {aiState.wickets}
               </motion.span>
             </div>
             <div className="flex flex-col items-start">
               <span className="text-lg font-black text-white">{Math.floor(aiState.ballsBowled / 6)}.{aiState.ballsBowled % 6}</span>
               <span className="text-[8px] font-bold text-[#64748b] tracking-widest uppercase mt-[-2px]">Overs</span>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/components/Scoreboard.tsx', code);
