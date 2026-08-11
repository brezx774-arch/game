const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove the old AI Turn Auto-play Trigger
const oldAiStart = code.indexOf('// AI Turn Auto-play Trigger');
const returnDivStart = code.indexOf('return (', oldAiStart);
code = code.substring(0, oldAiStart) + code.substring(returnDivStart);

// Now fix the old Socket Action Listener
code = code.replace(
  "} else if (data.action === 'ROLL') {\n          const { roll, tactic } = data.payload;\n          setSelectedTactic(tactic);\n          handleRoll(roll, tactic);\n        }",
  ""
);

// Fix handleRoll references in dependencies
code = code.replace("  }, [settings.mode, handleRoll]);", "  }, [settings.mode]);");

fs.writeFileSync('src/App.tsx', code);
