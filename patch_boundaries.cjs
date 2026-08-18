const fs = require('fs');
const path = 'src/game/engine/useGameEngine.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  'fourCount: currentState.fourCount + (runs === 4 ? 1 : 0)',
  'fourCount: currentState.fourCount + (runs === 4 || runs === 8 ? 1 : 0)'
);
code = code.replace(
  'sixCount: currentState.sixCount + (runs === 6 ? 1 : 0)',
  'sixCount: currentState.sixCount + (runs === 6 || runs === 12 ? 1 : 0)'
);

fs.writeFileSync(path, code);
console.log("Boundary counts patched.");
