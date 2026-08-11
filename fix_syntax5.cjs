const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "setOpponentTurnAction(data.payload);\n              };",
  "setOpponentTurnAction(data.payload);\n        }\n      };"
);
fs.writeFileSync('src/App.tsx', code);
