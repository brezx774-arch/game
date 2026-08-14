import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface PlayerStats {
  matchesPlayed: number;
  matchesWon: number;
  totalRuns: number;
  totalWickets: number;
  highestScore: number;
}

export interface PlayerProfile {
  coins: number;
  xp: number;
  stats: PlayerStats;
  dailyStreak: number;
  lastLoginDate: string;
  displayName?: string;
  photoURL?: string;
}

const DEFAULT_PROFILE: PlayerProfile = {
  coins: 150,
  xp: 450,
  stats: { matchesPlayed: 0, matchesWon: 0, totalRuns: 0, totalWickets: 0, highestScore: 0 },
  dailyStreak: 0,
  lastLoginDate: ''
};

export function useProfile(user: User | null) {
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  // Fetch profile on load
  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as PlayerProfile;
          // Ensure we capture their latest name/photo on login
          if (user.displayName !== data.displayName || user.photoURL !== data.photoURL) {
            data.displayName = user.displayName || 'Player';
            data.photoURL = user.photoURL || '';
            await setDoc(docRef, { displayName: data.displayName, photoURL: data.photoURL }, { merge: true });
          }
          setProfile(data);
        } else {
          // Check if there is anything in local storage to migrate, otherwise use default
          const localCoins = parseInt(localStorage.getItem('cricket_coins') || '150', 10);
          const localXp = parseInt(localStorage.getItem('cricket_xp') || '450', 10);
          const localStatsStr = localStorage.getItem('cricket_stats');
          const localStats = localStatsStr ? JSON.parse(localStatsStr) : DEFAULT_PROFILE.stats;
          const localStreak = parseInt(localStorage.getItem('cricket_daily_streak') || '0', 10);
          const localLogin = localStorage.getItem('cricket_last_login') || '';

          const initialProfile: PlayerProfile = {
            coins: localCoins,
            xp: localXp,
            stats: localStats,
            dailyStreak: localStreak,
            lastLoginDate: localLogin,
            displayName: user.displayName || 'Player',
            photoURL: user.photoURL || ''
          };

          await setDoc(docRef, initialProfile);
          setProfile(initialProfile);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  // A debounced save function could be used here, but we can also just expose an update function
  const updateProfile = async (updates: Partial<PlayerProfile>) => {
    if (!user) return;
    
    setProfile(prev => {
      const newProfile = { ...prev, ...updates };
      
      // Fire and forget update to Firestore
      const docRef = doc(db, 'users', user.uid);
      setDoc(docRef, newProfile, { merge: true }).catch(err => {
        console.error('Failed to save profile:', err);
      });
      
      return newProfile;
    });
  };

  return { profile, updateProfile, profileLoading: loading };
}
