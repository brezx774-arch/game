const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "        if (data.action === 'LEAVE') {\n          setPhase('MATCH_OVER');\n          setCommentaryMsg('Opponent left.');\n          setCommentarySubMsg('You win by default!');\n        } else if (data.action === 'EMOJI') {",
  "        if (data.action === 'LEAVE') {\n          setSettings(prev => ({ ...prev, mode: 'VS_AI' }));\n          setCommentaryMsg('Opponent left.');\n          setCommentarySubMsg('AI took over!');\n        } else if (data.action === 'EMOJI') {"
);

fs.writeFileSync('src/App.tsx', code);
