const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "setCommentaryMsg('Match started! Select your shot tactic and ROLL to begin.');\n    setCommentarySubMsg('Powerplay active! Overs 1 & 2 double all run outcomes!');\n  };",
  "setCommentaryMsg('Match started! Select your shot tactic and ROLL to begin.');\n    setCommentarySubMsg('Powerplay active! Overs 1 & 2 double all run outcomes!');\n    setMyTurnAction(null);\n    setOpponentTurnAction(null);\n    setTurnTimer(10);\n  };"
);

fs.writeFileSync('src/App.tsx', code);
