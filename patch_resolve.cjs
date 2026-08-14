const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /    switch \(tile\.type\) \{/,
  `    switch (tile.type) {
      case 'START':
        cMsg = \`\${currentPlayerState.name} is at the start.\`;
        soundFx.playBatHit(false);
        break;`
);

fs.writeFileSync('src/App.tsx', code);
