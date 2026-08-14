const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf-8');

c = c.replace(
  `          onClaimDailyReward={claimDailyReward}
          onSpendCoins={(amount) => updateProfile({ coins: coins - amount })}`,
  `          onClaimDailyReward={claimDailyReward}
          onSpendCoins={(amount) => updateProfile({ coins: coins - amount })}
          playerName={profile?.displayName || user.displayName || 'Player'}
          playerAvatar={profile?.photoURL || user.photoURL || ''}`
);

fs.writeFileSync('src/App.tsx', c);
