const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "style={{ width: `${(turnTimer / 10) * 100}%` }}",
  "style={{ width: `${(Math.max(0, turnTimer) / 20) * 100}%` }}"
);

fs.writeFileSync('src/App.tsx', code);
