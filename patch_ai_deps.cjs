const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "}, [currentStrike, isRolling, phase, settings.mode, handleRoll, targetRuns, aiState.runs, aiState.ballsBowled, aiState.wickets, settings.maxOvers, isCurrentPowerplay]);",
  "}, [activeScreen, currentStrike, isRolling, phase, settings.mode, handleRoll, targetRuns, aiState.runs, aiState.ballsBowled, aiState.wickets, settings.maxOvers, isCurrentPowerplay]);"
);

fs.writeFileSync('src/App.tsx', code);
