const fs = require('fs');
let code = fs.readFileSync('src/components/LobbyScreen.tsx', 'utf8');

code = code.replace(
  "onStartMultiplayer: (roomId: string, firstStrikerId: string, opponentId: string, opponentName?: string, isBot?: boolean) => void;",
  "onStartMultiplayer: (roomId: string, firstStrikerId: string, opponentId: string, opponentName?: string, isBot?: boolean, groundIndex?: number) => void;"
);

code = code.replace(
  "const handleMatchStart = (data: { firstStriker: string }) => {",
  "const handleMatchStart = (data: { firstStriker: string; groundIndex?: number }) => {"
);

code = code.replace(
  "onStartMultiplayer(currentRoomId, data.firstStriker, currentOpponentId, currentOpponentName, isBotMatch);",
  "onStartMultiplayer(currentRoomId, data.firstStriker, currentOpponentId, currentOpponentName, isBotMatch, data.groundIndex);"
);

fs.writeFileSync('src/components/LobbyScreen.tsx', code);
