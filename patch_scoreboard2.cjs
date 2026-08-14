const fs = require('fs');

let code = fs.readFileSync('src/components/Scoreboard.tsx', 'utf8');

code = code.replace(
  "  isPowerplay: boolean;",
  "  isPowerplay: boolean;\n  currentStrike: 'YOU' | 'AI' | 'PLAYER_2';"
);

code = code.replace(
  "  isPowerplay,\n}) => {",
  "  isPowerplay,\n  currentStrike,\n}) => {"
);

code = code.replace(
  /        \{\/\* Player 1 \(YOU\) \*\/\}\n        <div className="flex-1 flex flex-col border-r-2 border-\[\#1e293b\] bg-gradient-to-br from-\[\#0ea5e9\]\/20 to-\[\#0f172a\]">/,
  `        {/* Player 1 (YOU) */}
        <div className={\`flex-1 flex flex-col border-r-2 border-[#1e293b] \${currentStrike === 'YOU' ? 'bg-gradient-to-br from-[#0ea5e9]/20 to-[#0f172a]' : 'opacity-70'}\`}>`
);

code = code.replace(
  /        \{\/\* Player 2 \(AI\/Opponent\) \*\/\}\n        <div className="flex-1 flex flex-col bg-gradient-to-bl from-\[\#ef4444\]\/20 to-\[\#0f172a\]">/,
  `        {/* Player 2 (AI/Opponent) */}
        <div className={\`flex-1 flex flex-col \${currentStrike !== 'YOU' ? 'bg-gradient-to-bl from-[#ef4444]/20 to-[#0f172a]' : 'opacity-70'}\`}>`
);

code = code.replace(
  /             <span>\{youState\.name\}<\/span>\n             <div className="w-1\.5 h-1\.5 bg-emerald-400 rounded-full shadow-\[0_0_5px_#34d399\] animate-pulse" \/>/,
  `             <span>{youState.name}</span>
             {currentStrike === 'YOU' && <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_5px_#34d399] animate-pulse" />}`
);

code = code.replace(
  /             <span>\{aiState\.name\}<\/span>\n             <div className="w-1\.5 h-1\.5 bg-emerald-400 rounded-full shadow-\[0_0_5px_#34d399\] animate-pulse" \/>/,
  `             <span>{aiState.name}</span>
             {currentStrike !== 'YOU' && <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_5px_#34d399] animate-pulse" />}`
);

fs.writeFileSync('src/components/Scoreboard.tsx', code);
