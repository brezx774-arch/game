const fs = require('fs');
const path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

const oldEffect = `// Daily Reward Logic
  useEffect(() => {
    if (!user || profileLoading) return; // Wait until loaded

    const today = new Date().toDateString();
    // Only claim if it's not today. Empty string counts as 'never claimed'.
    if (lastLoginDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      let newStreak = dailyStreak;
      if (lastLoginDate === yesterday.toDateString()) {
        newStreak += 1;
      } else {
        newStreak = 1; // Reset streak if missed a day or first time
      }
      
      const reward = 50 + (Math.min(newStreak, 7) * 10); // Cap multiplier at 7 days
      setDailyRewardAmount(reward);
      setDailyStreak(newStreak);
      setLastLoginDate(today);
      setShowDailyReward(true);
      
      // Persisted via updateProfile
    }
  }, [lastLoginDate, dailyStreak, profileLoading, user]);`;

const newEffect = `// Daily Reward Logic
  useEffect(() => {
    if (!user || profileLoading) return; // Wait until loaded

    const today = new Date().toDateString();
    // Only claim if it's not today. Empty string counts as 'never claimed'.
    if (lastLoginDate !== today && !showDailyReward) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      let newStreak = dailyStreak;
      if (lastLoginDate === yesterday.toDateString()) {
        newStreak += 1;
      } else {
        newStreak = 1; // Reset streak if missed a day or first time
      }
      
      const reward = 50 + (Math.min(newStreak, 7) * 10); // Cap multiplier at 7 days
      setDailyRewardAmount(reward);
      setShowDailyReward(true);
    }
  }, [lastLoginDate, dailyStreak, profileLoading, user, showDailyReward, setShowDailyReward]);`;

const oldClaim = `const claimDailyReward = () => {
    soundFx.playPowerplayChime();
    setCoins(c => c + dailyRewardAmount);
    setShowDailyReward(false);
  };`;

const newClaim = `const claimDailyReward = () => {
    soundFx.playPowerplayChime();
    
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    let newStreak = dailyStreak;
    if (lastLoginDate === yesterday.toDateString()) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    updateProfile({
      coins: coins + dailyRewardAmount,
      dailyStreak: newStreak,
      lastLoginDate: today
    });
    
    setShowDailyReward(false);
  };`;

code = code.replace(oldEffect, newEffect);
code = code.replace(oldClaim, newClaim);

fs.writeFileSync(path, code);
console.log('Daily reward logic patched');
