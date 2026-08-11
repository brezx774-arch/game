const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace("SIX APPEAL", "CRICKET ROYALE");

fs.writeFileSync('src/components/Header.tsx', code);
