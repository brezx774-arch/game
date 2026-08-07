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
  // Settings
  const [settings, setSettings] = useState<GameSettings>({
    maxOvers: 5,
    maxWickets: 10,
    mode: 'VS_AI',
    soundEnabled: true,
    aiDifficulty: 'MEDIUM',
  });

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
  const [activeScreen, setActiveScreen] = useState<'LOBBY' | 'GAME'>('LOBBY');
  const [selectedGround, setSelectedGround] = useState<Ground>(STADIUMS[0]);
  const [currentStrike, setCurrentStrike] = useState<'YOU' | 'AI'>('YOU');
  const [phase, setPhase] = useState<GamePhase>('INNINGS_1');
  const [targetRuns, setTargetRuns] = useState<number | undefined>(undefined);
  const [currentTileIndex, setCurrentTileIndex] = useState<number>(14); // Landed on FH at bottom right
  const [selectedTactic, setSelectedTactic] = useState<TacticMode>('ROTATE');
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [isFreeHit, setIsFreeHit] = useState<boolean>(false);

  // Dice Modal state
  const [showDiceModal, setShowDiceModal] = useState<boolean>(false);
  const [diceVal, setDiceVal] = useState<number>(3);
  const [landedTileInfo, setLandedTileInfo] = useState<BoardTile | null>(null);

  // Commentary text
  const [commentaryMsg, setCommentaryMsg] = useState<string>('You worked away for one.');
  const [commentarySubMsg, setCommentarySubMsg] = useState<string>('Powerplay doubles it!');

  // Player Profile State (Persistent)
  const [coins, setCoins] = useState<number>(() => {
    return parseInt(localStorage.getItem('cricket_coins') || '150', 10);
  });
  const [xp, setXp] = useState<number>(() => {
    return parseInt(localStorage.getItem('cricket_xp') || '450', 10);
  });
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('cricket_stats');
    return saved ? JSON.parse(saved) : { matchesPlayed: 0, matchesWon: 0, totalRuns: 0, totalWickets: 0, highestScore: 0 };
  });

  const [dailyStreak, setDailyStreak] = useState<number>(() => {
    return parseInt(localStorage.getItem('cricket_daily_streak') || '0', 10);
  });
  const [lastLoginDate, setLastLoginDate] = useState<string>(() => {
    return localStorage.getItem('cricket_last_login') || '';
  });
  const [showDailyReward, setShowDailyReward] = useState<boolean>(false);
  const [dailyRewardAmount, setDailyRewardAmount] = useState<number>(0);

  // Persist Profile
  useEffect(() => {
    localStorage.setItem('cricket_coins', coins.toString());
    localStorage.setItem('cricket_xp', xp.toString());
    localStorage.setItem('cricket_stats', JSON.stringify(stats));
  }, [coins, xp, stats]);

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
      
      localStorage.setItem('cricket_daily_streak', newStreak.toString());
      localStorage.setItem('cricket_last_login', today);
    }
  }, [lastLoginDate, dailyStreak]);

  const claimDailyReward = () => {
    soundFx.playCoins();
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
    const newMuted = !settings.soundEnabled;
    setSettings((prev) => ({ ...prev, soundEnabled: !newMuted }));
    soundFx.setMuted(newMuted);
  };

  // Helper: check powerplay status (Overs 1 & 2 are powerplays)
  const isPowerplayActive = (balls: number) => {
    return balls < 12; // first 2 overs
  };

  const activePlayer = currentStrike === 'YOU' ? youState : aiState;
  const isCurrentPowerplay = isPowerplayActive(activePlayer.ballsBowled);

  // Restart Fresh Match
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
    setCurrentTileIndex(0);
    setIsFreeHit(false);
    setCommentaryMsg('Match started! Select your shot tactic and ROLL to begin.');
    setCommentarySubMsg('Powerplay active! Overs 1 & 2 double all run outcomes!');
  };

  // Main Dice Roll Handler
  const handleRoll = useCallback(() => {
    if (isRolling || phase === 'MATCH_OVER') return;

    setIsRolling(true);
    soundFx.playDiceRoll();

    // Determine dice roll value based on shot tactic
    let roll = 1;
    if (selectedTactic === 'DEFEND') {
      const defendOpts = [1, 1, 2, 2, 3];
      roll = defendOpts[Math.floor(Math.random() * defendOpts.length)];
    } else if (selectedTactic === 'ROTATE') {
      const rotateOpts = [1, 2, 3, 4];
      roll = rotateOpts[Math.floor(Math.random() * rotateOpts.length)];
    } else { // ATTACK
      const attackOpts = [2, 3, 4, 5, 6];
      roll = attackOpts[Math.floor(Math.random() * attackOpts.length)];
    }

    setDiceVal(roll);

    // Calculate new position on circular track
    const nextIndex = (currentTileIndex + roll) % BOARD_TILES.length;
    const landedTile = BOARD_TILES[nextIndex];
    setLandedTileInfo(landedTile);

    // Show dice animation modal briefly
    setShowDiceModal(true);

    setTimeout(() => {
      setCurrentTileIndex(nextIndex);
      setShowDiceModal(false);
      setIsRolling(false);

      // Process Tile Outcome
      resolveOutcome(landedTile, roll);
    }, 700);
  }, [currentTileIndex, isRolling, phase, selectedTactic]);

  // Resolve outcome of the landed tile
  const resolveOutcome = (tile: BoardTile, rollVal: number) => {
    let runsEarned = 0;
    let isWicketOut = false;
    let isWide = false;
    let nextFreeHit = false;
    let cMsg = '';
    let cSub = '';

    const isBattingUser = currentStrike === 'YOU';
    const currentPlayerState = isBattingUser ? youState : aiState;
    const powerplayNow = isPowerplayActive(currentPlayerState.ballsBowled);

    switch (tile.type) {
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
          const catchProb = selectedTactic === 'DEFEND' ? 0.2 : selectedTactic === 'ATTACK' ? 0.7 : 0.4;
          if (Math.random() < catchProb) {
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
        // User Batting Rewards
        if (runs >= 4) {
          setCoins(c => c + runs * 2);
          setXp(x => x + 10);
        } else if (runs > 0) {
          setCoins(c => c + runs);
          setXp(x => x + 2);
        }
      } else if (settings.mode === 'VS_AI') {
        // User Bowling Rewards (AI is batting)
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

      // Calculate overs e.g. 5 balls = 0.5, 6 balls = 1.0, 7 balls = 1.1
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

      // Check Innings Switch or Match Over
      const totalLegalBalls = settings.maxOvers * 6;
      const isInningsFinished = newLegalBalls >= totalLegalBalls || newWickets >= settings.maxWickets;

      if (phase === 'INNINGS_1') {
        if (isInningsFinished) {
          setTimeout(() => {
            setTargetRuns(newRuns + 1);
            setPhase('INNINGS_2');
            setCurrentStrike(isUser ? 'AI' : 'YOU');
            setCommentaryMsg(`INNINGS BREAK! Target for 2nd Innings is ${newRuns + 1} runs.`);
            setCommentarySubMsg(`Require ${newRuns + 1} runs from ${settings.maxOvers} overs to win.`);
          }, 1000);
        }
      } else if (phase === 'INNINGS_2') {
        // Check if target chased down
        if (newRuns >= (targetRuns || 0)) {
          setTimeout(() => {
            setPhase('MATCH_OVER');
            const userWon = isUser;
            if (userWon) {
              setCoins(c => c + 150); // Win bonus
              setXp(x => x + 200);
            } else {
              setCoins(c => c + 50); // Loss consolation
              setXp(x => x + 50);
            }
            setStats(s => ({
              ...s,
              matchesPlayed: s.matchesPlayed + 1,
              matchesWon: s.matchesWon + (userWon ? 1 : 0),
              totalRuns: s.totalRuns + (isUser ? newRuns : youState.runs),
              totalWickets: s.totalWickets + (isUser ? newWickets : youState.wickets),
              highestScore: Math.max(s.highestScore, isUser ? newRuns : youState.runs)
            }));
          }, 1000);
        } else if (isInningsFinished) {
          setTimeout(() => {
            setPhase('MATCH_OVER');
            const userWon = !isUser;
            if (userWon) {
              // User defended successfully
              setCoins(c => c + 150); // Win bonus
              setXp(x => x + 200);
            } else {
              setCoins(c => c + 50); // Loss consolation
              setXp(x => x + 50);
            }
            setStats(s => ({
              ...s,
              matchesPlayed: s.matchesPlayed + 1,
              matchesWon: s.matchesWon + (userWon ? 1 : 0),
              totalRuns: s.totalRuns + (isUser ? newRuns : youState.runs),
              totalWickets: s.totalWickets + (isUser ? newWickets : youState.wickets),
              highestScore: Math.max(s.highestScore, isUser ? newRuns : youState.runs)
            }));
          }, 1000);
        }
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

  // AI Turn Auto-play Trigger
  useEffect(() => {
    if (phase !== 'MATCH_OVER' && currentStrike === 'AI' && settings.mode === 'VS_AI' && !isRolling) {
      const timer = setTimeout(() => {
        // AI selects tactic dynamically based on target/runrate
        const aiTactics: TacticMode[] = ['DEFEND', 'ROTATE', 'ATTACK'];
        const randomTactic = aiTactics[Math.floor(Math.random() * aiTactics.length)];
        setSelectedTactic(randomTactic);
        handleRoll();
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [currentStrike, isRolling, phase, settings.mode, handleRoll]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans flex flex-col justify-between selection:bg-amber-500 selection:text-stone-950 relative overflow-x-hidden">
      {/* Background Stadium Glow & Vignette */}
      <div className={`fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${activeScreen === 'GAME' ? selectedGround.gradientClass : 'from-amber-950/20 via-stone-950 to-black'} pointer-events-none transition-colors duration-1000`} />

      {activeScreen === 'LOBBY' ? (
        <LobbyScreen 
          onStart={(ground) => {
            setSelectedGround(ground);
            handleRestartMatch();
            setActiveScreen('GAME');
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
          <Scoreboard
            youState={youState}
            aiState={aiState}
            currentStrike={currentStrike}
            phase={phase}
            maxOvers={settings.maxOvers}
            isPowerplay={isCurrentPowerplay}
            targetRuns={targetRuns}
          />

          {/* Center Circular Cricket Board */}
          <CricketBoard
            currentTileIndex={currentTileIndex}
            isRolling={isRolling}
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
          <ActionControls
            selectedTactic={selectedTactic}
            onSelectTactic={setSelectedTactic}
            onRoll={handleRoll}
            isRolling={isRolling}
            disabled={phase === 'MATCH_OVER' || (currentStrike === 'AI' && settings.mode === 'VS_AI')}
          />
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
        onExitToLobby={() => setActiveScreen('LOBBY')}
      />

      {/* Match End Summary Modal */}
      <MatchEndModal
        isOpen={phase === 'MATCH_OVER' && activeScreen === 'GAME'}
        youState={youState}
        aiState={aiState}
        targetRuns={targetRuns}
        onPlayAgain={handleRestartMatch}
        onExitToLobby={() => setActiveScreen('LOBBY')}
      />
    </div>
  );
}
