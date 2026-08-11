const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "setDotsCount(0);\n          }}",
  "setDotsCount(0);\n            setMyTurnAction(null);\n            setOpponentTurnAction(null);\n            setTurnTimer(10);\n          }}"
);

fs.writeFileSync('src/App.tsx', code);
