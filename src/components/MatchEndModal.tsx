import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Award, Zap } from 'lucide-react';
import { PlayerState } from '../types';
import { soundFx } from '../utils/audio';

interface MatchEndModalProps {
  isOpen: boolean;
  youState: PlayerState;
  aiState: PlayerState;
  targetRuns?: number;
  onPlayAgain?: () => void;
  onExitToLobby?: () => void;
}

export const MatchEndModal: React.FC<MatchEndModalProps> = ({
  isOpen,
  youState,
  aiState,
  targetRuns = 0,
  onPlayAgain,
  onExitToLobby,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundFx.playCrowdCheer(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Determine Winner
  const userWon = youState.runs > aiState.runs;
  const isTie = youState.runs === aiState.runs;

  let resultTitle = '';
  if (isTie) {
    resultTitle = 'MATCH TIED! THRILLER!';
  } else if (userWon) {
    const diff = youState.runs - aiState.runs;
    resultTitle = `${youState.name.toUpperCase()} WON BY ${diff} RUNS!`;
  } else {
    const diff = aiState.runs - youState.runs;
    resultTitle = `${aiState.name.toUpperCase()} WON BY ${diff} RUNS!`;
  }

  // Calculate Match MVP
  const getMvpPoints = (player: PlayerState) => player.runs + (player.wickets * 20);
  const youMvpPoints = getMvpPoints(youState);
  const aiMvpPoints = getMvpPoints(aiState);
  const mvp = youMvpPoints >= aiMvpPoints ? youState : aiState;
  const isYouMvp = mvp.id === youState.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-stone-900 border-2 border-amber-500/80 rounded-3xl max-w-md w-full p-6 text-stone-100 shadow-[0_0_50px_rgba(245,158,11,0.5)] text-center relative overflow-hidden">
        {/* MVP Background Glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 blur-3xl opacity-20 pointer-events-none ${isYouMvp ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        
        {/* Trophy Header */}
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 border-2 border-amber-200 shadow-xl flex items-center justify-center mx-auto mb-3 text-stone-950 animate-bounce">
          <Trophy className="w-9 h-9 fill-stone-950" />
        </div>

        <h2 className="relative z-10 text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 uppercase tracking-wide">
          {resultTitle}
        </h2>

        <p className="relative z-10 text-xs text-stone-400 font-semibold mt-1 mb-3">
          Match Completed • T20 Board Showdown
        </p>

        {/* MVP Badge */}
        <div className="flex justify-center mb-5 relative z-10">
          <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 p-[2px] rounded-full shadow-lg">
            <div className="bg-stone-950 px-4 py-1.5 rounded-full flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-[11px] font-black tracking-widest uppercase text-amber-400">
                MVP: <span className="text-white">{mvp.name}</span>
              </span>
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
          </div>
        </div>

        {/* Rewards Banner */}
        <div className="bg-[#1e293b] border-2 border-[#334155] rounded-xl p-3 flex justify-center gap-6 mb-5 shadow-inner">
           <div className="flex flex-col items-center">
             <span className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Match Bonus</span>
             <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
               <span className="text-lg font-black text-[#facc15]">{userWon ? '+150' : '+50'}</span>
               <Trophy className="w-4 h-4 text-yellow-500 fill-yellow-500" />
             </div>
           </div>
           
           <div className="flex flex-col items-center">
             <span className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">XP Earned</span>
             <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
               <span className="text-lg font-black text-[#38bdf8]">{userWon ? '+200' : '+50'}</span>
               <Award className="w-4 h-4 text-sky-400 fill-sky-400" />
             </div>
           </div>
        </div>

        {/* Score Breakdown Cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* YOU Scorecard */}
          <div className={`p-3 rounded-2xl border ${
            userWon ? 'bg-emerald-950/80 border-emerald-500' : 'bg-stone-800/80 border-stone-700'
          }`}>
            <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase block mb-1">
              {youState.name}
            </span>
            <span className="text-2xl font-black text-white block">
              {youState.runs}/{youState.wickets}
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5">
              Overs: {youState.overs.toFixed(1)}
            </span>
            <div className="mt-2 text-[10px] text-stone-300 font-medium border-t border-stone-700/60 pt-1.5 flex justify-around">
              <span>4s: <strong>{youState.fourCount}</strong></span>
              <span>6s: <strong>{youState.sixCount}</strong></span>
            </div>
          </div>

          {/* OPPONENT Scorecard */}
          <div className={`p-3 rounded-2xl border ${
            !userWon && !isTie ? 'bg-rose-950/80 border-rose-500' : 'bg-stone-800/80 border-stone-700'
          }`}>
            <span className="text-[10px] font-bold text-rose-400 tracking-wider uppercase block mb-1">
              {aiState.name}
            </span>
            <span className="text-2xl font-black text-white block">
              {aiState.runs}/{aiState.wickets}
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5">
              Overs: {aiState.overs.toFixed(1)}
            </span>
            <div className="mt-2 text-[10px] text-stone-300 font-medium border-t border-stone-700/60 pt-1.5 flex justify-around">
              <span>4s: <strong>{aiState.fourCount}</strong></span>
              <span>6s: <strong>{aiState.sixCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Play Again Button */}
        <div className="flex flex-col gap-2">
          {onPlayAgain && (<button
            onClick={() => {
              soundFx.playClick();
              onPlayAgain();
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-black text-sm uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>PLAY AGAIN</span>
          </button>)}

          {onExitToLobby && (
            <button
              onClick={() => {
                soundFx.playClick();
                onExitToLobby();
              }}
              className="w-full py-3 rounded-2xl bg-stone-800 border-2 border-stone-700 text-stone-300 font-black text-xs uppercase tracking-wider hover:bg-stone-700 active:scale-98 transition-all flex items-center justify-center cursor-pointer"
            >
              <span>EXIT TO LOBBY</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
