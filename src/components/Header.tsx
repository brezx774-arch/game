import React from 'react';
import { Menu, Volume2, VolumeX, Settings, HelpCircle } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenSettings: () => void;
  onOpenRules: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMenu,
  onOpenSettings,
  onOpenRules,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="w-full flex items-center justify-between px-4 py-2 relative z-20">
      {/* Menu Button */}
      <button
        id="btn-header-menu"
        onClick={() => {
          soundFx.playClick();
          onOpenMenu();
        }}
        className="w-10 h-10 rounded-xl bg-stone-900/80 border border-stone-700/80 text-stone-200 flex items-center justify-center hover:bg-stone-800 transition-colors shadow-lg active:scale-95 cursor-pointer"
        aria-label="Open Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Main Logo */}
      <div className="flex flex-col items-center justify-center cursor-pointer select-none">
        <div className="relative flex items-center justify-center">
          {/* Stylized Logo Text */}
          <div className="text-center relative z-10">
            <h1 className="text-2xl md:text-3xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-sans uppercase">
              SIX APPEAL
            </h1>
            <div className="inline-block bg-gradient-to-r from-amber-600 via-red-600 to-amber-600 px-3 py-0.5 rounded-sm text-[9px] font-black tracking-widest text-white uppercase shadow-md -mt-1">
              CRICKET BOARD GAME
            </div>
          </div>

          {/* Glowing Cricket Ball graphic behind/top */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-tr from-red-700 via-red-500 to-amber-400 shadow-[0_0_12px_rgba(239,68,68,0.8)] border border-red-300 flex items-center justify-center pointer-events-none opacity-90">
            <div className="w-full h-0.5 bg-white/70 transform rotate-45 shadow-xs"></div>
          </div>
        </div>
      </div>

      {/* Right Controls: Sound & Settings */}
      <div className="flex items-center gap-2">
        <button
          id="btn-header-rules"
          onClick={() => {
            soundFx.playClick();
            onOpenRules();
          }}
          className="w-10 h-10 rounded-xl bg-stone-900/80 border border-stone-700/80 text-amber-300 flex items-center justify-center hover:bg-stone-800 transition-colors shadow-lg active:scale-95 cursor-pointer"
          title="Game Rules"
          aria-label="Rules"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        <button
          id="btn-header-mute"
          onClick={() => {
            onToggleMute();
            soundFx.playClick();
          }}
          className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors shadow-lg active:scale-95 cursor-pointer ${
            isMuted
              ? 'bg-red-950/60 border-red-800 text-red-400'
              : 'bg-stone-900/80 border-stone-700/80 text-stone-200 hover:bg-stone-800'
          }`}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          aria-label="Sound Toggle"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        <button
          id="btn-header-settings"
          onClick={() => {
            soundFx.playClick();
            onOpenSettings();
          }}
          className="w-10 h-10 rounded-xl bg-stone-900/80 border border-stone-700/80 text-stone-200 flex items-center justify-center hover:bg-stone-800 transition-colors shadow-lg active:scale-95 cursor-pointer"
          title="Settings"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
