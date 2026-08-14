const fs = require('fs');
let c = fs.readFileSync('src/components/LobbyScreen.tsx', 'utf-8');

if (!c.includes('LeaderboardScreen')) {
  c = c.replace(
    "import { socketService } from '../utils/socket';",
    "import { socketService } from '../utils/socket';\nimport { LeaderboardScreen } from './LeaderboardScreen';"
  );
}

const returnToReplace = `  useEffect(() => {
    if (activeTab === 'STORE' && !itemsPopulated) {
      setItemsPopulated(true);
    }
  }, [activeTab, itemsPopulated]);

  return (`;

const replaceWithReturn = `  useEffect(() => {
    if (activeTab === 'STORE' && !itemsPopulated) {
      setItemsPopulated(true);
    }
  }, [activeTab, itemsPopulated]);

  if (showLeaderboard) {
    return <LeaderboardScreen onBack={() => setShowLeaderboard(false)} />;
  }

  return (`;

if (c.includes(returnToReplace)) {
  c = c.replace(returnToReplace, replaceWithReturn);
} else {
    // maybe we can just find 'return (' that is at the root of the component.
    c = c.replace(/  return \(\s*<div className="fixed inset-0/, '  if (showLeaderboard) return <LeaderboardScreen onBack={() => setShowLeaderboard(false)} />;\n\n  return (\n    <div className="fixed inset-0');
}

fs.writeFileSync('src/components/LobbyScreen.tsx', c);
