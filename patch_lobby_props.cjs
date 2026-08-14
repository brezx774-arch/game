const fs = require('fs');
const content = fs.readFileSync('src/components/LobbyScreen.tsx', 'utf-8');

let newContent = content.replace(
  `  onClaimDailyReward: () => void;`,
  `  onClaimDailyReward: () => void;\n  onSpendCoins: (amount: number) => void;`
);

newContent = newContent.replace(
  `  onClaimDailyReward,`,
  `  onClaimDailyReward,\n  onSpendCoins,`
);

// Now update the Store component in LobbyScreen.tsx
const storeReplacement = `
            <div className="w-full flex flex-col items-center justify-center h-64 bg-[#1e293b] border-2 border-[#334155] border-dashed rounded-xl p-6 text-center">
               <Store className="w-16 h-16 text-stone-600 mb-4" />
               <h3 className="text-xl font-black text-stone-400 mb-2">Coming Soon</h3>
               <p className="text-sm text-stone-500 font-semibold">
                 Use your coins to buy custom dice, new bats, and exclusive player avatars in future updates!
               </p>
            </div>
`;

const newStoreContent = `
            <div className="w-full space-y-4 pb-20">
              {/* Item 1: Golden Bat */}
              <div className="bg-stone-800 rounded-2xl p-4 flex items-center justify-between border border-stone-700 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/50">
                    <span className="text-2xl">🏏</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-100">Golden Bat</h4>
                    <p className="text-xs text-stone-400">+10% XP per match</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (coins >= 1000) {
                      soundFx.playClick();
                      onSpendCoins(1000);
                      alert('You bought the Golden Bat! (Visual only for now)');
                    } else {
                      alert('Not enough coins!');
                    }
                  }}
                  className={\`px-4 py-2 rounded-xl font-black text-sm uppercase tracking-wider \${coins >= 1000 ? 'bg-amber-500 text-stone-900 shadow-lg shadow-amber-500/20' : 'bg-stone-700 text-stone-500'}\`}
                >
                  1000 🪙
                </button>
              </div>

              {/* Item 2: VIP Avatar Frame */}
              <div className="bg-stone-800 rounded-2xl p-4 flex items-center justify-between border border-stone-700 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/50">
                    <span className="text-2xl">🖼️</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-100">VIP Frame</h4>
                    <p className="text-xs text-stone-400">Stand out on Leaderboards</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (coins >= 500) {
                      soundFx.playClick();
                      onSpendCoins(500);
                      alert('You bought the VIP Frame! (Visual only for now)');
                    } else {
                      alert('Not enough coins!');
                    }
                  }}
                  className={\`px-4 py-2 rounded-xl font-black text-sm uppercase tracking-wider \${coins >= 500 ? 'bg-amber-500 text-stone-900 shadow-lg shadow-amber-500/20' : 'bg-stone-700 text-stone-500'}\`}
                >
                  500 🪙
                </button>
              </div>
            </div>
`;

newContent = newContent.replace(storeReplacement, newStoreContent);

fs.writeFileSync('src/components/LobbyScreen.tsx', newContent);
console.log('Lobby Props patched');
