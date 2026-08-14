const fs = require('fs');
const content = fs.readFileSync('src/hooks/useProfile.ts', 'utf-8');

let newContent = content.replace(
  `export interface PlayerProfile {
  coins: number;
  xp: number;
  stats: PlayerStats;
  dailyStreak: number;
  lastLoginDate: string;
}`,
  `export interface PlayerProfile {
  coins: number;
  xp: number;
  stats: PlayerStats;
  dailyStreak: number;
  lastLoginDate: string;
  displayName?: string;
  photoURL?: string;
}`
);

newContent = newContent.replace(
  `        if (docSnap.exists()) {
          setProfile(docSnap.data() as PlayerProfile);
        } else {`,
  `        if (docSnap.exists()) {
          const data = docSnap.data() as PlayerProfile;
          // Ensure we capture their latest name/photo on login
          if (user.displayName !== data.displayName || user.photoURL !== data.photoURL) {
            data.displayName = user.displayName || 'Player';
            data.photoURL = user.photoURL || '';
            await setDoc(docRef, { displayName: data.displayName, photoURL: data.photoURL }, { merge: true });
          }
          setProfile(data);
        } else {`
);

newContent = newContent.replace(
  `          const initialProfile: PlayerProfile = {
            coins: localCoins,
            xp: localXp,
            stats: localStats,
            dailyStreak: localStreak,
            lastLoginDate: localLogin
          };`,
  `          const initialProfile: PlayerProfile = {
            coins: localCoins,
            xp: localXp,
            stats: localStats,
            dailyStreak: localStreak,
            lastLoginDate: localLogin,
            displayName: user.displayName || 'Player',
            photoURL: user.photoURL || ''
          };`
);

fs.writeFileSync('src/hooks/useProfile.ts', newContent);
console.log('useProfile patched');
