const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove states
code = code.replace(
  /  const \[currentStrike.*\n  const \[phase.*\n  const \[targetRuns.*\n  const \[youTileIndex.*\n  const \[aiTileIndex.*\n  const \[selectedTactic.*\n  const \[emojiEvent.*\n  const \[isRolling.*\n  const \[isFreeHit.*\n\n  const \[turnTimer.*\n  const \[myTurnAction.*\n  const \[opponentTurnAction.*/,
  `  const [phase, setPhase] = useState<GamePhase>('INNINGS_1');
  const [targetRuns, setTargetRuns] = useState<number | undefined>(undefined);
  const [youTileIndex, setYouTileIndex] = useState<number>(1);
  const [aiTileIndex, setAiTileIndex] = useState<number>(1);
  const [selectedTactic, setSelectedTactic] = useState<TacticMode>('ROTATE');
  const [emojiEvent, setEmojiEvent] = useState<{player: 'YOU'|'AI', emoji: string, id: number} | null>(null);
  
  const [myIsRolling, setMyIsRolling] = useState<boolean>(false);
  const [aiIsRolling, setAiIsRolling] = useState<boolean>(false);
  
  const [isFreeHit, setIsFreeHit] = useState<boolean>(false);
  const [myTurnAction, setMyTurnAction] = useState<{tactic: TacticMode, roll: number, catchRand?: number} | null>(null);`
);

// 2. Restart match cleanup
code = code.replace(
  /    setCurrentStrike\('YOU'\);\n    setPhase\('INNINGS_1'\);\n    setTargetRuns\(undefined\);\n    setYouTileIndex\(1\);\n    setAiTileIndex\(1\);\n    setIsFreeHit\(false\);\n    setCommentaryMsg\('Match started! Select your shot tactic and ROLL to begin\.'\);\n    setCommentarySubMsg\('Powerplay active! Overs 1 & 2 double all run outcomes!'\);\n    setMyTurnAction\(null\);\n    setOpponentTurnAction\(null\);\n    setTurnTimer\(20\);/g,
  `    setPhase('INNINGS_1');
    setTargetRuns(undefined);
    setYouTileIndex(1);
    setAiTileIndex(1);
    setIsFreeHit(false);
    setCommentaryMsg('Match started! Race your opponent to finish your overs!');
    setCommentarySubMsg('First to finish is not enough, you must score more runs!');
    setMyTurnAction(null);`
);

// 3. handleExitToLobby cleanup
code = code.replace(
  /    setPhase\('MATCH_OVER'\);\n    setIsRolling\(false\);/,
  `    setPhase('MATCH_OVER');\n    setMyIsRolling(false);\n    setAiIsRolling(false);`
);

// 4. Submit Action rewrite
code = code.replace(
  /  \/\/ Submit Action \(Dual-Roll System\)[\s\S]*?\/\/ Handle AI turn action/m,
  `  const isUserFinished = youState.ballsBowled >= settings.maxOvers * 6 || youState.wickets >= settings.maxWickets;
  const isAiFinished = aiState.ballsBowled >= settings.maxOvers * 6 || aiState.wickets >= settings.maxWickets;

  // Submit Action (User)
  const handleActionSubmit = useCallback((tactic?: TacticMode) => {
    if (myIsRolling || phase === 'MATCH_OVER' || isUserFinished) return;
    if (myTurnAction) return;
    
    soundFx.playClick();
    const activeTactic = tactic || selectedTactic;
    
    let roll = 1;
    if (activeTactic === 'DEFEND') roll = [1, 1, 2, 2, 3][Math.floor(Math.random() * 5)];
    else if (activeTactic === 'ROTATE') roll = [1, 2, 3, 4][Math.floor(Math.random() * 4)];
    else if (activeTactic === 'ATTACK') roll = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
    else roll = Math.floor(Math.random() * 6) + 1;
    
    const action = { tactic: activeTactic, roll, catchRand: Math.random() };
    setMyTurnAction(action);
    
    if (settings.mode === 'MULTIPLAYER' && multiplayerRoomId) {
      socketService.emit('player_action', {
        roomId: multiplayerRoomId,
        action: 'SUBMIT_TURN',
        payload: action
      });
    }
  }, [myIsRolling, phase, isUserFinished, myTurnAction, selectedTactic, settings.mode, multiplayerRoomId]);

  // Handle AI turn action`
);


// 5. AI loop rewrite
code = code.replace(
  /  \/\/ Handle AI turn action[\s\S]*?\/\/ Turn timer system/m,
  `  // Handle AI turn action
  useEffect(() => {
    if (activeScreen === 'GAME' && phase !== 'MATCH_OVER' && settings.mode === 'VS_AI' && !isAiFinished && !aiIsRolling) {
      const timer = setTimeout(() => {
        const tactics: TacticMode[] = ['DEFEND', 'ROTATE', 'ATTACK'];
        let aiTactic: TacticMode = tactics[Math.floor(Math.random() * tactics.length)];
        
        let roll = 1;
        if (aiTactic === 'DEFEND') roll = [1, 1, 2, 2, 3][Math.floor(Math.random() * 5)];
        else if (aiTactic === 'ROTATE') roll = [1, 2, 3, 4][Math.floor(Math.random() * 4)];
        else if (aiTactic === 'ATTACK') roll = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
        else roll = Math.floor(Math.random() * 6) + 1;

        // Perform AI roll
        setAiIsRolling(true);
        let newIndex = aiTileIndex + roll;
        if (newIndex > 36) newIndex -= 36;
        
        const landedTile = BOARD_TILES.find(t => t.id === newIndex) || BOARD_TILES[0];
        
        setTimeout(() => {
           setAiTileIndex(newIndex);
           resolveOutcome(landedTile, roll, aiTactic, Math.random(), false);
           setAiIsRolling(false);
        }, 1500); // AI visual roll duration

      }, 2000 + Math.random() * 1000); // AI think time
      return () => clearTimeout(timer);
    }
  }, [activeScreen, phase, settings.mode, isAiFinished, aiIsRolling, aiTileIndex]);

  // Turn timer system`
);


// 6. Turn Timer rewrite -> User Resolution
code = code.replace(
  /  \/\/ Turn timer system[\s\S]*?\/\/ Resolve outcome of the landed tile/m,
  `  // Resolve User action when ready
  useEffect(() => {
    if (myTurnAction && !myIsRolling && activeScreen === 'GAME' && phase !== 'MATCH_OVER') {
      setMyIsRolling(true);
      soundFx.playDiceRoll();
      
      const combinedRoll = myTurnAction.roll;
      setDiceVal(combinedRoll);
      
      let newIndex = youTileIndex + combinedRoll;
      if (newIndex > 36) newIndex -= 36;
      
      const landedTile = BOARD_TILES.find(t => t.id === newIndex) || BOARD_TILES[0];
      setLandedTileInfo(landedTile);
      setShowDiceModal(true);
      
      setTimeout(() => {
        setShowDiceModal(false);
        setYouTileIndex(newIndex);
        resolveOutcome(landedTile, combinedRoll, myTurnAction.tactic, myTurnAction.catchRand || Math.random(), true);
        setMyTurnAction(null);
        
        // Cooldown before they can roll again
        setTimeout(() => {
           setMyIsRolling(false);
        }, 500);
      }, 1500);
    }
  }, [myTurnAction, myIsRolling, activeScreen, phase, youTileIndex]);

// Resolve outcome of the landed tile`
);

// 7. ResolveOutcome signature update
code = code.replace(
  /const resolveOutcome = \(tile: BoardTile, rollVal: number, activeTactic: TacticMode, catchRand: number = Math\.random\(\)\) => \{/g,
  `const resolveOutcome = (tile: BoardTile, rollVal: number, activeTactic: TacticMode, catchRand: number = Math.random(), isUser: boolean) => {`
);

// 8. Fix ResolveOutcome internal variables
code = code.replace(
  /    const isBattingUser = currentStrike === 'YOU';\n    const currentPlayerState = isBattingUser \? youState : aiState;/g,
  `    const isBattingUser = isUser;
    const currentPlayerState = isUser ? youState : aiState;`
);

// 9. Fix updatePlayerScore
code = code.replace(
  /      const otherState = isUser \? aiState : youState;\n      const isOtherFinished = otherState\.ballsBowled >= totalLegalBalls \|\| otherState\.wickets >= settings\.maxWickets;\n\n      if \(isCurrentFinished && isOtherFinished\) \{[\s\S]*?\}, 500\);\n      \}/g,
  `      const otherState = isUser ? aiState : youState;
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
      }`
);

// 10. Update Toss complete handler
code = code.replace(
  /          onTossComplete=\{\(firstStrikerId\) => \{\n            setCurrentStrike\(firstStrikerId === myPlayerId \? 'YOU' : 'AI'\);\n            setPhase\('INNINGS_1'\);\n            setTargetRuns\(undefined\);\n            setCommentaryMsg\('Match started!'\);\n            setCommentarySubMsg\('First to bat is selected\.'\);\n            setActiveScreen\('GAME'\);\n          \}\}/g,
  `          onTossComplete={(firstStrikerId) => {
            setPhase('INNINGS_1');
            setTargetRuns(undefined);
            setCommentaryMsg('Match started!');
            setCommentarySubMsg('Race your opponent to finish your overs!');
            setActiveScreen('GAME');
          }}`
);

// 11. Remove currentStrike from Scoreboard & CricketBoard render
code = code.replace(
  /          <Scoreboard\n            youState=\{youState\}\n            aiState=\{aiState\}\n            currentStrike=\{currentStrike\}\n            phase=\{phase\}\n            maxOvers=\{settings\.maxOvers\}\n            isPowerplay=\{isCurrentPowerplay\}\n            targetRuns=\{targetRuns\}\n          \/>\n\n          \{\/\* Center Circular Cricket Board \*\/\}\n          <CricketBoard\n            youTileIndex=\{youTileIndex\}\n            aiTileIndex=\{aiTileIndex\}\n            currentStrike=\{currentStrike\}\n            youState=\{youState\}\n            aiState=\{aiState\}\n            isRolling=\{isRolling\}\n            ground=\{selectedGround\}\n          \/>/,
  `          <Scoreboard
            youState={youState}
            aiState={aiState}
            isPowerplay={isCurrentPowerplay}
          />

          {/* Center Circular Cricket Board */}
          <CricketBoard
            youTileIndex={youTileIndex}
            aiTileIndex={aiTileIndex}
            youIsRolling={myIsRolling}
            aiIsRolling={aiIsRolling}
            ground={selectedGround}
          />`
);

// 12. Fix ActionControls UI
code = code.replace(
  /          <div className="flex flex-col items-center">\n            \{\/\* Timer visualizer \*\/\}\n[\s\S]*?<\/div>\n            \)\}\n          <\/div>/m,
  `          <div className="flex flex-col items-center">
            { isUserFinished ? (
              <div className="flex flex-col items-center justify-center p-6 bg-[#0f172a] border-t-2 border-[#1e293b] rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.8)] h-32 w-full max-w-xl mx-auto">
                <h3 className="text-xl font-black text-amber-500 uppercase tracking-widest mb-2 animate-pulse">
                  Waiting for Opponent...
                </h3>
                <p className="text-stone-400 text-sm">You finished your innings! Let's see how they do.</p>
              </div>
            ) : (
              <ActionControls
                selectedTactic={selectedTactic}
                onSelectTactic={setSelectedTactic}
                onRoll={() => handleActionSubmit()}
                isRolling={myIsRolling || myTurnAction !== null}
                disabled={phase === 'MATCH_OVER'}
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
            )}
          </div>`
);

fs.writeFileSync('src/App.tsx', code);
