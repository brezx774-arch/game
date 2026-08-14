const fs = require('fs');
let c = fs.readFileSync('src/components/LobbyScreen.tsx', 'utf-8');

c = c.replace(
  '  return (\n    <div className="flex flex-col items-center min-h-screen p-4 z-10 w-full max-w-md mx-auto relative pb-24 pt-8">',
  '  if (showLeaderboard) return <LeaderboardScreen onBack={() => setShowLeaderboard(false)} />;\n\n  return (\n    <div className="flex flex-col items-center min-h-screen p-4 z-10 w-full max-w-md mx-auto relative pb-24 pt-8">'
);

fs.writeFileSync('src/components/LobbyScreen.tsx', c);
