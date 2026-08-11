const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldTimerStart = code.indexOf('// Turn timer countdown and auto-roll');
const resolveBothStart = code.indexOf('// Resolve both actions when ready');

const newTimerCode = `  // Turn timer countdown and auto-roll
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
  }, [turnTimer, myTurnAction, opponentTurnAction, activeScreen, phase, isRolling, currentStrike, handleActionSubmit, settings.mode]);

  `;

code = code.substring(0, oldTimerStart) + newTimerCode + code.substring(resolveBothStart);
fs.writeFileSync('src/App.tsx', code);
