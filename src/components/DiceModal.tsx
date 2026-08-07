import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BoardTile } from '../types';

interface DiceModalProps {
  isOpen: boolean;
  diceValue: number;
  landedTile: BoardTile | null;
  tactic: string;
}

export const DiceModal: React.FC<DiceModalProps> = ({
  isOpen,
  diceValue,
  landedTile,
  tactic,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          {/* Dark Overlay with blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0, opacity: 0, y: 100 }}
            animate={{ 
               scale: [0, 1.2, 0.9, 1], 
               opacity: 1, 
               y: 0,
               rotate: [0, -10, 10, -5, 0] // Screen shake effect
            }}
            exit={{ scale: 0, opacity: 0, y: -50 }}
            transition={{ 
               duration: 0.6, 
               ease: "easeOut",
               rotate: { delay: 0.5, duration: 0.3 }
            }}
            className="relative z-10 w-full max-w-sm flex flex-col items-center gap-4"
          >
            {/* Action text */}
            <motion.div
               initial={{ y: -20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="text-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
            >
               <span className="block text-4xl font-black text-white italic tracking-tighter" style={{ WebkitTextStroke: '2px #000' }}>
                 {tactic.toUpperCase()}!
               </span>
            </motion.div>

            {/* Glowing Aura behind Dice */}
            <motion.div 
              animate={{ 
                scale: [1, 1.5, 1], 
                opacity: [0.5, 0.8, 0.5],
                rotate: 360
              }} 
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#facc15] rounded-full blur-[60px] opacity-40 mix-blend-screen -z-10"
            />

            {/* The Dice */}
            <motion.div
              animate={{
                rotateX: [0, 720, 1080],
                rotateY: [0, 720, 1080],
                rotateZ: [0, 360, 0],
                scale: [0.5, 1.5, 1],
                y: [50, -100, 0] // Bounce arc
              }}
              transition={{ duration: 0.8, times: [0, 0.5, 1], ease: "easeInOut" }}
              className="relative w-28 h-28 flex items-center justify-center transform-gpu preserve-3d"
            >
              {/* Actual Dice Block */}
              <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f1f5f9] to-[#cbd5e1] border-4 border-[#94a3b8] rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_-10px_20px_rgba(0,0,0,0.2),inset_0_4px_10px_rgba(255,255,255,1)] flex items-center justify-center">
                 <span className="text-7xl font-black text-[#0f172a] drop-shadow-md">
                   {diceValue}
                 </span>
              </div>
              
              {/* Confetti Particles */}
              {[...Array(6)].map((_, i) => (
                 <motion.div
                   key={`confetti-${i}`}
                   initial={{ scale: 0, x: 0, y: 0 }}
                   animate={{ 
                     scale: [0, 1.5, 0], 
                     x: (Math.random() - 0.5) * 200, 
                     y: (Math.random() - 0.5) * 200,
                     rotate: Math.random() * 360
                   }}
                   transition={{ duration: 0.6, delay: 0.6 + (Math.random() * 0.2) }}
                   className={`absolute w-3 h-3 rounded-sm z-20 ${
                     ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500'][Math.floor(Math.random() * 4)]
                   }`}
                 />
              ))}
            </motion.div>

            {/* Result Tile Banner */}
            {landedTile && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.1, 1], opacity: 1 }}
                transition={{ delay: 0.8, times: [0, 0.6, 1], ease: "easeOut" }}
                style={{
                  backgroundColor: landedTile.bgHex,
                  borderColor: landedTile.borderHex,
                  color: landedTile.textHex,
                }}
                className="mt-4 px-6 py-3 rounded-2xl border-4 font-black text-2xl shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex items-center gap-3 transform -rotate-2"
              >
                <span className="text-sm opacity-80 uppercase tracking-widest">Landed on</span>
                <span className="text-3xl drop-shadow-sm">{landedTile.sublabel || landedTile.label}</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
