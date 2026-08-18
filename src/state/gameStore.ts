import { create } from 'zustand';
import { PlayerState, GamePhase, Ground, TacticMode, BoardTile, GameSettings, GameMode } from '../types';

export const STADIUMS: Ground[] = [
  { id: 'g1', name: 'Wankhede', location: 'Mumbai', gradientClass: 'from-blue-900 to-indigo-900', pitchColorClass: 'bg-orange-200', grassColorClass: 'bg-emerald-800', pitchHex: '#fcd34d' },
  { id: 'g2', name: 'MCG', location: 'Melbourne', gradientClass: 'from-stone-800 to-stone-900', pitchColorClass: 'bg-amber-100', grassColorClass: 'bg-green-900', pitchHex: '#fef3c7' },
  { id: 'g3', name: 'Lords', location: 'London', gradientClass: 'from-sky-900 to-blue-900', pitchColorClass: 'bg-amber-50', grassColorClass: 'bg-green-700', pitchHex: '#fffbeb' },
  { id: 'g4', name: 'Eden', location: 'Kolkata', gradientClass: 'from-purple-900 to-indigo-900', pitchColorClass: 'bg-amber-200', grassColorClass: 'bg-emerald-700', pitchHex: '#fde68a' },
  { id: 'g5', name: 'Gabba', location: 'Brisbane', gradientClass: 'from-emerald-900 to-teal-900', pitchColorClass: 'bg-orange-100', grassColorClass: 'bg-green-800', pitchHex: '#ffedd5' },
];

const INITIAL_PLAYER_STATE: PlayerState = {
  name: 'Player',
  avatar: 'user',
  runs: 0,
  wickets: 0,
  overs: 0,
  ballsBowled: 0,
  history: [],
  fourCount: 0,
  sixCount: 0,
  dotsCount: 0,
};

interface GameStore {
  // Config
  settings: GameSettings;
  setSettings: (s: Partial<GameSettings>) => void;
  
  // Game State
  activeScreen: 'LOBBY' | 'TOSS' | 'GAME';
  setActiveScreen: (s: 'LOBBY' | 'TOSS' | 'GAME') => void;
  
  phase: GamePhase;
  setPhase: (p: GamePhase) => void;
  
  selectedGround: Ground;
  setSelectedGround: (g: Ground) => void;
  
  currentStrike: 'YOU' | 'AI';
  setCurrentStrike: (s: 'YOU' | 'AI') => void;
  
  targetRuns: number | undefined;
  setTargetRuns: (r: number | undefined) => void;
  
  // Player States
  youState: PlayerState;
  setYouState: (s: Partial<PlayerState>) => void;
  
  aiState: PlayerState;
  setAiState: (s: Partial<PlayerState>) => void;
  
  // Turn State
  selectedTactic: TacticMode;
  setSelectedTactic: (t: TacticMode) => void;
  
  youTileIndex: number;
  setYouTileIndex: (i: number) => void;
  
  aiTileIndex: number;
  setAiTileIndex: (i: number) => void;
  
  isFreeHit: boolean;
  setIsFreeHit: (b: boolean) => void;
  
  // Multiplayer State
  multiplayerRoomId: string | null;
  setMultiplayerRoomId: (id: string | null) => void;
  
  myPlayerId: string;
  setMyPlayerId: (id: string) => void;
  
  opponentPlayerId: string;
  setOpponentPlayerId: (id: string) => void;
  
  multiplayerOpponentName: string;
  setMultiplayerOpponentName: (name: string) => void;
  
  
  isMenuOpen: boolean;
  setIsMenuOpen: (b: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (b: boolean) => void;
  isRulesOpen: boolean;
  setIsRulesOpen: (b: boolean) => void;
  tossCallerId: string;
  setTossCallerId: (id: string) => void;
  isBotToss: boolean;
  setIsBotToss: (b: boolean) => void;
  emojiEvent: {player: 'YOU'|'AI', emoji: string, id: number} | null;
  setEmojiEvent: (e: {player: 'YOU'|'AI', emoji: string, id: number} | null) => void;
  myTurnAction: {tactic: TacticMode, roll: number, catchRand?: number} | null;
  setMyTurnAction: (a: {tactic: TacticMode, roll: number, catchRand?: number} | null) => void;
  opponentTurnAction: {tactic: TacticMode, roll: number, catchRand?: number} | null;
  setOpponentTurnAction: (a: {tactic: TacticMode, roll: number, catchRand?: number} | null) => void;
  isRolling: boolean;
  setIsRolling: (b: boolean) => void;
  turnTimer: number;
  setTurnTimer: (t: number | ((prev: number) => number)) => void;
  showDiceModal: boolean;
  setShowDiceModal: (b: boolean) => void;
  diceVal: number;
  setDiceVal: (v: number) => void;
  landedTileInfo: BoardTile | null;
  setLandedTileInfo: (t: BoardTile | null) => void;
  commentaryMsg: string;
  setCommentaryMsg: (s: string) => void;
  commentarySubMsg: string;
  setCommentarySubMsg: (s: string) => void;
  showDailyReward: boolean;
  setShowDailyReward: (b: boolean) => void;
  dailyRewardAmount: number;
  setDailyRewardAmount: (n: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  settings: { maxOvers: 5, maxWickets: 10, mode: 'VS_AI', soundEnabled: true, aiDifficulty: 'MEDIUM' },
  setSettings: (s) => set((state) => ({ settings: { ...state.settings, ...s } })),
  
  activeScreen: 'LOBBY',
  setActiveScreen: (s) => set({ activeScreen: s }),
  
  phase: 'INNINGS_1',
  setPhase: (p) => set({ phase: p }),
  
  selectedGround: STADIUMS[0],
  setSelectedGround: (g) => set({ selectedGround: g }),
  
  currentStrike: 'YOU',
  setCurrentStrike: (s) => set({ currentStrike: s }),
  
  targetRuns: undefined,
  setTargetRuns: (r) => set({ targetRuns: r }),
  
  youState: { ...INITIAL_PLAYER_STATE, name: 'You', avatar: 'helmet' },
  setYouState: (s) => set((state) => ({ youState: { ...state.youState, ...s } })),
  
  aiState: { ...INITIAL_PLAYER_STATE, name: 'AI Bot', avatar: 'robot' },
  setAiState: (s) => set((state) => ({ aiState: { ...state.aiState, ...s } })),
  
  selectedTactic: 'ROTATE',
  setSelectedTactic: (t) => set({ selectedTactic: t }),
  
  youTileIndex: 0,
  setYouTileIndex: (i) => set({ youTileIndex: i }),
  
  aiTileIndex: 0,
  setAiTileIndex: (i) => set({ aiTileIndex: i }),
  
  isFreeHit: false,
  setIsFreeHit: (b) => set({ isFreeHit: b }),
  
  multiplayerRoomId: null,
  setMultiplayerRoomId: (id) => set({ multiplayerRoomId: id }),
  
  myPlayerId: 'YOU',
  setMyPlayerId: (id) => set({ myPlayerId: id }),
  
  opponentPlayerId: 'AI',
  setOpponentPlayerId: (id) => set({ opponentPlayerId: id }),
  
  multiplayerOpponentName: '',
  setMultiplayerOpponentName: (name) => set({ multiplayerOpponentName: name }),
  
  
  isMenuOpen: false,
  setIsMenuOpen: (b) => set({ isMenuOpen: b }),
  isSettingsOpen: false,
  setIsSettingsOpen: (b) => set({ isSettingsOpen: b }),
  isRulesOpen: false,
  setIsRulesOpen: (b) => set({ isRulesOpen: b }),
  tossCallerId: '',
  setTossCallerId: (id) => set({ tossCallerId: id }),
  isBotToss: false,
  setIsBotToss: (b) => set({ isBotToss: b }),
  emojiEvent: null,
  setEmojiEvent: (e) => set({ emojiEvent: e }),
  myTurnAction: null,
  setMyTurnAction: (a) => set({ myTurnAction: a }),
  opponentTurnAction: null,
  setOpponentTurnAction: (a) => set({ opponentTurnAction: a }),
  isRolling: false,
  setIsRolling: (b) => set({ isRolling: b }),
  turnTimer: 10,
  setTurnTimer: (t) => set((state) => ({ turnTimer: typeof t === 'function' ? t(state.turnTimer) : t })),
  showDiceModal: false,
  setShowDiceModal: (b) => set({ showDiceModal: b }),
  diceVal: 3,
  setDiceVal: (v) => set({ diceVal: v }),
  landedTileInfo: null,
  setLandedTileInfo: (t) => set({ landedTileInfo: t }),
  commentaryMsg: 'You worked away for one.',
  setCommentaryMsg: (s) => set({ commentaryMsg: s }),
  commentarySubMsg: 'Powerplay doubles it!',
  setCommentarySubMsg: (s) => set({ commentarySubMsg: s }),
  showDailyReward: false,
  setShowDailyReward: (b) => set({ showDailyReward: b }),
  dailyRewardAmount: 0,
  setDailyRewardAmount: (n) => set({ dailyRewardAmount: n }),
  resetGame: () => set((state) => ({
    phase: 'INNINGS_1',
    targetRuns: undefined,
    youTileIndex: 0,
    aiTileIndex: 0,
    isFreeHit: false,
    youState: { ...INITIAL_PLAYER_STATE, name: state.youState.name, avatar: state.youState.avatar },
    aiState: { ...INITIAL_PLAYER_STATE, name: state.aiState.name, avatar: state.aiState.avatar },
  })),
}));
