const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "} else if (data.action === 'SUBMIT_TURN') {\n          setOpponentTurnAction(data.payload);\n              };",
  "} else if (data.action === 'SUBMIT_TURN') {\n          setOpponentTurnAction(data.payload);\n        }\n      };"
);
fs.writeFileSync('src/App.tsx', code);
