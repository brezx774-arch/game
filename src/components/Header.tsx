import React from 'react';
import { Menu, Volume2, VolumeX, Settings, HelpCircle, Coins, Star, MapPin } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { Ground } from '../types';

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenSettings: () => void;
  onOpenRules: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  coins: number;
  playerLevel: number;
  xpProgress: number;
  selectedGround?: Ground;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMenu,
  onOpenSettings,
  onOpenRules,
  isMuted,
  onToggleMute,
  coins,
  playerLevel,
  xpProgress,
  selectedGround,
}) => {
  return (
    <header className="w-full flex flex-col gap-2 px-3 py-2 relative z-20">
      {/* Bottom Row: Game Title & Controls */}
      <div className="flex items-center justify-between w-full mt-1">
        {/* Menu Button */}
        <button
          id="btn-header-menu"
          onClick={() => {
            soundFx.playClick();
            onOpenMenu();
          }}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-b from-stone-700 to-stone-800 border-2 border-stone-600 text-stone-200 flex items-center justify-center hover:brightness-110 transition-all shadow-md active:scale-95 cursor-pointer"
          aria-label="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Main Logo & Ground info */}
        <div className="flex flex-col items-center justify-center select-none -mt-2">
          <div className="relative flex items-center justify-center">
            {/* Stylized Logo Text */}
            <div className="text-center relative z-10">
              <h1 className="text-xl sm:text-2xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-sans uppercase">
                CRICKET ROYALE
              </h1>
              {selectedGround ? (
                <div className="flex items-center gap-1 justify-center bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-sm shadow-md mt-[-4px] border border-white/10">
                  <MapPin className="w-2.5 h-2.5 text-amber-400" />
                  <span className="text-[8px] sm:text-[9px] font-black tracking-widest text-amber-100 uppercase">
                    {selectedGround.name}, {selectedGround.location}
                  </span>
                </div>
              ) : (
                <div className="inline-block bg-gradient-to-r from-red-600 via-rose-500 to-red-600 px-2 py-0.5 rounded-sm text-[8px] sm:text-[9px] font-black tracking-widest text-white uppercase shadow-md mt-[-4px]">
                  CRICKET BOARD GAME
                </div>
              )}
            </div>

            {/* Glowing Cricket Ball graphic behind/top */}
            <div className="absolute -top-1 sm:-top-2 left-1/2 -translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-red-700 via-red-500 to-amber-400 shadow-[0_0_12px_rgba(239,68,68,0.8)] border border-red-300 flex items-center justify-center pointer-events-none opacity-90">
              <div className="w-full h-[1px] bg-white/70 transform rotate-45 shadow-xs"></div>
            </div>
          </div>
        </div>

        {/* Right Controls: Sound & Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            id="btn-header-rules"
            onClick={() => {
              soundFx.playClick();
              onOpenRules();
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-b from-stone-700 to-stone-800 border-2 border-stone-600 text-[#facc15] flex items-center justify-center hover:brightness-110 transition-all shadow-md active:scale-95 cursor-pointer"
            title="Game Rules"
            aria-label="Rules"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            id="btn-header-mute"
            onClick={() => {
              onToggleMute();
              soundFx.playClick();
            }}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer ${
              isMuted
                ? 'bg-gradient-to-b from-red-800 to-red-950 border-red-600 text-red-300'
                : 'bg-gradient-to-b from-stone-700 to-stone-800 border-stone-600 text-stone-200 hover:brightness-110'
            }`}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label="Sound Toggle"
          >
            {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

