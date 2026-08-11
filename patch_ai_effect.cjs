const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "if (phase !== 'MATCH_OVER' && currentStrike === 'AI' && settings.mode === 'VS_AI' && !isRolling) {",
  "if (activeScreen === 'GAME' && phase !== 'MATCH_OVER' && currentStrike === 'AI' && settings.mode === 'VS_AI' && !isRolling) {"
);

fs.writeFileSync('src/App.tsx', code);
