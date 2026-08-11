const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "setTimeout(() => {\n        setShowDiceModal(false);\n        setCurrentTileIndex(newIndex);\n        resolveOutcome(landedTile, combinedRoll, batterAction.tactic);\n        setMyTurnAction(null);\n        setOpponentTurnAction(null);\n        setTurnTimer(10);\n      }, 2000);",
  "setTimeout(() => {\n        setShowDiceModal(false);\n        setCurrentTileIndex(newIndex);\n        resolveOutcome(landedTile, combinedRoll, batterAction.tactic);\n        setMyTurnAction(null);\n        setOpponentTurnAction(null);\n        setTurnTimer(10);\n        setIsRolling(false);\n      }, 2000);"
);

fs.writeFileSync('src/App.tsx', code);
