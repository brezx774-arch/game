const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "let aiTactic: TacticMode = 'ROTATE';",
  "const tactics: TacticMode[] = ['DEFEND', 'ROTATE', 'ATTACK'];\n        let aiTactic: TacticMode = tactics[Math.floor(Math.random() * tactics.length)];"
);

fs.writeFileSync('src/App.tsx', code);
