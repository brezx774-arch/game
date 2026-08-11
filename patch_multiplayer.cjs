const fs = require('fs');

// Read App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add new state variables
const stateVars = `
  const [turnTimer, setTurnTimer] = useState<number>(10);
  const [myTurnAction, setMyTurnAction] = useState<{tactic: TacticMode, roll: number} | null>(null);
  const [opponentTurnAction, setOpponentTurnAction] = useState<{tactic: TacticMode, roll: number} | null>(null);
`;
appCode = appCode.replace(
  "  const [isFreeHit, setIsFreeHit] = useState<boolean>(false);",
  "  const [isFreeHit, setIsFreeHit] = useState<boolean>(false);\n" + stateVars
);

// 2. Replace handleRoll with handleSubmitAction
const handleRollRegex = /\/\/ Main Dice Roll Handler[\s\S]*?(?=\/\/ Resolve outcome of the landed tile)/;
const handleSubmitActionCode = `
  // Submit Action (Dual-Roll System)
  const handleActionSubmit = useCallback((tactic?: TacticMode) => {
    if (isRolling || phase === 'MATCH_OVER' || myTurnAction) return;
    
    soundFx.playClick();
    const activeTactic = tactic || selectedTactic;
    
    let roll = 1;
    if (activeTactic === 'DEFEND') roll = [1, 1, 2, 2, 3][Math.floor(Math.random() * 5)];
    else if (activeTactic === 'ROTATE') roll = [1, 2, 3, 4][Math.floor(Math.random() * 4)];
    else if (activeTactic === 'ATTACK') roll = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
    else roll = Math.floor(Math.random() * 6) + 1;
    
    const action = { tactic: activeTactic, roll };
    setMyTurnAction(action);
    
    if (settings.mode === 'MULTIPLAYER' && multiplayerRoomId) {
      socketService.emit('player_action', {
        roomId: multiplayerRoomId,
        action: 'SUBMIT_TURN',
        payload: action
      });
    }
  }, [isRolling, phase, myTurnAction, selectedTactic, settings.mode, multiplayerRoomId]);

  // Handle AI turn action
  useEffect(() => {
    if (activeScreen === 'GAME' && phase !== 'MATCH_OVER' && settings.mode === 'VS_AI' && !opponentTurnAction) {
      const timer = setTimeout(() => {
        let aiTactic: TacticMode = 'ROTATE';
        if (currentStrike === 'AI') {
          aiTactic = 'ROTATE'; 
        } else {
          const bowOpts: TacticMode[] = ['FAST', 'SPIN', 'YORKER'];
          aiTactic = bowOpts[Math.floor(Math.random() * bowOpts.length)];
        }
        
        let roll = 1;
        if (aiTactic === 'DEFEND') roll = [1, 1, 2, 2, 3][Math.floor(Math.random() * 5)];
        else if (aiTactic === 'ROTATE') roll = [1, 2, 3, 4][Math.floor(Math.random() * 4)];
        else if (aiTactic === 'ATTACK') roll = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
        else roll = Math.floor(Math.random() * 6) + 1;

        setOpponentTurnAction({ tactic: aiTactic, roll });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeScreen, phase, settings.mode, currentStrike, opponentTurnAction]);

  // Turn timer countdown and auto-roll
  useEffect(() => {
    if (activeScreen !== 'GAME' || phase === 'MATCH_OVER' || isRolling) return;
    
    if (myTurnAction && opponentTurnAction) return;

    const timer = setInterval(() => {
      setTurnTimer(prev => {
        if (prev <= 1) {
           clearInterval(timer);
           // Auto-submit if haven't
           if (!myTurnAction) {
               const defaultTactic = currentStrike === 'YOU' ? 'ROTATE' : 'FAST';
               handleActionSubmit(defaultTactic);
           }
           return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeScreen, phase, isRolling, myTurnAction, opponentTurnAction, currentStrike, handleActionSubmit]);

  // Resolve both actions when ready
  useEffect(() => {
    if (myTurnAction && opponentTurnAction && !isRolling && activeScreen === 'GAME' && phase !== 'MATCH_OVER') {
      setIsRolling(true);
      soundFx.playDiceRoll();
      
      const batterAction = currentStrike === 'YOU' ? myTurnAction : opponentTurnAction;
      const bowlerAction = currentStrike === 'YOU' ? opponentTurnAction : myTurnAction;
      
      const combinedRoll = ((batterAction.roll + bowlerAction.roll) % 6) || 6;
      setDiceVal(combinedRoll);
      
      let newIndex = currentTileIndex + combinedRoll;
      if (newIndex > 36) newIndex -= 36;
      
      const landedTile = BOARD_TILES.find(t => t.id === newIndex) || BOARD_TILES[0];
      setLandedTileInfo(landedTile);
      setShowDiceModal(true);
      
      setTimeout(() => {
        setShowDiceModal(false);
        setCurrentTileIndex(newIndex);
        resolveOutcome(landedTile, combinedRoll, batterAction.tactic);
        setMyTurnAction(null);
        setOpponentTurnAction(null);
        setTurnTimer(10);
      }, 2000); // Extended a bit to see both actions resolved
    }
  }, [myTurnAction, opponentTurnAction, isRolling, activeScreen, phase, currentTileIndex, currentStrike]);

`;

appCode = appCode.replace(handleRollRegex, handleSubmitActionCode);

// 3. Update Socket logic for MULTIPLAYER
appCode = appCode.replace(
  "        } else if (data.action === 'ROLL') {",
  "        } else if (data.action === 'SUBMIT_TURN') {\n          setOpponentTurnAction(data.payload);\n        } else if (data.action === 'ROLL') {"
);

// 4. Update ActionControls in render
const actionControlsRegex = /<ActionControls[\s\S]*?\/>/;
const newActionControls = `
          <div className="flex flex-col items-center">
            {/* Timer visualizer */}
            {activeScreen === 'GAME' && phase !== 'MATCH_OVER' && !isRolling && (
              <div className="w-full max-w-xl mx-auto px-4 mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-stone-400">TURN TIMER</span>
                <div className="flex-1 mx-3 h-2 bg-stone-800 rounded-full overflow-hidden border border-stone-700">
                  <div 
                    className={\`h-full transition-all duration-1000 \${turnTimer <= 3 ? 'bg-rose-500' : 'bg-amber-500'}\`} 
                    style={{ width: \`\${(turnTimer / 10) * 100}%\` }}
                  />
                </div>
                <span className={\`text-sm font-black \${turnTimer <= 3 ? 'text-rose-500' : 'text-amber-500'}\`}>{turnTimer}s</span>
              </div>
            )}
            <ActionControls
              selectedTactic={selectedTactic}
              onSelectTactic={setSelectedTactic}
              onRoll={() => handleActionSubmit()}
              isRolling={isRolling || myTurnAction !== null}
              disabled={phase === 'MATCH_OVER'}
              showEmoji={!!multiplayerRoomId}
              isBatting={currentStrike === 'YOU'}
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
`;
appCode = appCode.replace(actionControlsRegex, newActionControls);

// 5. Write back
fs.writeFileSync('src/App.tsx', appCode);

// Also we need to make sure handleRestartMatch resets these states:
// setMyTurnAction(null); setOpponentTurnAction(null); setTurnTimer(10);
