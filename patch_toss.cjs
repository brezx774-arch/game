const fs = require('fs');

let code = fs.readFileSync('src/components/TossScreen.tsx', 'utf8');

code = code.replace(
  "const [tossState, setTossState] = useState<'CALLING' | 'FLIPPING' | 'DECIDING' | 'RESULT'>('CALLING');",
  "const [tossState, setTossState] = useState<'CALLING' | 'FLIPPING' | 'RESULT'>('CALLING');"
);

code = code.replace(
  /          setWinnerId\(data\.payload\.winnerId\);\n          setTossState\('FLIPPING'\);\n          setTimeout\(\(\) => \{\n            setTossState\('DECIDING'\);\n          \}, 3000\);\n        \} else if \(data\.action === 'TOSS_DECISION'\) \{[\s\S]*?\}, 3000\);\n        \}/,
  `          setWinnerId(data.payload.winnerId);
          setTossState('FLIPPING');
          setTimeout(() => {
            setTossState('RESULT');
            setTimeout(() => {
              onTossComplete(data.payload.winnerId);
            }, 3000);
          }, 3000);
        }`
);

code = code.replace(
  /  \/\/ AI or Local Bot Logic\n  useEffect\(\(\) => \{\n    if \(\(mode === 'VS_AI' \|\| isBotMatch\) && tossState === 'DECIDING'[\s\S]*?return \(\) => clearTimeout\(timer\);\n    \}/,
  `  // AI or Local Bot Logic
  useEffect(() => {`
);

code = code.replace(
  /    setTossState\('FLIPPING'\);\n    setTimeout\(\(\) => \{\n      setTossState\('DECIDING'\);\n    \}, 3000\);\n  \};/,
  `    setTossState('FLIPPING');
    setTimeout(() => {
      setTossState('RESULT');
      setTimeout(() => {
        onTossComplete(theWinner);
      }, 3000);
    }, 3000);
  };`
);

code = code.replace(
  /  const handleDecision = \('BAT' \| 'BOWL'\)[\s\S]*?3000\);\n  \};/m,
  ""
);
code = code.replace(
  /  const handleDecision = \(selectedDecision: 'BAT' \| 'BOWL'\) => \{[\s\S]*?\}, 3000\);\n  \};/m,
  ""
);

code = code.replace(
  /        \{tossState === 'DECIDING' && tossResult && \([\s\S]*?\}\n        \{tossState === 'RESULT' && decision && \(/,
  `        {tossState === 'RESULT' && tossResult && (`
);

code = code.replace(
  /        \{tossState === 'RESULT' && tossResult && \([\s\S]*?\}\n      <\/div>/,
  `        {tossState === 'RESULT' && tossResult && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
             <div className="w-32 h-32 mx-auto rounded-full bg-amber-500 flex items-center justify-center border-4 border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.6)] mb-6">
              <span className="text-stone-900 font-black text-2xl uppercase tracking-wider">{tossResult}</span>
            </div>
            
            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-wider">
              {winnerId === myId ? 'You won the toss!' : \`\${opponentName} won the toss!\`}
            </h3>
            
            <p className="text-amber-500 font-bold text-xl uppercase tracking-widest animate-pulse">
               {winnerId === myId ? 'You' : opponentName} will strike first!
            </p>
          </motion.div>
        )}
      </div>`
);

fs.writeFileSync('src/components/TossScreen.tsx', code);
