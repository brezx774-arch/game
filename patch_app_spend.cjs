const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf-8');

let newContent = content.replace(
  `onClaimDailyReward={claimDailyReward}`,
  `onClaimDailyReward={claimDailyReward}\n          onSpendCoins={(amount) => updateProfile({ coins: coins - amount })}`
);

fs.writeFileSync('src/App.tsx', newContent);
console.log('App patched');
