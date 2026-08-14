const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const \[myIsRolling, setMyIsRolling\] = useState<boolean>\(false\);\n/g, '');
code = code.replace(/const \[aiIsRolling, setAiIsRolling\] = useState<boolean>\(false\);\n/g, '');
code = code.replace(/setMyIsRolling\(false\);\n/g, '');
code = code.replace(/setAiIsRolling\(false\);\n/g, '');

fs.writeFileSync('src/App.tsx', code);
