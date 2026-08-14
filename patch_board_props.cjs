const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /          <CricketBoard\n            youTileIndex=\{youTileIndex\}\n            aiTileIndex=\{aiTileIndex\}\n            youIsRolling=\{myIsRolling\}\n            aiIsRolling=\{aiIsRolling\}\n            ground=\{selectedGround\}\n          \/>/,
  `          <CricketBoard
            youTileIndex={youTileIndex}
            aiTileIndex={aiTileIndex}
            youIsRolling={isRolling && currentStrike === 'YOU'}
            aiIsRolling={isRolling && currentStrike !== 'YOU'}
            ground={selectedGround}
          />`
);

fs.writeFileSync('src/App.tsx', code);
