const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "onStartMultiplayer={(roomId, firstStrikerId, opponentId, opponentName, isBot) => {",
  "onStartMultiplayer={(roomId, firstStrikerId, opponentId, opponentName, isBot, groundIndex) => {"
);

code = code.replace(
  "// Randomly select stadium for multiplayer\n            const randomGround = STADIUMS[Math.floor(Math.random() * STADIUMS.length)];\n            setSelectedGround(randomGround);",
  "// Select stadium synced from server\n            const syncedGround = (groundIndex !== undefined && STADIUMS[groundIndex]) ? STADIUMS[groundIndex] : STADIUMS[Math.floor(Math.random() * STADIUMS.length)];\n            setSelectedGround(syncedGround);"
);

fs.writeFileSync('src/App.tsx', code);
