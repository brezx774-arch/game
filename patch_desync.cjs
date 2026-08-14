const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update handleActionSubmit to include catchRand
code = code.replace(
  "const action = { tactic: activeTactic, roll };",
  "const action = { tactic: activeTactic, roll, catchRand: Math.random() };"
);

// 2. Update AI to include catchRand
code = code.replace(
  "setOpponentTurnAction({ tactic: aiTactic, roll });",
  "setOpponentTurnAction({ tactic: aiTactic, roll, catchRand: Math.random() });"
);

// 3. Update resolveOutcome signature
code = code.replace(
  "const resolveOutcome = (tile: BoardTile, rollVal: number, activeTactic: TacticMode) => {",
  "const resolveOutcome = (tile: BoardTile, rollVal: number, activeTactic: TacticMode, catchRand: number = Math.random()) => {"
);

// 4. Update Math.random() in CATCH case
code = code.replace(
  "if (Math.random() < catchProb) {",
  "if (catchRand < catchProb) {"
);

// 5. Update call to resolveOutcome
code = code.replace(
  "resolveOutcome(landedTile, combinedRoll, batterAction.tactic);",
  "resolveOutcome(landedTile, combinedRoll, batterAction.tactic, batterAction.catchRand || Math.random());"
);

fs.writeFileSync('src/App.tsx', code);
