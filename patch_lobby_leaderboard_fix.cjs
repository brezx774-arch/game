const fs = require('fs');
let c = fs.readFileSync('src/components/LobbyScreen.tsx', 'utf-8');

c = c.replace(
  "if (showLeaderboard) {\n    return <LeaderboardScreen onBack={() => setShowLeaderboard(false)} />;\n  }\n\n  return () => {",
  "return () => {"
);

const toReplace = `  useEffect(() => {
    if (activeTab === 'STORE' && !itemsPopulated) {
      setItemsPopulated(true);
    }
  }, [activeTab, itemsPopulated]);

  return (`;

const replaceWith = `  useEffect(() => {
    if (activeTab === 'STORE' && !itemsPopulated) {
      setItemsPopulated(true);
    }
  }, [activeTab, itemsPopulated]);

  if (showLeaderboard) {
    return <LeaderboardScreen onBack={() => setShowLeaderboard(false)} />;
  }

  return (`;

c = c.replace(toReplace, replaceWith);

fs.writeFileSync('src/components/LobbyScreen.tsx', c);
