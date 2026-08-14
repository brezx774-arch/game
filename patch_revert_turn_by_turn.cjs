const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add currentStrike state back
code = code.replace(
  "  const [phase, setPhase] = useState<GamePhase>('INNINGS_1');",
  "  const [currentStrike, setCurrentStrike] = useState<'YOU' | 'AI'>('YOU');\n  const [phase, setPhase] = useState<GamePhase>('INNINGS_1');"
);
code = code.replace(
  "  const [myTurnAction, setMyTurnAction] = useState<{tactic: TacticMode, roll: number, catchRand?: number} | null>(null);",
  "  const [myTurnAction, setMyTurnAction] = useState<{tactic: TacticMode, roll: number, catchRand?: number} | null>(null);\n  const [opponentTurnAction, setOpponentTurnAction] = useState<{tactic: TacticMode, roll: number, catchRand?: number} | null>(null);\n  const [isRolling, setIsRolling] = useState<boolean>(false);\n  const [turnTimer, setTurnTimer] = useState<number>(10);"
);

fs.writeFileSync('src/App.tsx', code);
