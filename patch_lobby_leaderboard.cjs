const fs = require('fs');
let c = fs.readFileSync('src/components/LobbyScreen.tsx', 'utf-8');

c = c.replace(
  "import { LogOut, Trophy, Store, Zap, Settings, Shield, Edit3, Volume2, Search, Play, Users, X, Info } from 'lucide-react';",
  "import { LogOut, Trophy, Store, Zap, Settings, Shield, Edit3, Volume2, Search, Play, Users, X, Info } from 'lucide-react';\nimport { LeaderboardScreen } from './LeaderboardScreen';"
);

c = c.replace(
  "className=\"h-16 rounded-2xl bg-gradient-to-b from-stone-800 to-stone-900 border-b-[6px] border-black text-stone-200 flex flex-col items-center justify-center gap-1 shadow-xl relative overflow-hidden opacity-50 cursor-not-allowed\"",
  "onClick={() => setShowLeaderboard(true)}\n                        className=\"h-16 rounded-2xl bg-gradient-to-b from-stone-800 to-stone-900 border-b-[6px] border-stone-950 hover:border-b-[4px] hover:translate-y-[2px] active:border-b-[0px] active:translate-y-[6px] text-stone-200 flex flex-col items-center justify-center gap-1 shadow-xl relative overflow-hidden transition-all\""
);

c = c.replace(
  "return (",
  "if (showLeaderboard) {\n    return <LeaderboardScreen onBack={() => setShowLeaderboard(false)} />;\n  }\n\n  return ("
);

fs.writeFileSync('src/components/LobbyScreen.tsx', c);
