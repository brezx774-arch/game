const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update activeScreen ternary
code = code.replace(
  "{activeScreen === 'LOBBY' ? (",
  "{activeScreen === 'TOSS' ? (\n        <TossScreen\n          mode={settings.mode === 'MULTIPLAYER' ? 'MULTIPLAYER' : 'VS_AI'}\n          myId={myPlayerId}\n          opponentId={opponentPlayerId}\n          opponentName={multiplayerOpponentName}\n          callerId={tossCallerId}\n          isBotMatch={isBotToss}\n          onTossComplete={(firstStrikerId) => {\n            setCurrentStrike(firstStrikerId === myPlayerId ? 'YOU' : 'AI');\n            setPhase('INNINGS_1');\n            setTargetRuns(undefined);\n            setCommentaryMsg('Match started!');\n            setCommentarySubMsg('First to bat is selected.');\n            setActiveScreen('GAME');\n          }}\n        />\n      ) : activeScreen === 'LOBBY' ? ("
);

// 2. Update onStart handler (VS_AI local)
code = code.replace(
  "handleRestartMatch();\n            setActiveScreen('GAME');",
  "handleRestartMatch();\n            setMyPlayerId('YOU');\n            setOpponentPlayerId('AI');\n            setMultiplayerOpponentName('AI');\n            setTossCallerId(Math.random() > 0.5 ? 'YOU' : 'AI');\n            setIsBotToss(true);\n            setActiveScreen('TOSS');"
);

// 3. Update onStartMultiplayer handler
code = code.replace(
  "            setPhase('INNINGS_1');\n            setCurrentStrike(socketService.socket?.id === firstStrikerId ? 'YOU' : 'AI');\n            setTargetRuns(undefined);\n            setCommentaryMsg('Match started!');\n            setCommentarySubMsg('First to bat is selected.');\n            setActiveScreen('GAME');",
  "            setMultiplayerOpponentName(opponentName || 'OPPONENT');\n            setTossCallerId(firstStrikerId);\n            setIsBotToss(isBot || false);\n            setActiveScreen('TOSS');"
);

fs.writeFileSync('src/App.tsx', code);
