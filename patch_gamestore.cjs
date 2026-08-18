const fs = require('fs');
const path = 'src/state/gameStore.ts';
let code = fs.readFileSync(path, 'utf8');

const newInterfaceVars = `
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
`;

const newStateVars = `
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
`;

code = code.replace('resetGame: () => void;', newInterfaceVars + '  resetGame: () => void;');
code = code.replace('resetGame: () => set((state) => ({', newStateVars + '  resetGame: () => set((state) => ({');

fs.writeFileSync(path, code);
