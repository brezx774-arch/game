const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const useGameStoreImport = "import { useGameStore } from './state/gameStore';\n";
const useGameEngineImport = "import { useGameEngine } from './game/engine/useGameEngine';\n";

let newContent = content;

if (!newContent.includes('useGameStore')) {
  newContent = useGameStoreImport + newContent;
}
if (!newContent.includes('useGameEngine')) {
  newContent = useGameEngineImport + newContent;
}

const stateRegex = /const \[.*?\] = useState<.*?>\(.*?\);\n/g;
const stateRegex2 = /const \[.*?\] = useState\(.*?\);\n/g;

// remove useState hooks except user, authLoading, etc.
const toRemove = [
  "const [settings, setSettings]",
  "const [multiplayerRoomId, setMultiplayerRoomId]",
  "const [multiplayerOpponentId, setMultiplayerOpponentId]",
  "const [myPlayerId, setMyPlayerId]",
  "const [opponentPlayerId, setOpponentPlayerId]",
  "const [isMenuOpen, setIsMenuOpen]",
  "const [isSettingsOpen, setIsSettingsOpen]",
  "const [isRulesOpen, setIsRulesOpen]",
  "const [youState, setYouState]",
  "const [aiState, setAiState]",
  "const [activeScreen, setActiveScreen]",
  "const [tossCallerId, setTossCallerId]",
  "const [multiplayerOpponentName, setMultiplayerOpponentName]",
  "const [isBotToss, setIsBotToss]",
  "const [selectedGround, setSelectedGround]",
  "const [currentStrike, setCurrentStrike]",
  "const [phase, setPhase]",
  "const [targetRuns, setTargetRuns]",
  "const [youTileIndex, setYouTileIndex]",
  "const [aiTileIndex, setAiTileIndex]",
  "const [selectedTactic, setSelectedTactic]",
  "const [emojiEvent, setEmojiEvent]",
  "const [isFreeHit, setIsFreeHit]",
  "const [myTurnAction, setMyTurnAction]",
  "const [opponentTurnAction, setOpponentTurnAction]",
  "const [isRolling, setIsRolling]",
  "const [turnTimer, setTurnTimer]",
  "const [showDiceModal, setShowDiceModal]",
  "const [diceVal, setDiceVal]",
  "const [landedTileInfo, setLandedTileInfo]",
  "const [commentaryMsg, setCommentaryMsg]",
  "const [commentarySubMsg, setCommentarySubMsg]",
  "const [showDailyReward, setShowDailyReward]",
  "const [dailyRewardAmount, setDailyRewardAmount]",
];

let lines = newContent.split('\n');
let filteredLines = [];
for (let line of lines) {
  let skip = false;
  for (let rm of toRemove) {
    if (line.includes(rm)) {
      skip = true;
      break;
    }
  }
  if (!skip) {
    filteredLines.push(line);
  }
}

let modifiedContent = filteredLines.join('\n');

const storeDestructure = `
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
`;

const insertIndex = modifiedContent.indexOf("const { profile, updateProfile, profileLoading } = useProfile(user);");
if (insertIndex !== -1) {
  const nextLineIndex = modifiedContent.indexOf('\n', insertIndex) + 1;
  modifiedContent = modifiedContent.slice(0, nextLineIndex) + storeDestructure + modifiedContent.slice(nextLineIndex);
}

// Now remove the handleActionSubmit, updatePlayerScore, resolveOutcome blocks.
// We'll use string replacement
function removeBlock(content, startString, endString) {
  const start = content.indexOf(startString);
  if (start === -1) return content;
  const end = content.indexOf(endString, start);
  if (end === -1) return content;
  return content.slice(0, start) + content.slice(end + endString.length);
}

modifiedContent = removeBlock(modifiedContent, "const isPowerplayActive =", "const isCurrentPowerplay = isPowerplayActive(currentStrike === 'YOU' ? youState.ballsBowled : aiState.ballsBowled);\n");
modifiedContent = removeBlock(modifiedContent, "const handleActionSubmit = useCallback(async (tactic?: TacticMode) => {", "}, [isRolling, phase, myTurnAction, opponentTurnAction, selectedTactic, settings.mode, multiplayerRoomId, currentStrike]);\n");
modifiedContent = removeBlock(modifiedContent, "// Handle AI turn action\n  useEffect(() => {", "}, [activeScreen, phase, settings.mode, currentStrike, opponentTurnAction]);\n");
modifiedContent = removeBlock(modifiedContent, "// Turn timer countdown and auto-roll\n  useEffect(() => {", "}, [activeScreen, phase, isRolling, myTurnAction, opponentTurnAction, currentStrike]);\n");
modifiedContent = removeBlock(modifiedContent, "// Handle timer actions\n  useEffect(() => {", "}, [turnTimer, myTurnAction, opponentTurnAction, activeScreen, phase, isRolling, currentStrike, handleActionSubmit, settings.mode]);\n");
modifiedContent = removeBlock(modifiedContent, "// Resolve action when ready\n  useEffect(() => {", "}, [myTurnAction, opponentTurnAction, isRolling, activeScreen, phase, youTileIndex, aiTileIndex, currentStrike]);\n");
modifiedContent = removeBlock(modifiedContent, "// Resolve outcome of the landed tile\n  const resolveOutcome = ", "updatePlayerScore(isBattingUser, runsEarned, isWicketOut, isWide, powerplayNow, tile.label, cMsg, cSub);\n  };\n");
modifiedContent = removeBlock(modifiedContent, "// Update Score and Check Innings Progress\n  const updatePlayerScore =", "}, 500);\n      }\n\n      return {\n        ...prev,\n        runs: newRuns,\n        wickets: newWickets,\n        ballsBowled: newLegalBalls,\n        history: newHistory,\n        fourCount: prev.fourCount + (runs === 4 ? 1 : 0),\n        sixCount: prev.sixCount + (runs === 6 ? 1 : 0),\n        dotsCount: prev.dotsCount + (runs === 0 && !isWide && !isWicket ? 1 : 0),\n      };\n    });\n  };\n");

fs.writeFileSync('src/App.tsx', modifiedContent);
console.log("Patched states in App.tsx!");
