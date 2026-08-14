const fs = require('fs');
const content = fs.readFileSync('src/components/LobbyScreen.tsx', 'utf-8');

let newContent = content.replace(
  `import { GameSettings } from '../types';`,
  `import { GameSettings } from '../types';\nimport { LeaderboardScreen } from './LeaderboardScreen';`
);

newContent = newContent.replace(
  `  const [activeTab, setActiveTab] = useState<'HOME' | 'PROFILE' | 'STORE'>('HOME');`,
  `  const [activeTab, setActiveTab] = useState<'HOME' | 'PROFILE' | 'STORE'>('HOME');\n  const [showLeaderboard, setShowLeaderboard] = useState(false);`
);

newContent = newContent.replace(
  `                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="h-16 rounded-2xl bg-gradient-to-b from-stone-800 to-stone-900 border-b-[6px] border-black text-stone-200 flex flex-col items-center justify-center gap-1 shadow-xl relative overflow-hidden opacity-50 cursor-not-allowed"
                      >
                        <Trophy className="w-5 h-5 text-[#facc15] drop-shadow-sm" />
                        <span className="text-[9px] font-black tracking-widest uppercase">Leaderboard</span>
                      </motion.button>`,
  `                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          soundFx.playClick();
                          setShowLeaderboard(true);
                        }}
                        className="h-16 rounded-2xl bg-gradient-to-b from-stone-800 to-stone-900 border-b-[6px] border-black text-stone-200 flex flex-col items-center justify-center gap-1 shadow-xl relative overflow-hidden cursor-pointer"
                      >
                        <Trophy className="w-5 h-5 text-[#facc15] drop-shadow-sm" />
                        <span className="text-[9px] font-black tracking-widest uppercase">Leaderboard</span>
                      </motion.button>`
);

newContent = newContent.replace(
  `      {/* Settings Drawer */}`,
  `      {showLeaderboard && (
        <LeaderboardScreen onBack={() => setShowLeaderboard(false)} />
      )}
      
      {/* Settings Drawer */}`
);

fs.writeFileSync('src/components/LobbyScreen.tsx', newContent);
console.log('Lobby patched');
