const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace("mode={settings.mode === 'MULTIPLAYER' ? 'MULTIPLAYER' : 'VS_AI'}", "mode={settings.mode === 'MULTIPLAYER' ? 'MULTIPLAYER' : 'VS_AI'}\n          roomId={multiplayerRoomId || undefined}");
fs.writeFileSync('src/App.tsx', code);
