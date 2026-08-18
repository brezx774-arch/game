import { useGameEngine } from './game/engine/useGameEngine';
import { useGameStore } from './state/gameStore';
import { GameScreen } from './screens/GameScreen';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  TacticMode,
  BoardTile,
  DeliveryRecord,
  PlayerState,
  GamePhase,
  GameSettings,
  Ground,
} from './types';
import { BOARD_TILES } from './utils/boardData';
import { soundFx } from './utils/audio';
import { socketService } from './utils/socket';
import { multiplayerController } from './game/multiplayer/multiplayerController';
import { useAiController } from './game/ai/aiController';

import { Header } from './components/Header';
import { Scoreboard } from './components/Scoreboard';
import { CricketBoard } from './components/CricketBoard';
import { CommentaryBanner } from './components/CommentaryBanner';
import { OversHistory } from './components/OversHistory';
import { ActionControls } from './components/ActionControls';
import { DiceModal } from './components/DiceModal';
import { RulesModal } from './components/RulesModal';
import { SettingsDrawer } from './components/SettingsDrawer';
import { MatchEndModal } from './components/MatchEndModal';
import { LobbyScreen } from './screens/LobbyScreen';
import { TossScreen } from './screens/TossScreen';
import { MatchPlayersBanner } from './components/MatchPlayersBanner';
import { LoginScreen } from './screens/LoginScreen';
import { AnimatedBackground } from './components/AnimatedBackground';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useProfile } from './hooks/useProfile';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { Capacitor } from '@capacitor/core';

export const STADIUMS: Ground[] = [
  { 
    id: 'lords', 
    name: "The Home of Cricket", 
    location: "London", 
    gradientClass: "from-emerald-950/20 via-stone-950 to-black",
    pitchColorClass: "bg-[#e5d3b3]", // Light dusty pitch
    grassColorClass: "bg-emerald-800", // Classic lush green
    pitchHex: "#e5d3b3"
  },
  { 
    id: 'mcg', 
    name: "The Colosseum", 
    location: "Melbourne", 
    gradientClass: "from-blue-950/20 via-stone-950 to-black",
    pitchColorClass: "bg-[#c4b59d]", // Hard greyish pitch
    grassColorClass: "bg-green-700", // Standard green
    pitchHex: "#c4b59d"
  },
  { 
    id: 'eden', 
    name: "The Roar", 
    location: "Kolkata", 
    gradientClass: "from-orange-950/20 via-stone-950 to-black",
    pitchColorClass: "bg-[#a37e5c]", // Dark soil pitch
    grassColorClass: "bg-lime-900", // Slightly yellower green
    pitchHex: "#a37e5c"
  },
  { 
    id: 'wankhede', 
    name: "The Cauldron", 
    location: "Mumbai", 
    gradientClass: "from-rose-950/20 via-stone-950 to-black",
    pitchColorClass: "bg-[#d47b59]", // Red soil pitch
    grassColorClass: "bg-[#1f4d29]", // Deep green
    pitchHex: "#d47b59"
  },
  { 
    id: 'gabba', 
    name: "The Fortress", 
    location: "Brisbane", 
    gradientClass: "from-amber-950/20 via-stone-950 to-black",
    pitchColorClass: "bg-[#d1c4a9]", // Bouncy hard pitch
    grassColorClass: "bg-teal-900", // Dark blue-green
    pitchHex: "#d1c4a9"
  },
];

export default function App() {
  const API_URL = import.meta.env.VITE_SERVER_URL || 'https://amongush.duckdns.org';
  
  // Self-Hosted Capacitor Updater Init
  useEffect(() => {
    import('./services/otaService').then(m => m.checkForUpdates());
  }, []);

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  
      


  // Dice Modal state

  // Commentary text

  // Player Profile State (Firestore Sync)
  const { profile, updateProfile, profileLoading } = useProfile(user);
  useAiController(API_URL);

  const {
    settings, setSettings,
    activeScreen, setActiveScreen,
    phase, setPhase,
    selectedGround, setSelectedGround,
    currentStrike, setCurrentStrike,
    targetRuns, setTargetRuns,
    youState, setYouState,
    aiState, setAiState,
    selectedTactic, setSelectedTactic,
    youTileIndex, setYouTileIndex,
    aiTileIndex, setAiTileIndex,
    isFreeHit, setIsFreeHit,
    multiplayerRoomId, setMultiplayerRoomId,
    myPlayerId, setMyPlayerId,
    opponentPlayerId, setOpponentPlayerId,
    multiplayerOpponentName, setMultiplayerOpponentName,
    isMenuOpen, setIsMenuOpen,
    isSettingsOpen, setIsSettingsOpen,
    isRulesOpen, setIsRulesOpen,
    tossCallerId, setTossCallerId,
    isBotToss, setIsBotToss,
    emojiEvent, setEmojiEvent,
    myTurnAction, setMyTurnAction,
    opponentTurnAction, setOpponentTurnAction,
    isRolling, setIsRolling,
    turnTimer, setTurnTimer,
    showDiceModal, setShowDiceModal,
    diceVal, setDiceVal,
    landedTileInfo, setLandedTileInfo,
    commentaryMsg, setCommentaryMsg,
    commentarySubMsg, setCommentarySubMsg,
    showDailyReward, setShowDailyReward,
    dailyRewardAmount, setDailyRewardAmount
  } = useGameStore();

  const { handleActionSubmit, isCurrentPowerplay } = useGameEngine(API_URL, updateProfile, profile);
  
  const coins = profile?.coins || 0;
  const xp = profile?.xp || 0;
  const stats = profile?.stats || { matchesPlayed: 0, matchesWon: 0, totalRuns: 0, totalWickets: 0, highestScore: 0 };
  const dailyStreak = profile?.dailyStreak || 0;
  const lastLoginDate = profile?.lastLoginDate || '';

  const setCoins = (updater: any) => {
    const newVal = typeof updater === 'function' ? updater(profile.coins) : updater;
    updateProfile({ coins: newVal });
  };
  const setXp = (updater: any) => {
    const newVal = typeof updater === 'function' ? updater(profile.xp) : updater;
    updateProfile({ xp: newVal });
  };
  const setStats = (updater: any) => {
    const newVal = typeof updater === 'function' ? updater(profile.stats) : updater;
    updateProfile({ stats: newVal });
  };
  const setDailyStreak = (updater: any) => {
    const newVal = typeof updater === 'function' ? updater(profile.dailyStreak) : updater;
    updateProfile({ dailyStreak: newVal });
  };
  const setLastLoginDate = (updater: any) => {
    const newVal = typeof updater === 'function' ? updater(profile.lastLoginDate) : updater;
    updateProfile({ lastLoginDate: newVal });
  };


  // Daily Reward Logic
  useEffect(() => {
    if (!user || profileLoading) return; // Wait until loaded

    const today = new Date().toDateString();
    // Only claim if it's not today. Empty string counts as 'never claimed'.
    if (lastLoginDate !== today && !showDailyReward) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      let newStreak = dailyStreak;
      if (lastLoginDate === yesterday.toDateString()) {
        newStreak += 1;
      } else {
        newStreak = 1; // Reset streak if missed a day or first time
      }
      
      const reward = 50 + (Math.min(newStreak, 7) * 10); // Cap multiplier at 7 days
      setDailyRewardAmount(reward);
      setShowDailyReward(true);
    }
  }, [lastLoginDate, dailyStreak, profileLoading, user, showDailyReward, setShowDailyReward]);

  const claimDailyReward = () => {
    soundFx.playPowerplayChime();
    
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    let newStreak = dailyStreak;
    if (lastLoginDate === yesterday.toDateString()) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    updateProfile({
      coins: coins + dailyRewardAmount,
      dailyStreak: newStreak,
      lastLoginDate: today
    });
    
    setShowDailyReward(false);
  };

  // Calculate Level from XP
  const playerLevel = Math.floor(Math.sqrt(xp / 100)) + 1;
  const xpForNextLevel = Math.pow(playerLevel, 2) * 100;
  const xpForCurrentLevel = Math.pow(playerLevel - 1, 2) * 100;
  const xpProgress = ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  // Sync Mute state
  const handleToggleMute = () => {
    const willBeMuted = settings.soundEnabled;
    setSettings((prev) => ({ ...prev, soundEnabled: !willBeMuted }));
    soundFx.setMuted(willBeMuted);
  };

  // Helper: check powerplay status (Overs 1 & 2 are powerplays)

  // Restart Fresh Match
  
  const handleExitToLobby = () => {
    setActiveScreen('LOBBY');
    setPhase('MATCH_OVER');
            
    if (settings.mode === 'MULTIPLAYER' && multiplayerRoomId) {
      multiplayerController.leaveRoom(multiplayerRoomId);
      multiplayerController.cancelMatchmaking();
    }
  };

  const handleRestartMatch = () => {
    setYouState({
      name: 'YOU',
      avatar: 'helmet',
      runs: 0,
      wickets: 0,
      overs: 0.0,
      ballsBowled: 0,
      history: [],
      fourCount: 0,
      sixCount: 0,
      dotsCount: 0,
    });
    setAiState({
      name: settings.mode === 'PASS_AND_PLAY' ? 'PLAYER 2' : 'AI',
      avatar: 'robot',
      runs: 0,
      wickets: 0,
      overs: 0.0,
      ballsBowled: 0,
      history: [],
      fourCount: 0,
      sixCount: 0,
      dotsCount: 0,
    });
    setCurrentStrike('YOU');
    setPhase('INNINGS_1');
    setTargetRuns(undefined);
    setYouTileIndex(0);
    setAiTileIndex(0);
    setIsFreeHit(false);
    setCommentaryMsg('Match started! Race your opponent to finish your overs!');
    setCommentarySubMsg('First to finish is not enough, you must score more runs!');
    setMyTurnAction(null);
  };


  // Emoji clear timer
  useEffect(() => {
    if (emojiEvent) {
      const timer = setTimeout(() => {
        setEmojiEvent(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [emojiEvent]);

  
  // Match End conditions
  const isUserFinished = youState.ballsBowled >= settings.maxOvers * 6 || youState.wickets >= settings.maxWickets;
  const isAiFinished = aiState.ballsBowled >= settings.maxOvers * 6 || aiState.wickets >= settings.maxWickets;


  // Multiplayer Opponent Action Listener
  useEffect(() => {
    if (settings.mode === 'MULTIPLAYER') {
      const handleOpponentAction = (data: { action: string, payload: any }) => {
        if (data.action === 'LEAVE') {
          setSettings(prev => ({ ...prev, mode: 'VS_AI' }));
          setCommentaryMsg('Opponent left.');
          setCommentarySubMsg('AI took over!');
        } else if (data.action === 'EMOJI') {
          // Handle emoji here
          setEmojiEvent({ player: 'AI', emoji: data.payload.emoji, id: Date.now() });
        } else if (data.action === 'SUBMIT_TURN') {
          setOpponentTurnAction(data.payload);
        }
      };
      
      const handleOpponentDisconnected = () => {
        setSettings(prev => ({ ...prev, mode: 'VS_AI' }));
      };

      socketService.on('opponent_action', handleOpponentAction);
      socketService.on('opponent_disconnected', handleOpponentDisconnected);

      return () => {
        socketService.off('opponent_action', handleOpponentAction);
        socketService.off('opponent_disconnected', handleOpponentDisconnected);
      };
    }
  }, [settings.mode]);

  if (authLoading || (user && profileLoading)) {
    return (
      <div className="min-h-dvh bg-stone-950 flex flex-col items-center justify-center relative overflow-hidden text-stone-100">
        <AnimatedBackground variant="STADIUM" inGame={false} />
        <div className="z-10 flex flex-col items-center animate-pulse">
           <div className="w-16 h-16 bg-emerald-500/20 backdrop-blur-md border border-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] mb-6">
              <svg className="w-8 h-8 text-emerald-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
           </div>
           <h2 className="text-2xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-stone-100 to-stone-400">LOADING...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="h-dvh bg-transparent text-stone-100 font-sans flex flex-col justify-between overflow-hidden selection:bg-amber-500 selection:text-stone-950 relative overflow-x-hidden">
      
      {/* Animated Background layer */}
      <AnimatedBackground 
        variant={settings.backgroundStyle || 'STADIUM'} 
        inGame={activeScreen === 'GAME' || activeScreen === 'TOSS'} 
      />

      {activeScreen === 'TOSS' ? (
        <TossScreen
          mode={settings.mode === 'MULTIPLAYER' ? 'MULTIPLAYER' : 'VS_AI'}
          roomId={multiplayerRoomId || undefined}
          myId={myPlayerId}
          opponentId={opponentPlayerId}
          opponentName={multiplayerOpponentName}
          callerId={tossCallerId}
          isBotMatch={isBotToss}
          onTossComplete={(firstStrikerId) => {
            setCurrentStrike(firstStrikerId === myPlayerId ? 'YOU' : 'AI');
            setPhase('INNINGS_1');
            setTargetRuns(undefined);
            setCommentaryMsg('Match started!');
            setCommentarySubMsg('Race your opponent to finish your overs!');
            setActiveScreen('GAME');
          }}
        />
      ) : activeScreen === 'LOBBY' ? (
        <LobbyScreen 
          onStart={(ground, mode) => {
            setSelectedGround(ground);
            if (mode) {
              setSettings(prev => ({ ...prev, mode }));
            } else {
              setSettings(prev => ({ ...prev, mode: 'VS_AI' }));
            }
            handleRestartMatch();
            setMyPlayerId('YOU');
            setOpponentPlayerId('AI');
            setMultiplayerOpponentName('AI');
            setTossCallerId(Math.random() > 0.5 ? 'YOU' : 'AI');
            setIsBotToss(true);
            setActiveScreen('TOSS');
          }}
          onStartMultiplayer={(roomId, firstStrikerId, opponentId, opponentName, isBot, groundIndex) => {
            setMultiplayerRoomId(roomId);
            setMultiplayerOpponentId(opponentId);
            setMyPlayerId(socketService.socket?.id || 'YOU');
            setOpponentPlayerId(opponentId);
            
            // Select stadium synced from server
            const syncedGround = (groundIndex !== undefined && STADIUMS[groundIndex]) ? STADIUMS[groundIndex] : STADIUMS[Math.floor(Math.random() * STADIUMS.length)];
            setSelectedGround(syncedGround);
            setSettings(prev => ({ ...prev, mode: isBot ? 'VS_AI' : 'MULTIPLAYER' }));

            setYouState({
              name: 'YOU',
              avatar: 'helmet',
              runs: 0,
              wickets: 0,
              overs: 0.0,
              ballsBowled: 0,
              history: [],
              fourCount: 0,
              sixCount: 0,
              dotsCount: 0,
            });
            setAiState({
              name: opponentName || 'OPPONENT',
              avatar: 'robot', // maybe change to generic player avatar later
              runs: 0,
              wickets: 0,
              overs: 0.0,
              ballsBowled: 0,
              history: [],
              fourCount: 0,
              sixCount: 0,
              dotsCount: 0,
            });

            setMultiplayerOpponentName(opponentName || 'OPPONENT');
            setTossCallerId(firstStrikerId);
            setIsBotToss(isBot || false);
            setActiveScreen('TOSS');
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          coins={coins}
          playerLevel={playerLevel}
          xpProgress={xpProgress}
          stats={stats}
          stadiums={STADIUMS}
          dailyStreak={dailyStreak}
          showDailyReward={showDailyReward}
          dailyRewardAmount={dailyRewardAmount}
          onClaimDailyReward={claimDailyReward}
          onSpendCoins={(amount) => updateProfile({ coins: coins - amount })}
          playerName={profile?.displayName || user?.displayName || 'Player'}
          playerAvatar={profile?.photoURL || user?.photoURL || ''}
        />
      ) : (
        <GameScreen
          settings={settings}
          coins={coins}
          playerLevel={playerLevel}
          xpProgress={xpProgress}
          selectedGround={selectedGround}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          isRulesOpen={isRulesOpen}
          setIsRulesOpen={setIsRulesOpen}
          handleToggleMute={handleToggleMute}
          youState={youState}
          aiState={aiState}
          emojiEvent={emojiEvent}
          isCurrentPowerplay={isCurrentPowerplay}
          currentStrike={currentStrike}
          turnTimer={turnTimer}
          activeScreen={activeScreen}
          phase={phase}
          isRolling={isRolling}
          youTileIndex={youTileIndex}
          aiTileIndex={aiTileIndex}
          selectedTactic={selectedTactic}
          setSelectedTactic={setSelectedTactic}
          handleActionSubmit={handleActionSubmit}
          myTurnAction={myTurnAction}
          opponentTurnAction={opponentTurnAction}
          multiplayerRoomId={multiplayerRoomId}
          showDiceModal={showDiceModal}
          diceVal={diceVal}
          landedTileInfo={landedTileInfo}
          handleRestartMatch={handleRestartMatch}
          handleExitToLobby={handleExitToLobby}
          targetRuns={targetRuns}
          setSettings={setSettings}
          setEmojiEvent={setEmojiEvent}
        />
      )}
    </div>
  );
}
