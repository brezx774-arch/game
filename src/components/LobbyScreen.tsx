import React, { useState, useEffect } from 'react';
import { Play, Settings, Trophy, User, Coins, Star, Store, Home, Medal, Activity, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../utils/audio';
import { socketService } from '../utils/socket';
import { LeaderboardScreen } from './LeaderboardScreen';

import { Ground, GameMode } from '../types';

interface PlayerStats {
  matchesPlayed: number;
  matchesWon: number;
  totalRuns: number;
  totalWickets: number;
  highestScore: number;
}

interface LobbyScreenProps {
  onStart: (ground: Ground, mode?: GameMode) => void;
  onStartMultiplayer: (roomId: string, firstStrikerId: string, opponentId: string, opponentName?: string, isBot?: boolean, groundIndex?: number) => void;
  onOpenSettings: () => void;
  coins: number;
  playerLevel: number;
  xpProgress: number;
  stats: PlayerStats;
  stadiums: Ground[];
  dailyStreak: number;
  showDailyReward: boolean;
  dailyRewardAmount: number;
  onClaimDailyReward: () => void;
  onSpendCoins: (amount: number) => void;
  playerName?: string;
  playerAvatar?: string;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  onStart,
  onStartMultiplayer,
  onOpenSettings,
  coins,
  playerLevel,
  xpProgress,
  stats,
  stadiums,
  dailyStreak,
  showDailyReward,
  dailyRewardAmount,
  onClaimDailyReward,
  onSpendCoins,
  playerName,
  playerAvatar
}) => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'PROFILE' | 'STORE'>('HOME');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isMatchmaking, setIsMatchmaking] = useState(false);
  const [createdRoomCode, setCreatedRoomCode] = useState<string | null>(null);
  const [rouletteIndex, setRouletteIndex] = useState(0);

  useEffect(() => {
    let currentRoomId = '';
    let currentOpponentId = '';
    let currentOpponentName = '';
    let isBotMatch = false;

    const handleMatchFound = (data: { roomId: string, players: string[] }) => {
      currentRoomId = data.roomId;
      const myId = socketService.socket?.id || '';
      currentOpponentId = data.players.find(id => id !== myId) || '';
      currentOpponentName = 'OPPONENT';
      isBotMatch = false;
    };
    
    const handleMatchFoundBot = (data: { roomId: string, botId: string, botName: string }) => {
      currentRoomId = data.roomId;
      currentOpponentId = data.botId;
      currentOpponentName = data.botName;
      isBotMatch = true;
    };

        const handleMatchStart = (data: { firstStriker: string; groundIndex?: number }) => {
      setIsMatchmaking(false);
      setCreatedRoomCode(null);
      setIsSelecting(true);
      
      let iterations = 0;
      let currentIndex = Math.floor(Math.random() * stadiums.length);
      const targetGroundIndex = data.groundIndex !== undefined ? data.groundIndex : Math.floor(Math.random() * stadiums.length);
      
      let baseSpins = 15;
      let diff = (targetGroundIndex - ((currentIndex + baseSpins) % stadiums.length));
      if (diff < 0) diff += stadiums.length;
      const targetSpins = baseSpins + diff;
      
      const baseDelay = 50;
      setRouletteIndex(currentIndex);
      
      const spin = () => {
        iterations++;
        currentIndex = (currentIndex + 1) % stadiums.length;
        setRouletteIndex(currentIndex);

        if (iterations < targetSpins) {
          setTimeout(spin, baseDelay + (iterations * 5));
        } else {
          setTimeout(() => {
            setIsSelecting(false);
            onStartMultiplayer(currentRoomId, data.firstStriker, currentOpponentId, currentOpponentName, isBotMatch, targetGroundIndex);
          }, 800);
        }
      };
      spin();
    };

    const handleRoomCreated = (data: { roomCode: string }) => {
      setCreatedRoomCode(data.roomCode);
    };

    const handleOpponentDisconnected = () => {
      if (isMatchmaking) {
        setIsMatchmaking(false);
        setCreatedRoomCode(null);
      }
    };

    const handleRoomError = (data: { message: string }) => {
      setIsMatchmaking(false);
      setCreatedRoomCode(null);
      alert(data.message); // simple alert for now
    };

    socketService.on('match_found', handleMatchFound);
    socketService.on('match_found_bot', handleMatchFoundBot);
    socketService.on('match_start', handleMatchStart);
    socketService.on('room_created', handleRoomCreated);
    socketService.on('room_error', handleRoomError);
    socketService.on('opponent_disconnected', handleOpponentDisconnected);

    return () => {
      socketService.off('match_found', handleMatchFound);
      socketService.off('match_found_bot', handleMatchFoundBot);
      socketService.off('match_start', handleMatchStart);
      socketService.off('room_created', handleRoomCreated);
      socketService.off('room_error', handleRoomError);
      socketService.off('opponent_disconnected', handleOpponentDisconnected);
    };
  }, [onStartMultiplayer, isMatchmaking]);

  const winRate = stats.matchesPlayed > 0 
    ? Math.round((stats.matchesWon / stats.matchesPlayed) * 100) 
    : 0;

  const handlePlayClick = () => {
    soundFx.playClick();
    setIsSelecting(true);
    
    // Roulette animation
    let iterations = 0;
    const targetSpins = 15 + Math.floor(Math.random() * 10); // Random spins between 15 and 24
    const baseDelay = 50;
    
    let currentIndex = Math.floor(Math.random() * stadiums.length);
    setRouletteIndex(currentIndex);
    
    const spin = () => {
      iterations++;
      currentIndex = (currentIndex + 1) % stadiums.length;
      setRouletteIndex(currentIndex);
      
      if (iterations < targetSpins) {
        soundFx.playClick(); // a small tick sound
        setTimeout(spin, baseDelay + (iterations * 5)); // slow down over time
      } else {
        soundFx.playPowerplayChime();
        // final selection
        const selected = stadiums[currentIndex];
        setTimeout(() => {
          onStart(selected);
          setIsSelecting(false); // Reset selection state for next time
        }, 1500);
      }
    };
    
    spin();
  };

  if (showLeaderboard) return <LeaderboardScreen onBack={() => setShowLeaderboard(false)} />;

  return (
    <div className="flex flex-col items-center min-h-screen p-4 z-10 w-full max-w-md mx-auto relative pb-24 pt-8">
      {/* Decorative background elements */}
      <div className="absolute top-20 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute top-60 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />
      
      {/* Header Profile Section */}
      <div className="w-full flex justify-between items-center mb-4 bg-gradient-to-r from-[#1e293b] to-[#0f172a] p-3 rounded-2xl border-2 border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 pointer-events-none" />
        
        <div className="flex items-center gap-4 z-10">
           <div className="relative">
             <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 border-[3px] border-white/90 flex items-center justify-center shadow-lg transform rotate-3">
               <div className="absolute inset-0 bg-white/20 rounded-lg translate-y-1/2" />
               <span className="text-white font-black text-xl drop-shadow-md z-10 -rotate-3">{playerLevel}</span>
               <Star className="absolute opacity-30 w-10 h-10 fill-white -rotate-3" />
             </div>
             <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg border-2 border-[#1e293b] p-1.5 shadow-md">
               <User className="w-3.5 h-3.5 text-white drop-shadow-sm" />
             </div>
           </div>
           <div className="flex flex-col">
             <span className="text-[11px] font-black text-stone-300 tracking-[0.2em] uppercase mb-1">Player Profile</span>
             <div className="w-28 h-3 bg-black/60 rounded-full overflow-hidden border border-white/10 shadow-inner">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${xpProgress}%` }}
                 transition={{ duration: 1, ease: "easeOut" }}
                 className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full relative"
               >
                 <div className="absolute inset-0 bg-white/20" />
               </motion.div>
             </div>
           </div>
        </div>

        <div className="flex items-center gap-3 bg-black/40 p-2.5 rounded-xl border border-white/10 shadow-inner z-10">
           <div className="flex flex-col items-end">
             <span className="text-[9px] font-black text-[#facc15] tracking-widest uppercase leading-none opacity-80">Balance</span>
             <span className="text-lg font-black text-white leading-none mt-1 drop-shadow-md">{coins.toLocaleString()}</span>
           </div>
           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-200 border-2 border-white/90 flex items-center justify-center shadow-lg">
             <Coins className="w-5 h-5 text-yellow-900 fill-yellow-600 drop-shadow-sm" />
           </div>
        </div>
      </div>

      {/* Daily Streak Banner */}
      <div className="w-full flex justify-center mb-8 z-20 relative">
         <motion.div 
           initial={{ scale: 0.9, opacity: 0, y: -10 }}
           animate={{ scale: 1, opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="bg-gradient-to-r from-orange-600 to-rose-600 px-4 py-1.5 rounded-full border border-white/20 shadow-lg flex items-center gap-2"
         >
            <span className="text-white text-xs font-black tracking-widest uppercase">
              Daily Streak: <span className="text-amber-300">{dailyStreak} {dailyStreak > 1 ? 'Days' : 'Day'}</span> 🔥
            </span>
         </motion.div>
      </div>

      {/* Daily Reward Modal */}
      <AnimatePresence>
        {showDailyReward && (
          <motion.div
            key="daily-reward-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-b from-[#1e293b] to-black w-full max-w-sm rounded-3xl border-4 border-amber-500/50 p-6 shadow-[0_0_50px_rgba(245,158,11,0.3)] flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-30 pointer-events-none" />
              
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-32 -left-32 w-64 h-64 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(245,158,11,0.3)_360deg)] rounded-full blur-2xl pointer-events-none"
              />

              <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.6)] mb-6 z-10 border-4 border-white/20">
                <Coins className="w-10 h-10 text-yellow-900 fill-amber-500" />
              </div>

              <h2 className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-500 mb-2 uppercase z-10 drop-shadow-md">
                Daily Reward!
              </h2>
              
              <p className="text-stone-300 text-sm font-semibold mb-6 z-10">
                You're on a <strong className="text-amber-400">{dailyStreak} day</strong> streak! Keep it up for more coins.
              </p>

              <div className="bg-black/50 border border-amber-500/30 rounded-2xl p-4 w-full mb-6 z-10 flex flex-col items-center">
                <span className="text-xs text-amber-500 font-black uppercase tracking-widest mb-1">Reward</span>
                <span className="text-4xl font-black text-white">+{dailyRewardAmount} <span className="text-xl">Coins</span></span>
              </div>

              <button
                onClick={onClaimDailyReward}
                className="relative w-full h-14 bg-gradient-to-b from-amber-400 to-amber-600 rounded-xl border-b-[4px] border-amber-700 text-amber-950 font-black text-lg tracking-widest uppercase shadow-lg active:scale-95 active:border-b-0 active:translate-y-[4px] transition-all z-10"
              >
                Claim
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
              className="relative flex flex-col items-center justify-center mb-20 mt-4"
            >
              <div className="relative z-10 text-center">
                <h1 className="text-6xl sm:text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] font-sans uppercase leading-none">
                  CRICKET<br />ROYALE
                </h1>
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-block bg-gradient-to-r from-red-600 via-rose-500 to-red-600 px-5 py-1.5 rounded text-[10px] sm:text-xs font-black tracking-[0.3em] text-white uppercase shadow-[0_4px_15px_rgba(239,68,68,0.6)] transform -rotate-3 -mt-3 border-2 border-red-900/50"
                >
                  CRICKET BOARD GAME
                </motion.div>
              </div>

              {/* Big Glowing Ball behind text */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-[radial-gradient(circle,_rgba(239,68,68,0.6)_0%,_transparent_70%)] opacity-60 rounded-full blur-xl -z-10"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[radial-gradient(circle,_rgba(251,191,36,0.4)_0%,_transparent_70%)] rounded-full blur-lg -z-10" />
            </motion.div>

            {/* Main Actions */}
            <div className="w-full flex flex-col gap-5 px-2">
              <AnimatePresence mode="wait">
                {isMatchmaking ? (
                  <motion.div
                    key="matchmaking"
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="w-full h-44 rounded-3xl bg-gradient-to-b from-[#1e3a8a] to-black border-4 border-[#1e40af] flex flex-col items-center justify-center p-6 relative overflow-hidden shadow-[0_0_50px_rgba(37,99,235,0.2)]"
                  >
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      className="absolute -inset-20 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(59,130,246,0.4)_360deg)] rounded-full blur-2xl"
                    />
                    
                    <span className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4 z-10 flex items-center gap-2">
                       <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>•</motion.span>
                       {createdRoomCode ? 'Waiting for Player' : 'Finding Opponent'}
                       <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}>•</motion.span>
                    </span>
                    
                    <div className="h-16 flex items-center justify-center w-full relative z-10 overflow-hidden">
                       {createdRoomCode ? (
                         <div className="flex flex-col items-center">
                           <span className="text-[10px] text-blue-200 uppercase tracking-widest">Room Code</span>
                           <span className="text-3xl font-black text-white tracking-[0.2em] drop-shadow-md">{createdRoomCode}</span>
                         </div>
                       ) : (
                         <User className="w-12 h-12 text-blue-300 drop-shadow-md animate-pulse" />
                       )}
                    </div>
                    
                    <button 
                      onClick={() => {
                        setIsMatchmaking(false);
                        setCreatedRoomCode(null);
                        socketService.emit('cancel_matchmaking');
                      }}
                      className="mt-4 z-10 text-xs text-blue-300/60 hover:text-blue-200 underline underline-offset-4"
                    >
                      Cancel
                    </button>
                  </motion.div>
                ) : isSelecting ? (
                  <motion.div
                    key="selecting"
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="w-full h-44 rounded-3xl bg-gradient-to-b from-[#1e293b] to-black border-4 border-[#334155] flex flex-col items-center justify-center p-6 relative overflow-hidden shadow-[0_0_50px_rgba(250,204,21,0.2)]"
                  >
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                      className="absolute -inset-20 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(250,204,21,0.4)_360deg)] rounded-full blur-2xl"
                    />
                    
                    <span className="text-xs font-black text-stone-400 uppercase tracking-widest mb-4 z-10 flex items-center gap-2">
                       <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>•</motion.span>
                       Locating Match
                       <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}>•</motion.span>
                    </span>
                    
                    <div className="h-24 flex items-center justify-center w-full relative z-10 overflow-hidden">
                      <AnimatePresence mode="popLayout">
                        <motion.div 
                          key={rouletteIndex}
                          initial={{ y: 40, opacity: 0, scale: 0.9 }}
                          animate={{ y: 0, opacity: 1, scale: 1 }}
                          exit={{ y: -40, opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.12, ease: "easeOut" }}
                          className="flex flex-col items-center absolute w-full"
                        >
                          <h3 className="text-3xl font-black text-[#facc15] tracking-widest uppercase text-center leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-4">
                            {stadiums[rouletteIndex].name}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-3 bg-black/60 px-4 py-1.5 rounded-full border border-white/10 shadow-inner">
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-xs font-bold text-amber-100 tracking-[0.2em] uppercase">
                              {stadiums[rouletteIndex].location}
                            </span>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    
                    {/* Background glow matching stadium gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-tr ${stadiums[rouletteIndex].gradientClass} opacity-50 blur-2xl transition-colors duration-200`} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="buttons"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="w-full flex flex-col gap-5"
                  >
                    <motion.button
                      animate={{ 
                        boxShadow: ['0 15px 30px rgba(16,185,129,0.3)', '0 15px 40px rgba(16,185,129,0.6)', '0 15px 30px rgba(16,185,129,0.3)']
                      }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePlayClick}
                      className="group w-full h-24 rounded-3xl bg-gradient-to-b from-[#10b981] via-[#059669] to-[#047857] border-b-[8px] border-[#064e3b] text-white flex items-center justify-center gap-4 relative overflow-hidden"
                    >
                       <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-3xl" />
                       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-30 mix-blend-overlay" />
                       
                       <motion.div
                         animate={{ x: [-2, 2, -2] }}
                         transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                       >
                         <Play className="w-10 h-10 fill-white drop-shadow-lg z-10" />
                       </motion.div>
                       
                       <div className="flex flex-col items-start z-10 relative">
                         <span className="text-3xl font-black italic tracking-wider drop-shadow-md">PLAY NOW</span>
                         <span className="text-xs font-bold text-emerald-100 uppercase tracking-[0.2em]">VS. AI / Pass & Play</span>
                       </div>
                    </motion.button>

                    <div className="w-full flex flex-col gap-3 mt-4">
                      <span className="text-[10px] font-black text-stone-400 tracking-widest uppercase ml-2 text-left">Multiplayer</span>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          soundFx.playClick();
                          setIsMatchmaking(true);
                          socketService.connect();
                          socketService.emit('join_matchmaking');
                        }}
                        className="w-full h-14 rounded-2xl bg-gradient-to-b from-blue-500 to-blue-700 border-b-[6px] border-blue-900 text-white flex items-center justify-center gap-3 relative overflow-hidden shadow-lg"
                      >
                         <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 rounded-t-2xl" />
                         <User className="w-5 h-5 fill-white drop-shadow-md" />
                         <span className="text-lg font-black italic tracking-widest drop-shadow-md uppercase">Find Match</span>
                      </motion.button>

                      <div className="flex flex-col gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            soundFx.playClick();
                            setIsMatchmaking(true);
                            socketService.connect();
                            socketService.emit('create_room', { name: playerName, avatar: playerAvatar });
                          }}
                          className="h-14 rounded-2xl bg-gradient-to-b from-purple-500 to-purple-700 border-b-[6px] border-purple-900 text-white flex items-center justify-center gap-2 relative overflow-hidden shadow-lg w-full"
                        >
                          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 rounded-t-2xl" />
                          <span className="text-sm font-black tracking-widest uppercase">Create Room</span>
                        </motion.button>
                        
                        <div className="flex gap-2 h-14">
                          <input 
                            id="room-code-input"
                            type="text" 
                            placeholder="CODE"
                            maxLength={4}
                            className="flex-1 rounded-2xl bg-stone-900 border-2 border-stone-700 text-center text-white font-black tracking-widest uppercase outline-none focus:border-purple-500 transition-colors"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const code = (e.target as HTMLInputElement).value;
                                if (code.length === 4) {
                                  soundFx.playClick();
                                  setIsMatchmaking(true);
                                  socketService.connect();
                                  socketService.emit('join_room', { roomCode: code });
                                }
                              }
                            }}
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              const input = document.getElementById('room-code-input') as HTMLInputElement;
                              const code = input?.value;
                              if (code && code.length === 4) {
                                soundFx.playClick();
                                setIsMatchmaking(true);
                                socketService.connect();
                                socketService.emit('join_room', { roomCode: code });
                              }
                            }}
                            className="h-full px-6 rounded-2xl bg-stone-800 text-stone-200 font-black text-sm uppercase tracking-wider border-b-[4px] border-stone-950 flex items-center justify-center shadow-lg"
                          >
                            Join
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowLeaderboard(true)}
                        className="h-16 rounded-2xl bg-gradient-to-b from-stone-800 to-stone-900 border-b-[6px] border-stone-950 hover:border-b-[4px] hover:translate-y-[2px] active:border-b-[0px] active:translate-y-[6px] text-stone-200 flex flex-col items-center justify-center gap-1 shadow-xl relative overflow-hidden transition-all"
                      >
                         <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/5 rounded-t-2xl" />
                         <Trophy className="w-5 h-5 text-[#facc15] drop-shadow-sm" />
                         <span className="text-[9px] font-black tracking-widest uppercase">Leaderboard</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          soundFx.playClick();
                          onOpenSettings();
                        }}
                        className="h-16 rounded-2xl bg-gradient-to-b from-stone-800 to-stone-900 border-b-[6px] border-black text-stone-200 flex flex-col items-center justify-center gap-1 shadow-xl relative overflow-hidden group"
                      >
                         <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/5 rounded-t-2xl group-hover:bg-white/10 transition-colors" />
                         <Settings className="w-5 h-5 text-stone-400 group-hover:rotate-90 transition-transform duration-500" />
                         <span className="text-[9px] font-black tracking-widest uppercase">Settings</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
            
            <div className="w-full space-y-4 pb-20">
              {/* Item 1: Golden Bat */}
              <div className="bg-stone-800 rounded-2xl p-4 flex items-center justify-between border border-stone-700 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/50">
                    <span className="text-2xl">🏏</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-100">Golden Bat</h4>
                    <p className="text-xs text-stone-400">+10% XP per match</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (coins >= 1000) {
                      soundFx.playClick();
                      onSpendCoins(1000);
                      alert('You bought the Golden Bat! (Visual only for now)');
                    } else {
                      alert('Not enough coins!');
                    }
                  }}
                  className={`px-4 py-2 rounded-xl font-black text-sm uppercase tracking-wider ${coins >= 1000 ? 'bg-amber-500 text-stone-900 shadow-lg shadow-amber-500/20' : 'bg-stone-700 text-stone-500'}`}
                >
                  1000 🪙
                </button>
              </div>

              {/* Item 2: VIP Avatar Frame */}
              <div className="bg-stone-800 rounded-2xl p-4 flex items-center justify-between border border-stone-700 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/50">
                    <span className="text-2xl">🖼️</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-100">VIP Frame</h4>
                    <p className="text-xs text-stone-400">Stand out on Leaderboards</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (coins >= 500) {
                      soundFx.playClick();
                      onSpendCoins(500);
                      alert('You bought the VIP Frame! (Visual only for now)');
                    } else {
                      alert('Not enough coins!');
                    }
                  }}
                  className={`px-4 py-2 rounded-xl font-black text-sm uppercase tracking-wider ${coins >= 500 ? 'bg-amber-500 text-stone-900 shadow-lg shadow-amber-500/20' : 'bg-stone-700 text-stone-500'}`}
                >
                  500 🪙
                </button>
              </div>
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
