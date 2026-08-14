import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PlayerProfile } from '../hooks/useProfile';
import { motion } from 'motion/react';
import { Trophy, ArrowLeft, Medal, Star } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface LeaderboardScreenProps {
  onBack: () => void;
}

interface LeaderboardEntry extends PlayerProfile {
  id: string;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(50));
        const querySnapshot = await getDocs(q);
        const fetchedPlayers: LeaderboardEntry[] = [];
        querySnapshot.forEach((doc) => {
          fetchedPlayers.push({ id: doc.id, ...doc.data() } as LeaderboardEntry);
        });
        setPlayers(fetchedPlayers);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <div className="fixed inset-0 bg-stone-950 flex flex-col z-50 overflow-hidden text-stone-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-stone-900 border-b border-stone-800">
        <button
          onClick={() => {
            soundFx.playClick();
            onBack();
          }}
          className="p-2 -ml-2 text-stone-400 hover:text-stone-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-black italic tracking-wider flex items-center gap-2">
          <Trophy className="text-[#facc15] w-5 h-5" /> GLOBAL RANKINGS
        </h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          players.map((player, index) => {
            const isTop3 = index < 3;
            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`w-full bg-stone-900 rounded-2xl p-4 flex items-center gap-4 border ${
                  index === 0 ? 'border-[#facc15]/50 bg-[#facc15]/10' :
                  index === 1 ? 'border-slate-300/50 bg-slate-300/10' :
                  index === 2 ? 'border-amber-600/50 bg-amber-600/10' : 'border-stone-800'
                }`}
              >
                <div className="w-8 flex justify-center">
                  {index === 0 ? <Medal className="w-7 h-7 text-[#facc15]" /> :
                   index === 1 ? <Medal className="w-7 h-7 text-slate-300" /> :
                   index === 2 ? <Medal className="w-7 h-7 text-amber-600" /> :
                   <span className="text-lg font-black text-stone-500">#{index + 1}</span>}
                </div>
                
                {player.photoURL ? (
                  <img src={player.photoURL} alt="Avatar" className="w-10 h-10 rounded-full border border-stone-700" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center border border-stone-700">
                    <span className="text-sm font-bold text-stone-400">
                      {(player.displayName || 'P')[0].toUpperCase()}
                    </span>
                  </div>
                )}
                
                <div className="flex-1 overflow-hidden">
                  <div className="font-bold text-base truncate">{player.displayName || 'Anonymous'}</div>
                  <div className="flex items-center gap-3 text-xs text-stone-400 mt-1">
                    <span>W: <span className="text-stone-200">{player.stats?.matchesWon || 0}</span></span>
                    <span>HS: <span className="text-stone-200">{player.stats?.highestScore || 0}</span></span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-emerald-400 font-black">
                    <Star className="w-3 h-3 fill-emerald-400" />
                    {player.xp}
                  </div>
                  <div className="text-[10px] text-stone-500 font-bold tracking-wider mt-1">XP</div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
