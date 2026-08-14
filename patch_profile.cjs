const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf-8');

let newContent = content.replace(
  `  // Player Profile State (Persistent)
  const [coins, setCoins] = useState<number>(() => {
    return parseInt(localStorage.getItem('cricket_coins') || '150', 10);
  });
  const [xp, setXp] = useState<number>(() => {
    return parseInt(localStorage.getItem('cricket_xp') || '450', 10);
  });
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('cricket_stats');
    return saved ? JSON.parse(saved) : { matchesPlayed: 0, matchesWon: 0, totalRuns: 0, totalWickets: 0, highestScore: 0 };
  });

  const [dailyStreak, setDailyStreak] = useState<number>(() => {
    return parseInt(localStorage.getItem('cricket_daily_streak') || '0', 10);
  });
  const [lastLoginDate, setLastLoginDate] = useState<string>(() => {
    return localStorage.getItem('cricket_last_login') || '';
  });
  const [showDailyReward, setShowDailyReward] = useState<boolean>(false);
  const [dailyRewardAmount, setDailyRewardAmount] = useState<number>(0);

  // Persist Profile
  useEffect(() => {
    localStorage.setItem('cricket_coins', coins.toString());
    localStorage.setItem('cricket_xp', xp.toString());
    localStorage.setItem('cricket_stats', JSON.stringify(stats));
  }, [coins, xp, stats]);`,
  `  // Player Profile State (Firestore Sync)
  const { profile, updateProfile, profileLoading } = useProfile(user);
  
  const coins = profile?.coins || 0;
  const xp = profile?.xp || 0;
  const stats = profile?.stats || { matchesPlayed: 0, matchesWon: 0, totalRuns: 0, totalWickets: 0, highestScore: 0 };
  const dailyStreak = profile?.dailyStreak || 0;
  const lastLoginDate = profile?.lastLoginDate || '';

  const setCoins = (updater: any) => {
    const newVal = typeof updater === 'function' ? updater(profile.coins) : updater;
    updateProfile({ coins: newVal });
  };
  const setXp = (updater: any) => {
    const newVal = typeof updater === 'function' ? updater(profile.xp) : updater;
    updateProfile({ xp: newVal });
  };
  const setStats = (updater: any) => {
    const newVal = typeof updater === 'function' ? updater(profile.stats) : updater;
    updateProfile({ stats: newVal });
  };
  const setDailyStreak = (updater: any) => {
    const newVal = typeof updater === 'function' ? updater(profile.dailyStreak) : updater;
    updateProfile({ dailyStreak: newVal });
  };
  const setLastLoginDate = (updater: any) => {
    const newVal = typeof updater === 'function' ? updater(profile.lastLoginDate) : updater;
    updateProfile({ lastLoginDate: newVal });
  };

  const [showDailyReward, setShowDailyReward] = useState<boolean>(false);
  const [dailyRewardAmount, setDailyRewardAmount] = useState<number>(0);`
);

// We also need to add import for useProfile
newContent = newContent.replace(
  `import { auth } from './lib/firebase';`,
  `import { auth } from './lib/firebase';\nimport { useProfile } from './hooks/useProfile';`
);

// Remove the local storage persistence in Daily Reward Logic
newContent = newContent.replace(
  `      localStorage.setItem('cricket_daily_streak', newStreak.toString());\n      localStorage.setItem('cricket_last_login', today);`,
  `      // Persisted via updateProfile`
);

// Also need to handle authLoading and profileLoading together!
newContent = newContent.replace(
  `  if (authLoading) {`,
  `  if (authLoading || (user && profileLoading)) {`
);

fs.writeFileSync('src/App.tsx', newContent);
console.log('Done');
