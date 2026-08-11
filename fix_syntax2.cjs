const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `      return () => {
        socketService.off('opponent_action', handleOpponentAction);
        socketService.off('opponent_disconnected', handleOpponentDisconnected);
      };
  }, [activeScreen, currentStrike, isRolling, phase, settings.mode, handleRoll, targetRuns, aiState.runs, aiState.ballsBowled, aiState.wickets, settings.maxOvers, isCurrentPowerplay]);
  return (`;

const replaceWith = `      return () => {
        socketService.off('opponent_action', handleOpponentAction);
        socketService.off('opponent_disconnected', handleOpponentDisconnected);
      };
    }
  }, [settings.mode]);

  return (`

code = code.replace(target, replaceWith);
fs.writeFileSync('src/App.tsx', code);
