const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "}, [isRolling, phase, myTurnAction, selectedTactic, settings.mode, multiplayerRoomId]);",
  "}, [isRolling, phase, myTurnAction, selectedTactic, settings.mode, multiplayerRoomId, currentStrike]);"
);

fs.writeFileSync('src/App.tsx', code);
