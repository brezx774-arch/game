import React, { useState } from 'react';
import { Play, Settings, Trophy, User, Coins, Star, Store, Home, Medal, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../utils/audio';

interface PlayerStats {
  matchesPlayed: number;
  matchesWon: number;
  totalRuns: number;
  totalWickets: number;
  highestScore: number;
}

interface LobbyScreenProps {
  onStart: () => void;
  onOpenSettings: () => void;
  coins: number;
  playerLevel: number;
  xpProgress: number;
  stats: PlayerStats;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  onStart,
  onOpenSettings,
  coins,
  playerLevel,
  xpProgress,
  stats
}) => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'PROFILE' | 'STORE'>('HOME');

  const winRate = stats.matchesPlayed > 0 
    ? Math.round((stats.matchesWon / stats.matchesPlayed) * 100) 
    : 0;

  return (
    <div className="flex flex-col items-center min-h-screen p-4 z-10 w-full max-w-md mx-auto relative pb-24 pt-8">
      {/* Header Profile Section */}
      <div className="w-full flex justify-between items-center mb-10 bg-[#1e293b] p-3 rounded-2xl border-2 border-[#334155] shadow-xl">
        <div className="flex items-center gap-3">
           <div className="relative">
             <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 border-[3px] border-white flex items-center justify-center shadow-inner overflow-hidden">
               <span className="text-white font-black text-lg drop-shadow-md z-10">{playerLevel}</span>
               <Star className="absolute opacity-20 w-12 h-12 fill-white" />
             </div>
             <div className="absolute -bottom-2 -right-1 bg-green-500 rounded-full border-2 border-[#1e293b] p-1">
               <User className="w-3 h-3 text-white" />
             </div>
           </div>
           <div className="flex flex-col">
             <span className="text-xs font-black text-white tracking-widest uppercase">Player</span>
             <div className="w-24 h-2.5 bg-black/50 rounded-full overflow-hidden mt-1 border border-white/10">
               <div 
                 className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                 style={{ width: `${xpProgress}%` }}
               />
             </div>
           </div>
        </div>

        <div className="flex items-center gap-2 bg-black/30 p-2 rounded-xl border border-white/5">
           <div className="flex flex-col items-end">
             <span className="text-[10px] font-black text-[#facc15] tracking-widest uppercase leading-none">Coins</span>
             <span className="text-base font-black text-white leading-none mt-1">{coins.toLocaleString()}</span>
           </div>
           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-300 border-2 border-white flex items-center justify-center shadow-inner">
             <Coins className="w-4 h-4 text-yellow-900 fill-yellow-500 drop-shadow-sm" />
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'HOME' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full flex flex-col items-center flex-1 justify-center -mt-8"
          >
            {/* Hero Logo */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="relative flex flex-col items-center justify-center mb-16"
            >
              <div className="relative z-10 text-center">
                <h1 className="text-5xl sm:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] font-sans uppercase">
                  SIX<br />APPEAL
                </h1>
                <div className="inline-block bg-gradient-to-r from-red-600 via-rose-500 to-red-600 px-4 py-1 rounded-sm text-xs font-black tracking-widest text-white uppercase shadow-[0_4px_10px_rgba(239,68,68,0.5)] transform -rotate-2 -mt-4 border-2 border-red-900">
                  BOARD GAME
                </div>
              </div>

              {/* Big Glowing Ball behind text */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-tr from-red-700/50 via-red-500/50 to-amber-400/50 rounded-full blur-[40px] -z-10"
              />
            </motion.div>

            {/* Main Actions */}
            <div className="w-full flex flex-col gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  soundFx.playClick();
                  onStart();
                }}
                className="w-full h-20 rounded-2xl bg-gradient-to-b from-[#10b981] to-[#047857] border-b-[6px] border-[#064e3b] text-white flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(16,185,129,0.4)] relative overflow-hidden"
              >
                 <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-xl" />
                 <Play className="w-8 h-8 fill-white drop-shadow-md z-10" />
                 <span className="text-3xl font-black tracking-widest uppercase drop-shadow-md z-10">PLAY NOW</span>
              </motion.button>

              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="h-16 rounded-2xl bg-gradient-to-b from-stone-700 to-stone-800 border-b-[4px] border-stone-900 text-stone-200 flex items-center justify-center gap-2 shadow-lg relative overflow-hidden opacity-50 cursor-not-allowed"
                >
                   <Trophy className="w-5 h-5 text-[#facc15]" />
                   <span className="text-sm font-black tracking-widest uppercase">Leaderboard</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    soundFx.playClick();
                    onOpenSettings();
                  }}
                  className="h-16 rounded-2xl bg-gradient-to-b from-stone-700 to-stone-800 border-b-[4px] border-stone-900 text-stone-200 flex items-center justify-center gap-2 shadow-lg relative overflow-hidden"
                >
                   <Settings className="w-5 h-5" />
                   <span className="text-sm font-black tracking-widest uppercase">Settings</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'PROFILE' && (
          <motion.div 
            key="profile"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full flex flex-col items-center flex-1"
          >
            <h2 className="text-2xl font-black text-white italic uppercase tracking-wider mb-6 flex items-center gap-2">
              <User className="text-[#38bdf8]" /> Profile Stats
            </h2>

            <div className="w-full grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#1e293b] border-2 border-[#334155] rounded-xl p-4 flex flex-col items-center justify-center shadow-lg">
                <span className="text-xs font-black text-[#94a3b8] uppercase tracking-widest mb-1 text-center">Matches</span>
                <span className="text-3xl font-black text-white">{stats.matchesPlayed}</span>
              </div>
              <div className="bg-[#1e293b] border-2 border-[#334155] rounded-xl p-4 flex flex-col items-center justify-center shadow-lg">
                <span className="text-xs font-black text-[#94a3b8] uppercase tracking-widest mb-1 text-center">Win Rate</span>
                <span className="text-3xl font-black text-[#10b981]">{winRate}%</span>
              </div>
            </div>

            <div className="w-full bg-[#1e293b] border-2 border-[#334155] rounded-xl p-4 shadow-lg mb-4">
               <h3 className="text-sm font-black text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Activity className="w-4 h-4" /> Career Stats
               </h3>
               
               <div className="flex justify-between items-center py-2 border-b border-[#334155]">
                 <span className="text-stone-300 font-bold">Total Runs</span>
                 <span className="text-xl font-black text-white">{stats.totalRuns}</span>
               </div>
               
               <div className="flex justify-between items-center py-2 border-b border-[#334155]">
                 <span className="text-stone-300 font-bold">Total Wickets</span>
                 <span className="text-xl font-black text-[#ef4444]">{stats.totalWickets}</span>
               </div>
               
               <div className="flex justify-between items-center py-2">
                 <span className="text-stone-300 font-bold">Highest Score</span>
                 <span className="text-xl font-black text-[#facc15]">{stats.highestScore}</span>
               </div>
            </div>
            
            <div className="w-full bg-gradient-to-tr from-amber-600/20 to-amber-400/20 border-2 border-amber-500/30 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                <Medal className="text-amber-400 w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-amber-200">Rookie Smasher</span>
                <span className="text-xs text-amber-400/70 font-semibold">Reach Level 5 to unlock next title</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'STORE' && (
          <motion.div 
            key="store"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full flex flex-col items-center flex-1"
          >
            <h2 className="text-2xl font-black text-white italic uppercase tracking-wider mb-6 flex items-center gap-2">
              <Store className="text-[#facc15]" /> Store
            </h2>
            
            <div className="w-full flex flex-col items-center justify-center h-64 bg-[#1e293b] border-2 border-[#334155] border-dashed rounded-xl p-6 text-center">
               <Store className="w-16 h-16 text-stone-600 mb-4" />
               <h3 className="text-xl font-black text-stone-400 mb-2">Coming Soon</h3>
               <p className="text-sm text-stone-500 font-semibold">
                 Use your coins to buy custom dice, new bats, and exclusive player avatars in future updates!
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className="absolute bottom-4 left-4 right-4 bg-[#1e293b] border-2 border-[#334155] rounded-2xl p-2 flex justify-between shadow-2xl">
         <NavButton 
           icon={<Home />} 
           label="Home" 
           isActive={activeTab === 'HOME'} 
           onClick={() => { soundFx.playClick(); setActiveTab('HOME'); }} 
         />
         <NavButton 
           icon={<User />} 
           label="Profile" 
           isActive={activeTab === 'PROFILE'} 
           onClick={() => { soundFx.playClick(); setActiveTab('PROFILE'); }} 
         />
         <NavButton 
           icon={<Store />} 
           label="Store" 
           isActive={activeTab === 'STORE'} 
           onClick={() => { soundFx.playClick(); setActiveTab('STORE'); }} 
         />
      </div>
    </div>
  );
};

const NavButton = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all ${
        isActive 
          ? 'bg-stone-800 text-white shadow-inner' 
          : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800/50'
      }`}
    >
      <div className={`mb-1 transition-transform ${isActive ? 'scale-110' : ''}`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
};
