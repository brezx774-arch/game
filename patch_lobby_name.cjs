const fs = require('fs');
let code = fs.readFileSync('src/components/LobbyScreen.tsx', 'utf8');

code = code.replace("SIX<br />APPEAL", "CRICKET<br />ROYALE");
code = code.replace("SIX APPEAL", "CRICKET ROYALE");

fs.writeFileSync('src/components/LobbyScreen.tsx', code);
