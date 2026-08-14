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
import { LobbyScreen } from './components/LobbyScreen';
import { TossScreen } from './components/TossScreen';
import { MatchPlayersBanner } from './components/MatchPlayersBanner';

import { LoginScreen } from './components/LoginScreen';
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
  // Self-Hosted Capacitor Updater Init
  useEffect(() => {
    const checkForUpdates = async () => {
      if (!Capacitor.isNativePlatform()) return;
      try {
        await CapacitorUpdater.notifyAppReady();
        
        // Check our VPS for updates
        const SERVER_URL = import.meta.env.VITE_SERVER_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
        const response = await fetch(`${SERVER_URL}/api/check-update`);
        const data = await response.json();
        
        const currentVersion = localStorage.getItem('app_version') || '1.0.0';
        
        if (data.url && data.version !== currentVersion) {
          console.log('Downloading new update:', data.version);
          const version = await CapacitorUpdater.download({
            url: data.url,
            version: data.version,
          });
          localStorage.setItem('app_version', data.version);
          await CapacitorUpdater.set(version);
        }
      } catch (err) {
        console.error('Update check failed:', err);
      }
    };
    checkForUpdates();
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

  // Settings
  const [settings, setSettings] = useState<GameSettings>({
    maxOvers: 5,
    maxWickets: 10,
    mode: 'VS_AI',
    soundEnabled: true,
    aiDifficulty: 'MEDIUM',
  });

  // Multiplayer State
  const [multiplayerRoomId, setMultiplayerRoomId] = useState<string | null>(null);
  const [multiplayerOpponentId, setMultiplayerOpponentId] = useState<string | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string>('YOU');
  const [opponentPlayerId, setOpponentPlayerId] = useState<string>('AI');

  // Game Modals
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  // Player States matching screenshot initial state
  const [youState, setYouState] = useState<PlayerState>({
    name: 'YOU',
    avatar: 'helmet',
    runs: 12,
    wickets: 1,
    overs: 0.5,
    ballsBowled: 5,
    history: [
      { id: '1', overBall: '0.1', player: 'YOU', runs: 4, isWicket: false, isWide: false, isPowerplay: true, isFreeHit: false, tileLabel: '4 PP', commentary: 'Smashed away through covers for FOUR!' },
      { id: '2', overBall: '0.2', player: 'YOU', runs: 2, isWicket: false, isWide: false, isPowerplay: true, isFreeHit: false, tileLabel: '2 PP', commentary: 'Worked into the gap for two runs.' },
      { id: '3', overBall: '0.3', player: 'YOU', runs: 4, isWicket: false, isWide: false, isPowerplay: true, isFreeHit: false, tileLabel: '4 PP', commentary: 'Cracked away for FOUR!' },
      { id: '4', overBall: '0.4', player: 'YOU', runs: 0, isWicket: true, isWide: false, isPowerplay: true, isFreeHit: false, tileLabel: 'W', commentary: 'OUT! Caught at mid-on!' },
      { id: '5', overBall: '0.5', player: 'YOU', runs: 2, isWicket: false, isWide: false, isPowerplay: true, isFreeHit: false, tileLabel: '2 PP', commentary: 'Worked away for one. Powerplay doubles it!' },
    ],
    fourCount: 2,
    sixCount: 0,
    dotsCount: 0,
  });

  const [aiState, setAiState] = useState<PlayerState>({
    name: 'AI',
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

  // Game Engine State
  const [activeScreen, setActiveScreen] = useState<'LOBBY' | 'TOSS' | 'GAME'>('LOBBY');
  const [tossCallerId, setTossCallerId] = useState<string>('');
  const [multiplayerOpponentName, setMultiplayerOpponentName] = useState<string>('');
  const [isBotToss, setIsBotToss] = useState<boolean>(false);
  const [selectedGround, setSelectedGround] = useState<Ground>(STADIUMS[0]);
  const [currentStrike, setCurrentStrike] = useState<'YOU' | 'AI'>('YOU');
  const [phase, setPhase] = useState<GamePhase>('INNINGS_1');
  const [targetRuns, setTargetRuns] = useState<number | undefined>(undefined);
  const [youTileIndex, setYouTileIndex] = useState<number>(0);
  const [aiTileIndex, setAiTileIndex] = useState<number>(0);
  const [selectedTactic, setSelectedTactic] = useState<TacticMode>('ROTATE');
  const [emojiEvent, setEmojiEvent] = useState<{player: 'YOU'|'AI', emoji: string, id: number} | null>(null);
  
      
  const [isFreeHit, setIsFreeHit] = useState<boolean>(false);
  const [myTurnAction, setMyTurnAction] = useState<{tactic: TacticMode, roll: number, catchRand?: number} | null>(null);
  const [opponentTurnAction, setOpponentTurnAction] = useState<{tactic: TacticMode, roll: number, catchRand?: number} | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [turnTimer, setTurnTimer] = useState<number>(10);


  // Dice Modal state
  const [showDiceModal, setShowDiceModal] = useState<boolean>(false);
  const [diceVal, setDiceVal] = useState<number>(3);
  const [landedTileInfo, setLandedTileInfo] = useState<BoardTile | null>(null);

  // Commentary text
  const [commentaryMsg, setCommentaryMsg] = useState<string>('You worked away for one.');
  const [commentarySubMsg, setCommentarySubMsg] = useState<string>('Powerplay doubles it!');

  // Player Profile State (Firestore Sync)
  const { profile, updateProfile, profileLoading } = useProfile(user);
  
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

  const [showDailyReward, setShowDailyReward] = useState<boolean>(false);
  const [dailyRewardAmount, setDailyRewardAmount] = useState<number>(0);

  // Daily Reward Logic
  useEffect(() => {
    const today = new Date().toDateString();
    if (lastLoginDate !== today) {
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
      setDailyStreak(newStreak);
      setLastLoginDate(today);
      setShowDailyReward(true);
      
      // Persisted via updateProfile
    }
  }, [lastLoginDate, dailyStreak]);

  const claimDailyReward = () => {
    soundFx.playPowerplayChime();
    setCoins(c => c + dailyRewardAmount);
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
  const isPowerplayActive = (balls: number) => {
    return balls < 12; // first 2 overs
  };

  const activePlayer = currentStrike === 'YOU' ? youState : aiState;
  const isCurrentPowerplay = isPowerplayActive(activePlayer.ballsBowled);

  // Restart Fresh Match
  
  const handleExitToLobby = () => {
    setActiveScreen('LOBBY');
    setPhase('MATCH_OVER');
            
    if (settings.mode === 'MULTIPLAYER' && multiplayerRoomId) {
      socketService.emit('player_action', {
        roomId: multiplayerRoomId,
        action: 'LEAVE',
        payload: {}
      });
      socketService.emit('cancel_matchmaking');
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

  // Submit Action (Dual-Roll System)
  const handleActionSubmit = useCallback(async (tactic?: TacticMode) => {
    if (isRolling || phase === 'MATCH_OVER') return;
    
    // Prevent multiple submissions
    if (currentStrike === 'YOU' && myTurnAction) return;
    if (currentStrike === 'AI' && opponentTurnAction) return;
    
    // Check if user is allowed to act
    if (settings.mode !== 'PASS_AND_PLAY' && currentStrike !== 'YOU') return;
    
    soundFx.playClick();
    const activeTactic = tactic || selectedTactic;
    
    try {
      const response = await fetch('/api/roll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tactic: activeTactic })
      });
      const data = await response.json();
      
      const action = { tactic: activeTactic, roll: data.roll, catchRand: data.catchRand };
      
      if (currentStrike === 'YOU') {
        setMyTurnAction(action);
        if (settings.mode === 'MULTIPLAYER' && multiplayerRoomId) {
          socketService.emit('player_action', {
            roomId: multiplayerRoomId,
            action: 'SUBMIT_TURN',
            payload: action
          });
        }
      } else {
        // It's Player 2 in Pass & Play
        setOpponentTurnAction(action);
      }
    } catch (err) {
      console.error('Failed to fetch roll', err);
    }
  }, [isRolling, phase, myTurnAction, opponentTurnAction, selectedTactic, settings.mode, multiplayerRoomId, currentStrike]);

  // Handle AI turn action
  useEffect(() => {
    if (activeScreen === 'GAME' && phase !== 'MATCH_OVER' && settings.mode === 'VS_AI' && !opponentTurnAction) {
      if (currentStrike !== 'AI') return; // Only AI batter takes action
      
      const timer = setTimeout(async () => {
        const tactics: TacticMode[] = ['DEFEND', 'ROTATE', 'ATTACK'];
        let aiTactic: TacticMode = tactics[Math.floor(Math.random() * tactics.length)];
        
        try {
          const response = await fetch('/api/roll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tactic: aiTactic })
          });
          const data = await response.json();
          setOpponentTurnAction({ tactic: aiTactic, roll: data.roll, catchRand: data.catchRand });
        } catch (err) {
          console.error('Failed to fetch AI roll', err);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeScreen, phase, settings.mode, currentStrike, opponentTurnAction]);

  // Turn timer countdown and auto-roll
  useEffect(() => {
    if (activeScreen !== 'GAME' || phase === 'MATCH_OVER' || isRolling) return;
    
    const batterAction = currentStrike === 'YOU' ? myTurnAction : opponentTurnAction;
    if (batterAction) return; // Stop timer if batter has acted

    const timer = setInterval(() => {
      setTurnTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeScreen, phase, isRolling, myTurnAction, opponentTurnAction, currentStrike]);

  // Handle timer actions
  useEffect(() => {
    if (activeScreen !== 'GAME' || phase === 'MATCH_OVER' || isRolling) return;
    
    if (turnTimer === 0 && currentStrike === 'YOU' && !myTurnAction) {
       handleActionSubmit('ROTATE');
    } else if (turnTimer < -4 && settings.mode === 'MULTIPLAYER' && currentStrike !== 'YOU' && !opponentTurnAction) {
       setSettings(s => ({ ...s, mode: 'VS_AI' }));
       setCommentaryMsg('Opponent timed out.');
       setCommentarySubMsg('AI took over!');
       setTurnTimer(0);
    }
  }, [turnTimer, myTurnAction, opponentTurnAction, activeScreen, phase, isRolling, currentStrike, handleActionSubmit, settings.mode]);

  // Resolve action when ready
  useEffect(() => {
    const batterAction = currentStrike === 'YOU' ? myTurnAction : opponentTurnAction;
    
    if (batterAction && !isRolling && activeScreen === 'GAME' && phase !== 'MATCH_OVER') {
      setIsRolling(true);
      soundFx.playDiceRoll();
      
      const combinedRoll = batterAction.roll;
      setDiceVal(combinedRoll);
      
      const isUser = currentStrike === 'YOU';
      const currentIndex = isUser ? youTileIndex : aiTileIndex;
      let newIndex = (currentIndex + combinedRoll) % 32;
      
      const landedTile = BOARD_TILES.find(t => t.id === newIndex) || BOARD_TILES[0];
      setLandedTileInfo(landedTile);
      setShowDiceModal(true);
      
      setTimeout(() => {
        setShowDiceModal(false);
        if (isUser) setYouTileIndex(newIndex);
        else setAiTileIndex(newIndex);

        resolveOutcome(landedTile, combinedRoll, batterAction.tactic, batterAction.catchRand || Math.random(), isUser);
        setMyTurnAction(null);
        setOpponentTurnAction(null);
        setTurnTimer(20);
        setIsRolling(false);
      }, 2000); 
    }
  }, [myTurnAction, opponentTurnAction, isRolling, activeScreen, phase, youTileIndex, aiTileIndex, currentStrike]);

// Resolve outcome of the landed tile
  const resolveOutcome = (tile: BoardTile, rollVal: number, activeTactic: TacticMode, catchRand: number = Math.random(), isUser: boolean) => {
    let runsEarned = 0;
    let isWicketOut = false;
    let isWide = false;
    let nextFreeHit = false;
    let cMsg = '';
    let cSub = '';

    const isBattingUser = isUser;
    const currentPlayerState = isUser ? youState : aiState;
    const powerplayNow = isPowerplayActive(currentPlayerState.ballsBowled);

    switch (tile.type) {
      case 'START':
        cMsg = `${currentPlayerState.name} is at the start.`;
        soundFx.playBatHit(false);
        break;
      case 'RUN_1':
        runsEarned = 1;
        if (powerplayNow) {
          runsEarned *= 2;
          cSub = 'Powerplay doubles it! (+2 runs)';
        }
        cMsg = `${currentPlayerState.name} worked the ball away for ${runsEarned} run${runsEarned > 1 ? 's' : ''}.`;
        soundFx.playBatHit(false);
        break;

      case 'RUN_2':
        runsEarned = 2;
        if (powerplayNow) {
          runsEarned *= 2;
          cSub = 'Powerplay doubles it! (+4 runs)';
        }
        cMsg = `Nicely placed into deep mid-wicket for ${runsEarned} runs!`;
        soundFx.playBatHit(false);
        break;

      case 'RUN_3':
        runsEarned = 3;
        if (powerplayNow) {
          runsEarned *= 2;
          cSub = 'Powerplay doubles it! (+6 runs)';
        }
        cMsg = `Great running between the wickets! Took ${runsEarned} runs!`;
        soundFx.playBatHit(false);
        break;

      case 'RUN_4':
        runsEarned = 4;
        if (powerplayNow) {
          runsEarned *= 2;
          cSub = 'Powerplay doubles it! (+8 runs)';
        }
        cMsg = `SMASHED AWAY FOR FOUR! Pure timing!`;
        soundFx.playBatHit(true);
        break;

      case 'RUN_6':
        runsEarned = 6;
        if (powerplayNow) {
          runsEarned *= 2;
          cSub = 'Powerplay doubles it! (+12 runs)';
        }
        cMsg = `MASSIVE HIT OVER THE BOUNDARY FOR SIX! What a shot!`;
        soundFx.playBatHit(true);
        break;

      case 'DOT':
        runsEarned = 0;
        cMsg = `Dot ball. Defended cleanly to the fielder.`;
        soundFx.playBatHit(false);
        break;

      case 'WICKET':
        if (isFreeHit) {
          runsEarned = 1;
          cMsg = `SURVIVED FREE HIT! Wicket attempt negated! (+1 run)`;
          cSub = `Free Hit protected your wicket!`;
          soundFx.playBatHit(false);
        } else {
          isWicketOut = true;
          cMsg = `OUT! Clean bowled / caught in the deep! Wicket falls!`;
          soundFx.playWicket();
        }
        break;

      case 'CATCH':
        if (isFreeHit) {
          runsEarned = 2;
          cMsg = `Free Hit active! Dropped in the deep for 2 runs!`;
          soundFx.playBatHit(false);
        } else {
          // 50% catch probability unless DEFEND tactic
          const catchProb = activeTactic === 'DEFEND' ? 0.2 : activeTactic === 'ATTACK' ? 0.7 : 0.4;
          if (catchRand < catchProb) {
            isWicketOut = true;
            cMsg = `OUT! High ball taken cleanly by the fielder!`;
            soundFx.playWicket();
          } else {
            runsEarned = 2;
            cMsg = `DROPPED! Fielder spills the catch! Scammed 2 runs!`;
            cSub = `Lucky escape!`;
            soundFx.playBatHit(false);
          }
        }
        break;

      case 'WIDE':
        runsEarned = 1;
        isWide = true;
        nextFreeHit = true;
        cMsg = `WIDE BALL! Extra run awarded + Extra delivery!`;
        cSub = `Free Hit awarded for next ball!`;
        soundFx.playBatHit(false);
        break;

      case 'FREE_HIT':
        runsEarned = 1;
        nextFreeHit = true;
        cMsg = `Landed on FREE HIT! Next roll cannot result in a wicket!`;
        cSub = `Free Hit Shield Active!`;
        soundFx.playBatHit(false);
        break;

      case 'POWER_ROLL':
        runsEarned = 3;
        cMsg = `POWER ROLL! Accelerated down the track for 3 runs!`;
        cSub = `Bonus Momentum!`;
        soundFx.playPowerplayChime();
        break;

      case 'POWER_SHOT':
        runsEarned = 6;
        cMsg = `POWER SHOT! Dispatched straight over long-on for SIX!`;
        cSub = `+6 Bonus Runs!`;
        soundFx.playPowerplayChime();
        soundFx.playCrowdCheer(true);
        break;
    }

    setIsFreeHit(nextFreeHit);
    setCommentaryMsg(cMsg);
    setCommentarySubMsg(cSub);

    // Update Player Scores & Ball counts
    updatePlayerScore(isBattingUser, runsEarned, isWicketOut, isWide, powerplayNow, tile.label, cMsg, cSub);
  };

  // Update Score and Check Innings Progress
  const updatePlayerScore = (
    isUser: boolean,
    runs: number,
    isWicket: boolean,
    isWide: boolean,
    isPowerplay: boolean,
    tileLabel: string,
    commentary: string,
    subCommentary?: string
  ) => {
    
    // Rewards System
    if (phase !== 'MATCH_OVER') {
      if (isUser) {
        if (runs >= 4) {
          setCoins(c => c + runs * 2);
          setXp(x => x + 10);
        } else if (runs > 0) {
          setCoins(c => c + runs);
          setXp(x => x + 2);
        }
      } else if (settings.mode === 'VS_AI') {
        if (isWicket) {
          setCoins(c => c + 25);
          setXp(x => x + 30);
        } else if (runs === 0 && !isWide) {
          setCoins(c => c + 2);
          setXp(x => x + 5);
        }
      }
    }

    const updateFn = isUser ? setYouState : setAiState;

    updateFn((prev) => {
      const newRuns = prev.runs + runs;
      const newWickets = isWicket ? prev.wickets + 1 : prev.wickets;
      const newLegalBalls = isWide ? prev.ballsBowled : prev.ballsBowled + 1;

      const oversVal = Math.floor(newLegalBalls / 6) + (newLegalBalls % 6) / 10;
      const overBallStr = `${Math.floor(prev.ballsBowled / 6)}.${(prev.ballsBowled % 6) + 1}`;

      const newRecord: DeliveryRecord = {
        id: Date.now().toString(),
        overBall: overBallStr,
        player: isUser ? 'YOU' : 'AI',
        runs,
        isWicket,
        isWide,
        isPowerplay,
        isFreeHit,
        tileLabel: `${tileLabel}${isPowerplay ? ' PP' : ''}`,
        commentary,
        subCommentary,
      };

      const newHistory = [...prev.history, newRecord];

      const totalLegalBalls = settings.maxOvers * 6;
      const isCurrentFinished = newLegalBalls >= totalLegalBalls || newWickets >= settings.maxWickets;
      const otherState = isUser ? aiState : youState;
      const isOtherFinished = otherState.ballsBowled >= totalLegalBalls || otherState.wickets >= settings.maxWickets;

      if (isCurrentFinished && isOtherFinished) {
        setTimeout(() => {
          setPhase('MATCH_OVER');
          const userFinalRuns = isUser ? newRuns : youState.runs;
          const aiFinalRuns = !isUser ? newRuns : aiState.runs;
          const userWon = userFinalRuns >= aiFinalRuns;
          
          if (userWon) {
            setCoins(c => c + 150);
            setXp(x => x + 200);
          } else {
            setCoins(c => c + 50);
            setXp(x => x + 50);
          }
          setStats(s => ({
            ...s,
            matchesPlayed: s.matchesPlayed + 1,
            matchesWon: s.matchesWon + (userWon ? 1 : 0),
            totalRuns: s.totalRuns + userFinalRuns,
            totalWickets: s.totalWickets + (isUser ? newWickets : youState.wickets),
            highestScore: Math.max(s.highestScore, userFinalRuns)
          }));
        }, 1000);
      } else {
        setTimeout(() => {
           if (!isOtherFinished && (!isWide || isCurrentFinished)) {
              setCurrentStrike(isUser ? 'AI' : 'YOU');
           } else if (isCurrentFinished && !isOtherFinished) {
              setCurrentStrike(isUser ? 'AI' : 'YOU');
           }
        }, 500);
      }

      return {
        ...prev,
        runs: newRuns,
        wickets: newWickets,
        ballsBowled: newLegalBalls,
        overs: oversVal,
        history: newHistory,
        fourCount: runs === 4 || runs === 8 ? prev.fourCount + 1 : prev.fourCount,
        sixCount: runs === 6 || runs === 12 ? prev.sixCount + 1 : prev.sixCount,
        dotsCount: runs === 0 ? prev.dotsCount + 1 : prev.dotsCount,
      };
    });
  };

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
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (false && !user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans flex flex-col justify-between selection:bg-amber-500 selection:text-stone-950 relative overflow-x-hidden">
      {/* Background Stadium Glow & Vignette */}
      <div className={`fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${activeScreen === 'GAME' ? selectedGround.gradientClass : 'from-amber-950/20 via-stone-950 to-black'} pointer-events-none transition-colors duration-1000`} />

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
        <div className="relative z-10 flex-1 flex flex-col justify-between w-full max-w-2xl mx-auto pb-4">
          {/* Header */}
          <Header
            onOpenMenu={() => {
               setIsMenuOpen(true);
               // Add exit to lobby option in settings/menu in future, or let header handle it
            }}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenRules={() => setIsRulesOpen(true)}
            isMuted={!settings.soundEnabled}
            onToggleMute={handleToggleMute}
            coins={coins}
            playerLevel={playerLevel}
            xpProgress={xpProgress}
            selectedGround={selectedGround}
          />

          {/* Scoreboard */}
          <MatchPlayersBanner youState={youState} aiState={aiState} emojiEvent={emojiEvent} playerLevel={playerLevel} opponentLevel={settings.mode === 'MULTIPLAYER' ? 5 : 10} />
          <Scoreboard
            youState={youState}
            aiState={aiState}
            isPowerplay={isCurrentPowerplay}
            currentStrike={currentStrike}
            turnTimer={activeScreen === 'GAME' && phase !== 'MATCH_OVER' && !isRolling ? turnTimer : undefined}
          />

          {/* Center Circular Cricket Board */}
          <CricketBoard
            youTileIndex={youTileIndex}
            aiTileIndex={aiTileIndex}
            youIsRolling={isRolling && currentStrike === 'YOU'}
            aiIsRolling={isRolling && currentStrike !== 'YOU'}
            ground={selectedGround}
          />

          


          {/* Commentary Event Banner */}
          <CommentaryBanner
            message={commentaryMsg}
            subMessage={commentarySubMsg}
            isPowerplay={isCurrentPowerplay}
            isWicket={commentaryMsg.includes('OUT')}
          />

          {/* Ball-by-Ball Overs History */}
          <OversHistory history={activePlayer.history} />

          {/* Action Controls (Defend, Rotate, Attack, ROLL) */}
          <div className="flex flex-col items-center">
            <ActionControls
              selectedTactic={selectedTactic}
              onSelectTactic={setSelectedTactic}
              onRoll={() => handleActionSubmit()}
              isRolling={isRolling || (currentStrike === 'YOU' ? myTurnAction !== null : opponentTurnAction !== null)}
              disabled={phase === 'MATCH_OVER' || (settings.mode !== 'PASS_AND_PLAY' && currentStrike !== 'YOU')}
              showEmoji={!!multiplayerRoomId}
              isBatting={true}
              onSendEmoji={(emoji) => {
                if (multiplayerRoomId) {
                  socketService.emit('player_action', {
                    roomId: multiplayerRoomId,
                    action: 'EMOJI',
                    payload: { emoji }
                  });
                  setEmojiEvent({ player: 'YOU', emoji, id: Date.now() });
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Animated Roll Modal Overlay */}
      <DiceModal
        isOpen={showDiceModal}
        diceValue={diceVal}
        landedTile={landedTileInfo}
        tactic={selectedTactic}
      />

      {/* Rules Modal */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* Settings & Options Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen || isMenuOpen}
        onClose={() => {
          setIsSettingsOpen(false);
          setIsMenuOpen(false);
        }}
        settings={settings}
        onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
        onRestartMatch={handleRestartMatch}
        onExitToLobby={handleExitToLobby}
        isMultiplayer={!!multiplayerRoomId}
      />

      {/* Match End Summary Modal */}
      <MatchEndModal
        isOpen={phase === 'MATCH_OVER' && activeScreen === 'GAME'}
        youState={youState}
        aiState={aiState}
        targetRuns={targetRuns}
        onPlayAgain={multiplayerRoomId ? undefined : handleRestartMatch}
        onExitToLobby={handleExitToLobby}
      />
    </div>
  );
}
