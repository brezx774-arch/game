const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStart = "  const isUserFinished = youState.ballsBowled >= settings.maxOvers * 6 || youState.wickets >= settings.maxWickets;";
const targetEnd = "// Resolve outcome of the landed tile";

const newChunk = `  // Match End conditions
  const isUserFinished = youState.ballsBowled >= settings.maxOvers * 6 || youState.wickets >= settings.maxWickets;
  const isAiFinished = aiState.ballsBowled >= settings.maxOvers * 6 || aiState.wickets >= settings.maxWickets;

  // Submit Action (Dual-Roll System)
  const handleActionSubmit = useCallback((tactic?: TacticMode) => {
    if (isRolling || phase === 'MATCH_OVER') return;
    
    // Prevent multiple submissions
    if (currentStrike === 'YOU' && myTurnAction) return;
    if (currentStrike === 'AI' && opponentTurnAction) return;
    
    // Check if user is allowed to act
    if (settings.mode !== 'PASS_AND_PLAY' && currentStrike !== 'YOU') return;
    
    soundFx.playClick();
    const activeTactic = tactic || selectedTactic;
    
    let roll = 1;
    if (activeTactic === 'DEFEND') roll = [1, 1, 2, 2, 3][Math.floor(Math.random() * 5)];
    else if (activeTactic === 'ROTATE') roll = [1, 2, 3, 4][Math.floor(Math.random() * 4)];
    else if (activeTactic === 'ATTACK') roll = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
    else roll = Math.floor(Math.random() * 6) + 1;
    
    const action = { tactic: activeTactic, roll, catchRand: Math.random() };
    
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
  }, [isRolling, phase, myTurnAction, opponentTurnAction, selectedTactic, settings.mode, multiplayerRoomId, currentStrike]);

  // Handle AI turn action
  useEffect(() => {
    if (activeScreen === 'GAME' && phase !== 'MATCH_OVER' && settings.mode === 'VS_AI' && !opponentTurnAction) {
      if (currentStrike !== 'AI') return; // Only AI batter takes action
      
      const timer = setTimeout(() => {
        const tactics: TacticMode[] = ['DEFEND', 'ROTATE', 'ATTACK'];
        let aiTactic: TacticMode = tactics[Math.floor(Math.random() * tactics.length)];
        
        let roll = 1;
        if (aiTactic === 'DEFEND') roll = [1, 1, 2, 2, 3][Math.floor(Math.random() * 5)];
        else if (aiTactic === 'ROTATE') roll = [1, 2, 3, 4][Math.floor(Math.random() * 4)];
        else if (aiTactic === 'ATTACK') roll = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
        else roll = Math.floor(Math.random() * 6) + 1;

        setOpponentTurnAction({ tactic: aiTactic, roll, catchRand: Math.random() });
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
      let newIndex = currentIndex + combinedRoll;
      if (newIndex > 36) newIndex -= 36;
      
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

`;

const splitA = code.split(targetStart);
if (splitA.length < 2) { console.log("Start not found"); process.exit(1); }

const splitB = splitA[1].split(targetEnd);
if (splitB.length < 2) { console.log("End not found"); process.exit(1); }

fs.writeFileSync('src/App.tsx', splitA[0] + newChunk + targetEnd + splitB[1]);
