const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. handleRestartMatch
code = code.replace(
  /    setPhase\('INNINGS_1'\);\n    setTargetRuns\(undefined\);/,
  "    setCurrentStrike('YOU');\n    setPhase('INNINGS_1');\n    setTargetRuns(undefined);"
);

// 2. onTossComplete
code = code.replace(
  /          onTossComplete=\{\(firstStrikerId\) => \{\n            setPhase\('INNINGS_1'\);\n            setTargetRuns\(undefined\);/,
  "          onTossComplete={(firstStrikerId) => {\n            setCurrentStrike(firstStrikerId === myPlayerId ? 'YOU' : 'AI');\n            setPhase('INNINGS_1');\n            setTargetRuns(undefined);"
);

// 3. updatePlayerScore
code = code.replace(
  /          setStats\(s => \(\{\n            \.\.\.s,\n            matchesPlayed: s\.matchesPlayed \+ 1,\n            matchesWon: s\.matchesWon \+ \(userWon \? 1 : 0\),\n            totalRuns: s\.totalRuns \+ userFinalRuns,\n            totalWickets: s\.totalWickets \+ \(isUser \? newWickets : youState\.wickets\),\n            highestScore: Math\.max\(s\.highestScore, userFinalRuns\)\n          \}\)\);\n        \}, 1000\);\n      \}/,
  `          setStats(s => ({
            ...s,
            matchesPlayed: s.matchesPlayed + 1,
            matchesWon: s.matchesWon + (userWon ? 1 : 0),
            totalRuns: s.totalRuns + userFinalRuns,
            totalWickets: s.totalWickets + (isUser ? newWickets : youState.wickets),
            highestScore: Math.max(s.highestScore, userFinalRuns)
          }));
        }, 1000);
      } else {
        setTimeout(() => {
           if (!isOtherFinished && (!isWide || isCurrentFinished)) {
              setCurrentStrike(isUser ? 'AI' : 'YOU');
           } else if (isCurrentFinished && !isOtherFinished) {
              setCurrentStrike(isUser ? 'AI' : 'YOU');
           }
        }, 500);
      }`
);

fs.writeFileSync('src/App.tsx', code);
