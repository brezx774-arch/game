const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  "| 'POWER_SHOT';",
  "| 'POWER_SHOT'\n  | 'START';"
);

fs.writeFileSync('src/types.ts', code);
