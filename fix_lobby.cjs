const fs = require('fs');
let c = fs.readFileSync('src/components/LobbyScreen.tsx', 'utf-8');
c = c.replace(
  "  onClaimDailyReward,\n  onSpendCoins: () => void;\n  onSpendCoins: (amount: number) => void;",
  "  onClaimDailyReward: () => void;\n  onSpendCoins: (amount: number) => void;"
);
fs.writeFileSync('src/components/LobbyScreen.tsx', c);
