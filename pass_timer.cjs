const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<Scoreboard\n            youState=\{youState\}\n            aiState=\{aiState\}\n            isPowerplay=\{isCurrentPowerplay\}\n            currentStrike=\{currentStrike\}\n          \/>/,
  `<Scoreboard
            youState={youState}
            aiState={aiState}
            isPowerplay={isCurrentPowerplay}
            currentStrike={currentStrike}
            turnTimer={activeScreen === 'GAME' && phase !== 'MATCH_OVER' && !isRolling ? turnTimer : undefined}
          />`
);

fs.writeFileSync('src/App.tsx', code);
