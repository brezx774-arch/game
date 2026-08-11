const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  "export type TacticMode = 'DEFEND' | 'ROTATE' | 'ATTACK';",
  "export type TacticMode = 'DEFEND' | 'ROTATE' | 'ATTACK' | 'FAST' | 'SPIN' | 'YORKER';"
);

fs.writeFileSync('src/types.ts', code);
