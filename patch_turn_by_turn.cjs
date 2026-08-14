const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Change setTurnTimer(10) to setTurnTimer(20)
code = code.replace(/setTurnTimer\(10\)/g, 'setTurnTimer(20)');

// 2. Change handleActionSubmit
code = code.replace(
  "const handleActionSubmit = useCallback((tactic?: TacticMode) => {\n    if (isRolling || phase === 'MATCH_OVER' || myTurnAction) return;",
  "const handleActionSubmit = useCallback((tactic?: TacticMode) => {\n    if (isRolling || phase === 'MATCH_OVER' || myTurnAction) return;\n    if (currentStrike !== 'YOU') return;"
);

// 3. Change AI turn action logic
const aiOld = `  // Handle AI turn action
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
  }, [activeScreen, phase, settings.mode, currentStrike, opponentTurnAction]);`;

const aiNew = `  // Handle AI turn action
  useEffect(() => {
    if (activeScreen === 'GAME' && phase !== 'MATCH_OVER' && settings.mode === 'VS_AI' && !opponentTurnAction) {
      if (currentStrike !== 'AI') return; // Only AI batter takes action
      
      const timer = setTimeout(() => {
        let aiTactic: TacticMode = 'ROTATE';
        
        let roll = 1;
        if (aiTactic === 'DEFEND') roll = [1, 1, 2, 2, 3][Math.floor(Math.random() * 5)];
        else if (aiTactic === 'ROTATE') roll = [1, 2, 3, 4][Math.floor(Math.random() * 4)];
        else if (aiTactic === 'ATTACK') roll = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
        else roll = Math.floor(Math.random() * 6) + 1;

        setOpponentTurnAction({ tactic: aiTactic, roll });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeScreen, phase, settings.mode, currentStrike, opponentTurnAction]);`;
code = code.replace(aiOld, aiNew);

// 4. Update the turn timer
const timerOld = `  // Turn timer countdown and auto-roll
  useEffect(() => {
    if (activeScreen !== 'GAME' || phase === 'MATCH_OVER' || isRolling) return;
    
    if (myTurnAction && opponentTurnAction) return;

    const timer = setInterval(() => {
      setTurnTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeScreen, phase, isRolling, myTurnAction, opponentTurnAction]);

  // Handle timer actions
  useEffect(() => {
    if (activeScreen !== 'GAME' || phase === 'MATCH_OVER' || isRolling) return;
    
    if (turnTimer === 0 && !myTurnAction) {
       const defaultTactic = currentStrike === 'YOU' ? 'ROTATE' : 'FAST';
       handleActionSubmit(defaultTactic);
    } else if (turnTimer < -4 && settings.mode === 'MULTIPLAYER' && myTurnAction && !opponentTurnAction) {
       setSettings(s => ({ ...s, mode: 'VS_AI' }));
       setCommentaryMsg('Opponent timed out.');
       setCommentarySubMsg('AI took over!');
       setTurnTimer(0);
    }
  }, [turnTimer, myTurnAction, opponentTurnAction, activeScreen, phase, isRolling, currentStrike, handleActionSubmit, settings.mode]);`;

const timerNew = `  // Turn timer countdown and auto-roll
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
    
    const batterAction = currentStrike === 'YOU' ? myTurnAction : opponentTurnAction;
    
    if (turnTimer === 0 && currentStrike === 'YOU' && !myTurnAction) {
       handleActionSubmit('ROTATE');
    } else if (turnTimer < -4 && settings.mode === 'MULTIPLAYER' && currentStrike !== 'YOU' && !opponentTurnAction) {
       setSettings(s => ({ ...s, mode: 'VS_AI' }));
       setCommentaryMsg('Opponent timed out.');
       setCommentarySubMsg('AI took over!');
       setTurnTimer(0);
    }
  }, [turnTimer, myTurnAction, opponentTurnAction, activeScreen, phase, isRolling, currentStrike, handleActionSubmit, settings.mode]);`;
code = code.replace(timerOld, timerNew);

// 5. Update Resolve Logic
const resolveOld = `  // Resolve both actions when ready
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
        setTurnTimer(20);
        setIsRolling(false);
      }, 2000); // Extended a bit to see both actions resolved
    }
  }, [myTurnAction, opponentTurnAction, isRolling, activeScreen, phase, currentTileIndex, currentStrike]);`;

const resolveNew = `  // Resolve action when ready
  useEffect(() => {
    const batterAction = currentStrike === 'YOU' ? myTurnAction : opponentTurnAction;
    
    if (batterAction && !isRolling && activeScreen === 'GAME' && phase !== 'MATCH_OVER') {
      setIsRolling(true);
      soundFx.playDiceRoll();
      
      // Since it's turn-by-turn batting only, we just use the batter's roll, 
      // or we can simulate a random bowler roll to add variance. Let's just use the batter's roll.
      const combinedRoll = batterAction.roll;
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
        setTurnTimer(20);
        setIsRolling(false);
      }, 2000); // Extended a bit to see both actions resolved
    }
  }, [myTurnAction, opponentTurnAction, isRolling, activeScreen, phase, currentTileIndex, currentStrike]);`;

code = code.replace(resolveOld, resolveNew);

fs.writeFileSync('src/App.tsx', code);
