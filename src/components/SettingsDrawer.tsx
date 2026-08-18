import React from 'react';
import { X, RotateCcw, Volume2, VolumeX, Trophy, Users, Bot, Sliders, LogOut, Image as ImageIcon } from 'lucide-react';
import { GameSettings } from '../types';
import { soundFx } from '../utils/audio';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onRestartMatch: () => void;
  onExitToLobby?: () => void;
  isMultiplayer?: boolean;
  showLogout?: boolean;
  showExitToLobby?: boolean;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onRestartMatch,
  onExitToLobby,
  isMultiplayer,
  showLogout = true,
  showExitToLobby = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-black/70 ">
      <div className="w-full max-w-xs h-full bg-stone-900 border-r border-stone-800 p-5 text-stone-100 flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <h2 className="font-black text-amber-300 text-lg uppercase tracking-wide">
                Game Options
              </h2>
            </div>
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6 mt-5 text-xs">
            {!isMultiplayer && (<>
            {/* Game Mode */}
            <div>
              <label className="block text-stone-400 font-bold uppercase tracking-wider mb-2">
                Game Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onUpdateSettings({ mode: 'VS_AI' });
                  }}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
                    settings.mode === 'VS_AI'
                      ? 'bg-amber-950/80 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
                      : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <Bot className="w-4 h-4 text-rose-400" />
                  <span>VS AI</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    onUpdateSettings({ mode: 'PASS_AND_PLAY' });
                  }}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
                    settings.mode === 'PASS_AND_PLAY'
                      ? 'bg-amber-950/80 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
                      : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>2 Player</span>
                </button>
              </div>
            </div>

            {/* Overs Selection */}
            <div>
              <label className="block text-stone-400 font-bold uppercase tracking-wider mb-2">
                Match Overs
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 5, 10].map((overs) => (
                  <button
                    key={overs}
                    onClick={() => {
                      soundFx.playClick();
                      onUpdateSettings({ maxOvers: overs });
                    }}
                    className={`py-2 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                      settings.maxOvers === overs
                        ? 'bg-amber-500 border-amber-400 text-stone-950 font-black'
                        : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    {overs} Overs
                  </button>
                ))}
              </div>
            </div>

            {/* AI Difficulty */}
            {settings.mode === 'VS_AI' && (
              <div>
                <label className="block text-stone-400 font-bold uppercase tracking-wider mb-2">
                  AI Difficulty
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['EASY', 'MEDIUM', 'HARD'] as const).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => {
                        soundFx.playClick();
                        onUpdateSettings({ aiDifficulty: diff });
                      }}
                      className={`py-1.5 rounded-xl border font-bold text-center text-[11px] transition-all cursor-pointer ${
                        settings.aiDifficulty === diff
                          ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                          : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:bg-stone-800'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            )}

            </>)}
            {/* Audio Toggle */}
            <div>
              <label className="block text-stone-400 font-bold uppercase tracking-wider mb-2">
                Audio Sound Effects
              </label>
              <button
                onClick={() => {
                  soundFx.playClick();
                  onUpdateSettings({ soundEnabled: !settings.soundEnabled });
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-800/80 border border-stone-700 text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <span className="font-semibold">Sound & Commentary</span>
                {settings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-rose-400" />
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-stone-800 space-y-2">
          {onExitToLobby && showExitToLobby && (
            <button
              onClick={() => {
                soundFx.playClick();
                onExitToLobby();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-stone-800 border border-stone-700 text-stone-200 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-stone-700 transition-colors cursor-pointer active:scale-98"
            >
              <span>Exit to Lobby</span>
            </button>
          )}

          {!isMultiplayer && showExitToLobby && (
          <button
            onClick={() => {
              soundFx.playClick();
              onRestartMatch();
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-rose-900/80 border border-rose-700 text-rose-100 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-rose-800 transition-colors cursor-pointer active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Match</span>
          </button>
          )}

          {showLogout && (
          <button
            onClick={() => {
              soundFx.playClick();
              signOut(auth);
            }}
            className="w-full mt-4 py-3 rounded-xl bg-transparent border border-stone-800 text-stone-500 hover:text-stone-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors cursor-pointer active:scale-98"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
          )}
        </div>
      </div>
    </div>
  );
};
