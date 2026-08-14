const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<Scoreboard\n            youState=\{youState\}\n            aiState=\{aiState\}\n            isPowerplay=\{isCurrentPowerplay\}\n          \/>/,
  `<Scoreboard
            youState={youState}
            aiState={aiState}
            isPowerplay={isCurrentPowerplay}
            currentStrike={currentStrike}
          />`
);

fs.writeFileSync('src/App.tsx', code);
