import React from 'react';
import { X, Shield, RotateCw, HelpCircle, Zap } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80  overflow-y-auto">
      <div className="bg-stone-900 border border-stone-700 text-stone-100 rounded-3xl max-w-lg w-full p-5 shadow-2xl relative my-8">
        {/* Close button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl font-black text-amber-300 uppercase tracking-wide">
            How To Play Six Appeal
          </h2>
        </div>

        <div className="space-y-4 text-xs md:text-sm text-stone-300 max-h-[70vh] overflow-y-auto pr-2 no-scrollbar">
          {/* Objective */}
          <div className="p-3 bg-stone-800/80 rounded-2xl border border-stone-700">
            <h3 className="font-bold text-amber-300 text-sm mb-1 uppercase">Objective</h3>
            <p className="leading-relaxed">
              Roll the dice, navigate the circular stadium track, and score as many runs as possible in 5 overs! Target the highest score or chase down your opponent's total in the 2nd innings.
            </p>
          </div>

          {/* Shot Tactics */}
          <div className="p-3 bg-stone-800/80 rounded-2xl border border-stone-700">
            <h3 className="font-bold text-amber-300 text-sm mb-2 uppercase">Shot Tactics</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 bg-sky-950 border border-sky-500 rounded-lg text-sky-400 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-sky-300 font-bold block">DEFEND</strong>
                  <span className="text-stone-400 text-xs">Low rolls (1-2 steps). Highly safe against Wickets and Catches. Protects your wicket.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1.5 bg-emerald-950 border border-emerald-500 rounded-lg text-emerald-400 shrink-0">
                  <RotateCw className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-emerald-300 font-bold block">ROTATE</strong>
                  <span className="text-stone-400 text-xs">Balanced rolls (1-4 steps). Moderate risk and steady run-scoring.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1.5 bg-amber-950 border border-amber-500 rounded-lg text-amber-400 shrink-0">
                  <svg className="w-4 h-4 fill-amber-400" viewBox="0 0 24 24">
                    <path d="M19.7 3.3a1 1 0 0 0-1.4 0l-12 12a1 1 0 0 0 0 1.4l2 2a1 1 0 0 0 1.4 0l12-12a1 1 0 0 0 0-1.4l-2-2zM3 21l3-3-1.4-1.4L1.6 19.6a1 1 0 0 0 0 1.4l0 0a1 1 0 0 0 1.4 0z" />
                  </svg>
                </div>
                <div>
                  <strong className="text-amber-300 font-bold block">ATTACK</strong>
                  <span className="text-stone-400 text-xs">High rolls (3-6 steps). High boundary chance, but higher risk of Wicket or Catch.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Board Tiles Explanation */}
          <div className="p-3 bg-stone-800/80 rounded-2xl border border-stone-700">
            <h3 className="font-bold text-amber-300 text-sm mb-2 uppercase">Special Track Tiles</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-emerald-950/80 border border-emerald-500/80 rounded-xl">
                <strong className="text-emerald-300 block">FH (Free Hit)</strong>
                <span className="text-stone-400 text-[11px]">Next roll cannot be dismissed by a Wicket!</span>
              </div>

              <div className="p-2 bg-purple-950/80 border border-purple-500/80 rounded-xl">
                <strong className="text-purple-300 block">PR (Power Roll)</strong>
                <span className="text-stone-400 text-[11px]">Bonus roll with doubled distance!</span>
              </div>

              <div className="p-2 bg-sky-950/80 border border-sky-500/80 rounded-xl">
                <strong className="text-sky-300 block">PS (Power Shot)</strong>
                <span className="text-stone-400 text-[11px]">Smashed! Awards +6 immediate bonus runs.</span>
              </div>

              <div className="p-2 bg-cyan-950/80 border border-cyan-500/80 rounded-xl">
                <strong className="text-cyan-300 block">WD (Wide)</strong>
                <span className="text-stone-400 text-[11px]">Extra run + extra ball awarded.</span>
              </div>

              <div className="p-2 bg-amber-950/80 border border-amber-500/80 rounded-xl">
                <strong className="text-amber-300 block">C (Catch Chance)</strong>
                <span className="text-stone-400 text-[11px]">50% chance of catch out or dropped for 2 runs!</span>
              </div>

              <div className="p-2 bg-rose-950/80 border border-rose-500/80 rounded-xl">
                <strong className="text-rose-300 block">W (Wicket)</strong>
                <span className="text-stone-400 text-[11px]">Out! Lose a wicket unless Free Hit is active.</span>
              </div>
            </div>
          </div>

          {/* Powerplay */}
          <div className="p-3 bg-amber-950/40 rounded-2xl border border-amber-500/60 flex items-center gap-3">
            <Zap className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <strong className="text-amber-300 font-bold block uppercase text-xs">Powerplay 2X Rule</strong>
              <span className="text-stone-300 text-xs">Overs 1 and 2 are Powerplay overs! All run outcomes (1, 2, 3, 4, 6) are DOUBLED!</span>
            </div>
          </div>
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black text-sm uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-98 transition-all cursor-pointer"
          >
            LET'S PLAY!
          </button>
        </div>
      </div>
    </div>
  );
};
