import React from 'react';
import { TacticMode } from '../types';
import { Shield, RotateCw } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { motion } from 'motion/react';

interface ActionControlsProps {
  selectedTactic: TacticMode;
  onSelectTactic: (tactic: TacticMode) => void;
  onRoll: () => void;
  isRolling: boolean;
  disabled?: boolean;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
  selectedTactic,
  onSelectTactic,
  onRoll,
  isRolling,
  disabled,
}) => {
  return (
    <div id="controls-play-bar" className="w-full max-w-xl mx-auto px-2 my-2 relative z-20 pb-4">
      <div className="flex gap-2 items-end justify-center">
        {/* Tactics Column */}
        <div className="flex-1 flex flex-col gap-2 max-w-[200px]">
          <div className="flex justify-between items-center px-1 mb-1">
             <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Select Tactic</span>
          </div>
          
          <div className="flex gap-2">
            {/* DEFEND */}
            <motion.button
              whileTap={{ scale: 0.9, y: 4 }}
              disabled={disabled || isRolling}
              onClick={() => {
                soundFx.playClick();
                onSelectTactic('DEFEND');
              }}
              className={`flex-1 relative flex flex-col items-center justify-center p-2 rounded-xl border-b-4 transition-all ${
                selectedTactic === 'DEFEND'
                  ? 'bg-[#3b82f6] border-[#1d4ed8] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                  : 'bg-[#1e293b] border-[#0f172a] text-[#94a3b8] hover:bg-[#334155]'
              } ${disabled || isRolling ? 'opacity-50 grayscale' : ''}`}
            >
              <Shield className={`w-5 h-5 mb-1 ${selectedTactic === 'DEFEND' ? 'fill-blue-800/20' : ''}`} />
              <span className="text-[10px] font-black tracking-wider uppercase">DEFEND</span>
            </motion.button>

            {/* ROTATE */}
            <motion.button
              whileTap={{ scale: 0.9, y: 4 }}
              disabled={disabled || isRolling}
              onClick={() => {
                soundFx.playClick();
                onSelectTactic('ROTATE');
              }}
              className={`flex-1 relative flex flex-col items-center justify-center p-2 rounded-xl border-b-4 transition-all ${
                selectedTactic === 'ROTATE'
                  ? 'bg-[#10b981] border-[#047857] text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                  : 'bg-[#1e293b] border-[#0f172a] text-[#94a3b8] hover:bg-[#334155]'
              } ${disabled || isRolling ? 'opacity-50 grayscale' : ''}`}
            >
              <RotateCw className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-black tracking-wider uppercase">ROTATE</span>
            </motion.button>
            
            {/* ATTACK */}
            <motion.button
              whileTap={{ scale: 0.9, y: 4 }}
              disabled={disabled || isRolling}
              onClick={() => {
                soundFx.playClick();
                onSelectTactic('ATTACK');
              }}
              className={`flex-1 relative flex flex-col items-center justify-center p-2 rounded-xl border-b-4 transition-all ${
                selectedTactic === 'ATTACK'
                  ? 'bg-[#f59e0b] border-[#b45309] text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                  : 'bg-[#1e293b] border-[#0f172a] text-[#94a3b8] hover:bg-[#334155]'
              } ${disabled || isRolling ? 'opacity-50 grayscale' : ''}`}
            >
              <svg className="w-5 h-5 mb-1 fill-current" viewBox="0 0 24 24">
                <path d="M19.7 3.3a1 1 0 0 0-1.4 0l-12 12a1 1 0 0 0 0 1.4l2 2a1 1 0 0 0 1.4 0l12-12a1 1 0 0 0 0-1.4l-2-2zM3 21l3-3-1.4-1.4L1.6 19.6a1 1 0 0 0 0 1.4l0 0a1 1 0 0 0 1.4 0z" />
              </svg>
              <span className="text-[10px] font-black tracking-wider uppercase">ATTACK</span>
            </motion.button>
          </div>
        </div>

        {/* Giant ROLL Button */}
        <div className="flex-1 max-w-[200px]">
          <motion.button
            whileTap={{ scale: 0.95, y: 8 }}
            disabled={disabled || isRolling}
            onClick={() => {
              if (!disabled && !isRolling) {
                onRoll();
              }
            }}
            className={`w-full relative h-[72px] flex items-center justify-center rounded-2xl border-b-[8px] transition-all overflow-hidden ${
              isRolling || disabled
                ? 'bg-[#475569] border-[#1e293b] text-[#94a3b8] cursor-not-allowed'
                : 'bg-[#ef4444] border-[#991b1b] text-white hover:brightness-110 shadow-[0_10px_20px_rgba(239,68,68,0.4)]'
            }`}
          >
            {/* Glossy shine */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-xl" />
            
            <div className="relative z-10 flex items-center justify-center gap-2">
              <span className="text-3xl font-black tracking-widest drop-shadow-md">
                {isRolling ? 'ROLLING' : 'ROLL!'}
              </span>
            </div>
            
            {/* Animated background rays when active */}
            {!disabled && !isRolling && (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-50%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cGF0aCBkPSJNNTAgMEw2MCA1MEw1MCAxMDBMNDAgNTB6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] bg-center bg-no-repeat bg-contain opacity-50 pointer-events-none" 
              />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};
