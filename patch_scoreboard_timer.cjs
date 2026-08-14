const fs = require('fs');

let code = fs.readFileSync('src/components/Scoreboard.tsx', 'utf8');

if (!code.includes('turnTimer?: number')) {
  code = code.replace(
    "currentStrike: 'YOU' | 'AI' | 'PLAYER_2';",
    "currentStrike: 'YOU' | 'AI' | 'PLAYER_2';\n  turnTimer?: number;"
  );
}

if (!code.includes('turnTimer,')) {
  code = code.replace(
    "currentStrike,",
    "currentStrike,\n  turnTimer,"
  );
}

// Add the timer bar for Player 1
code = code.replace(
  /        \{\/\* Player 1 \(YOU\) \*\/\}\n        <div className=\{\`flex-1 flex flex-col border-r-2 border-\[\#1e293b\] \$\{currentStrike === 'YOU' \? 'bg-gradient-to-br from-\[\#0ea5e9\]\/20 to-\[\#0f172a\]' : 'opacity-70'\}\`\}>/,
  `        {/* Player 1 (YOU) */}
        <div className={\`relative flex-1 flex flex-col border-r-2 border-[#1e293b] overflow-hidden \${currentStrike === 'YOU' ? 'bg-gradient-to-br from-[#0ea5e9]/20 to-[#0f172a]' : 'opacity-70'}\`}>
          {currentStrike === 'YOU' && turnTimer !== undefined && (
            <div className="absolute bottom-0 left-0 h-1.5 w-full bg-slate-900">
              <div 
                className={\`h-full transition-all duration-1000 \${turnTimer <= 3 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 'bg-amber-500'}\`} 
                style={{ width: \`\${(Math.max(0, turnTimer) / 20) * 100}%\` }}
              />
            </div>
          )}`
);

// Add the timer bar for Player 2
code = code.replace(
  /        \{\/\* Player 2 \(AI\/Opponent\) \*\/\}\n        <div className=\{\`flex-1 flex flex-col \$\{currentStrike !== 'YOU' \? 'bg-gradient-to-bl from-\[\#ef4444\]\/20 to-\[\#0f172a\]' : 'opacity-70'\}\`\}>/,
  `        {/* Player 2 (AI/Opponent) */}
        <div className={\`relative flex-1 flex flex-col overflow-hidden \${currentStrike !== 'YOU' ? 'bg-gradient-to-bl from-[#ef4444]/20 to-[#0f172a]' : 'opacity-70'}\`}>
          {currentStrike !== 'YOU' && turnTimer !== undefined && (
            <div className="absolute bottom-0 left-0 h-1.5 w-full bg-slate-900">
              <div 
                className={\`h-full transition-all duration-1000 \${turnTimer <= 3 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 'bg-amber-500'}\`} 
                style={{ width: \`\${(Math.max(0, turnTimer) / 20) * 100}%\` }}
              />
            </div>
          )}`
);

fs.writeFileSync('src/components/Scoreboard.tsx', code);
