import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  coins: number;
  matchesPlayed: number;
  matchesWon: number;
  highestScore: number;
  createdAt: string;
  lastLoginAt: string;
  dailyStreak: number;
}

interface PlayerStore {
  user: User | null;
  setUser: (u: User | null) => void;
  authLoading: boolean;
  setAuthLoading: (b: boolean) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
  authLoading: true,
  setAuthLoading: (b) => set({ authLoading: b }),
}));
