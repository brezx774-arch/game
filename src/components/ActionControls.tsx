import React from "react";
import { TacticMode } from "../types";
import { Shield, RotateCw } from "lucide-react";
import { soundFx } from "../utils/audio";
import { motion } from "motion/react";

interface ActionControlsProps {
  isBatting: boolean;
  selectedTactic: TacticMode;
  onSelectTactic: (tactic: TacticMode) => void;
  onRoll: () => void;
  isRolling: boolean;
  disabled?: boolean;
  onSendEmoji?: (emoji: string) => void;
  showEmoji?: boolean;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
  selectedTactic,
  onSelectTactic,
  onRoll,
  isRolling,
  disabled,
  onSendEmoji,
  showEmoji,
  isBatting,
}) => {
  const [isEmojiMenuOpen, setIsEmojiMenuOpen] = React.useState(false);
  const EMOJIS = ['😂', '😎', '😡', '😭', '🔥', '👎'];

  return (
    <div
      id="controls-play-bar"
      className="w-full max-w-xl mx-auto px-2 my-2 relative z-20 pb-4"
    >
      <div className="flex gap-2 items-end justify-center">
        
        {/* Emoji Button (only if showEmoji true) */}
        {showEmoji && onSendEmoji && (
          <div className="relative flex flex-col justify-end pb-1">
             <motion.button 
               whileTap={{ scale: 0.9 }}
               onClick={() => setIsEmojiMenuOpen(!isEmojiMenuOpen)}
               className="w-12 h-12 bg-stone-800 rounded-full border-2 border-stone-600 flex items-center justify-center text-xl shadow-lg"
             >
               😎
             </motion.button>
             
             {isEmojiMenuOpen && (
               <div className="absolute bottom-[60px] left-[-20px] bg-stone-900 border-2 border-stone-700 p-2 rounded-2xl flex flex-col gap-2 shadow-2xl z-[100]">
                 {EMOJIS.map(e => (
                   <button 
                     key={e} 
                     onClick={() => {
                        onSendEmoji(e);
                        setIsEmojiMenuOpen(false);
                     }}
                     className="text-2xl hover:scale-125 transition-transform"
                   >
                     {e}
                   </button>
                 ))}
               </div>
             )}
          </div>
        )}

        {/* Tactics Column */}
        <div className="flex-1 flex flex-col gap-2 max-w-[200px]">
          <div className="flex justify-between items-center px-1 mb-1">
            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">
              Select Tactic
            </span>
          </div>

          
          <div className="flex gap-2">
            {isBatting ? (
              <>
            {/* DEFEND */}
            <motion.button
              whileTap={{ scale: 0.9, y: 4 }}
              disabled={disabled || isRolling}
              onClick={() => {
                soundFx.playClick();
                onSelectTactic("DEFEND");
              }}
              className={`flex-1 relative flex flex-col items-center justify-center p-2 rounded-xl border-b-4 transition-all overflow-hidden ${
                selectedTactic === "DEFEND"
                  ? "bg-gradient-to-b from-[#3b82f6] to-[#2563eb] border-[#1e40af] text-white shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                  : "bg-[#1e293b] border-[#0f172a] text-[#94a3b8] hover:bg-[#334155]"
              } ${disabled || isRolling ? "opacity-50 grayscale" : ""}`}
            >
              <Shield className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-black uppercase">DEFEND</span>
            </motion.button>
            {/* ROTATE */}
            <motion.button
              whileTap={{ scale: 0.9, y: 4 }}
              disabled={disabled || isRolling}
              onClick={() => {
                soundFx.playClick();
                onSelectTactic("ROTATE");
              }}
              className={`flex-1 relative flex flex-col items-center justify-center p-2 rounded-xl border-b-4 transition-all overflow-hidden ${
                selectedTactic === "ROTATE"
                  ? "bg-gradient-to-b from-[#10b981] to-[#059669] border-[#064e3b] text-white shadow-[0_0_20px_rgba(16,185,129,0.6)]"
                  : "bg-[#1e293b] border-[#0f172a] text-[#94a3b8] hover:bg-[#334155]"
              } ${disabled || isRolling ? "opacity-50 grayscale" : ""}`}
            >
              <RotateCw className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-black uppercase">ROTATE</span>
            </motion.button>
            {/* ATTACK */}
            <motion.button
              whileTap={{ scale: 0.9, y: 4 }}
              disabled={disabled || isRolling}
              onClick={() => {
                soundFx.playClick();
                onSelectTactic("ATTACK");
              }}
              className={`flex-1 relative flex flex-col items-center justify-center p-2 rounded-xl border-b-4 transition-all overflow-hidden ${
                selectedTactic === "ATTACK"
                  ? "bg-gradient-to-b from-[#f59e0b] to-[#d97706] border-[#92400e] text-white shadow-[0_0_20px_rgba(245,158,11,0.6)]"
                  : "bg-[#1e293b] border-[#0f172a] text-[#94a3b8] hover:bg-[#334155]"
              } ${disabled || isRolling ? "opacity-50 grayscale" : ""}`}
            >
              <svg className="w-5 h-5 mb-1 fill-current" viewBox="0 0 24 24"><path d="M19.7 3.3a1 1 0 0 0-1.4 0l-12 12a1 1 0 0 0 0 1.4l2 2a1 1 0 0 0 1.4 0l12-12a1 1 0 0 0 0-1.4l-2-2zM3 21l3-3-1.4-1.4L1.6 19.6a1 1 0 0 0 0 1.4l0 0a1 1 0 0 0 1.4 0z" /></svg>
              <span className="text-[10px] font-black uppercase">ATTACK</span>
            </motion.button>
            </>
            ) : (
            <>
            {/* FAST */}
            <motion.button
              whileTap={{ scale: 0.9, y: 4 }}
              disabled={disabled || isRolling}
              onClick={() => {
                soundFx.playClick();
                onSelectTactic("FAST");
              }}
              className={`flex-1 relative flex flex-col items-center justify-center p-2 rounded-xl border-b-4 transition-all overflow-hidden ${
                selectedTactic === "FAST"
                  ? "bg-gradient-to-b from-[#ef4444] to-[#b91c1c] border-[#7f1d1d] text-white shadow-[0_0_20px_rgba(239,68,68,0.6)]"
                  : "bg-[#1e293b] border-[#0f172a] text-[#94a3b8] hover:bg-[#334155]"
              } ${disabled || isRolling ? "opacity-50 grayscale" : ""}`}
            >
              <span className="text-sm mb-1">🔥</span>
              <span className="text-[10px] font-black uppercase">FAST</span>
            </motion.button>
            {/* SPIN */}
            <motion.button
              whileTap={{ scale: 0.9, y: 4 }}
              disabled={disabled || isRolling}
              onClick={() => {
                soundFx.playClick();
                onSelectTactic("SPIN");
              }}
              className={`flex-1 relative flex flex-col items-center justify-center p-2 rounded-xl border-b-4 transition-all overflow-hidden ${
                selectedTactic === "SPIN"
                  ? "bg-gradient-to-b from-[#8b5cf6] to-[#6d28d9] border-[#4c1d95] text-white shadow-[0_0_20px_rgba(139,92,246,0.6)]"
                  : "bg-[#1e293b] border-[#0f172a] text-[#94a3b8] hover:bg-[#334155]"
              } ${disabled || isRolling ? "opacity-50 grayscale" : ""}`}
            >
              <span className="text-sm mb-1">🌪️</span>
              <span className="text-[10px] font-black uppercase">SPIN</span>
            </motion.button>
            {/* YORKER */}
            <motion.button
              whileTap={{ scale: 0.9, y: 4 }}
              disabled={disabled || isRolling}
              onClick={() => {
                soundFx.playClick();
                onSelectTactic("YORKER");
              }}
              className={`flex-1 relative flex flex-col items-center justify-center p-2 rounded-xl border-b-4 transition-all overflow-hidden ${
                selectedTactic === "YORKER"
                  ? "bg-gradient-to-b from-[#14b8a6] to-[#0f766e] border-[#134e4a] text-white shadow-[0_0_20px_rgba(20,184,166,0.6)]"
                  : "bg-[#1e293b] border-[#0f172a] text-[#94a3b8] hover:bg-[#334155]"
              } ${disabled || isRolling ? "opacity-50 grayscale" : ""}`}
            >
              <span className="text-sm mb-1">🎯</span>
              <span className="text-[10px] font-black uppercase">YORKER</span>
            </motion.button>
            </>
            )}
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
                ? "bg-[#475569] border-[#1e293b] text-[#94a3b8] cursor-not-allowed"
                : "bg-[#ef4444] border-[#991b1b] text-white hover:brightness-110 shadow-[0_10px_20px_rgba(239,68,68,0.4)]"
            }`}
          >
            {/* Glossy shine */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-xl" />

            <div className="relative z-10 flex items-center justify-center gap-2 h-full w-full">
              <div className="relative">
                 <span className="absolute left-0 top-0 text-3xl font-black tracking-widest text-black/40 blur-sm translate-y-1">
                    {isRolling ? "WAITING" : (isBatting ? "BAT!" : "BOWL!")}
                 </span>
                 <span className="absolute left-0 top-0 text-3xl font-black tracking-widest text-red-950" style={{ WebkitTextStroke: '6px #450a0a' }}>
                    {isRolling ? "WAITING" : (isBatting ? "BAT!" : "BOWL!")}
                 </span>
                 <span className="relative text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-red-100 to-red-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    {isRolling ? "WAITING" : (isBatting ? "BAT!" : "BOWL!")}
                 </span>
              </div>
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
