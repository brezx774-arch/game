const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const fragment = `  }, [settings.mode]);
  return () => clearTimeout(timer);
    }
  }, [activeScreen, currentStrike, isRolling, phase, settings.mode, handleRoll, targetRuns, aiState.runs, aiState.ballsBowled, aiState.wickets, settings.maxOvers, isCurrentPowerplay]);
  return (`;

code = code.replace(fragment, `  }, [settings.mode]);\n\n  return (`);
fs.writeFileSync('src/App.tsx', code);
