const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "<MatchPlayersBanner youState={youState} aiState={aiState} emojiEvent={emojiEvent} />",
  "<MatchPlayersBanner youState={youState} aiState={aiState} emojiEvent={emojiEvent} playerLevel={playerLevel} opponentLevel={settings.mode === 'MULTIPLAYER' ? 5 : 10} />"
);

fs.writeFileSync('src/App.tsx', code);
