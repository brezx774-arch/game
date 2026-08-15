import React from 'react';
import { motion } from 'motion/react';

export type BackgroundStyle = 'STADIUM' | 'MESH' | 'ARCADE';

interface Props {
  variant?: BackgroundStyle;
  inGame?: boolean;
}

export const AnimatedBackground: React.FC<Props> = ({ variant = 'STADIUM', inGame = false }) => {
  if (variant === 'STADIUM') {
    return (
      <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0a1128] pointer-events-none">
        {/* Subtle glowing orbs representing stadium lights */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.3, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/20 rounded-full blur-[120px]"
        />
        
        {/* Sweeping light beams */}
        {inGame && (
          <motion.div
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 left-[20%] w-[100px] h-[150%] bg-white/5 blur-[50px] origin-top transform -skew-x-[30deg]"
          />
        )}

        {/* Floating dust particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`dust-${i}`}
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              opacity: Math.random() * 0.5 + 0.1
            }}
            animate={{
              y: [null, -100],
              opacity: [null, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-white/40 rounded-full blur-[1px]"
          />
        ))}
      </div>
    );
  }

  if (variant === 'MESH') {
    return (
      <div className="fixed inset-0 z-[-1] overflow-hidden bg-stone-950 pointer-events-none">
        {/* Mesh gradient blobs */}
        <motion.div
          animate={{ 
            x: ['0%', '20%', '-10%', '0%'],
            y: ['0%', '-20%', '10%', '0%'],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[10%] left-[10%] w-[60vw] h-[60vw] max-w-[400px] max-h-[400px] bg-emerald-600/30 rounded-full blur-[80px]"
        />
        <motion.div
          animate={{ 
            x: ['0%', '-20%', '10%', '0%'],
            y: ['0%', '20%', '-10%', '0%'],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[10%] right-[10%] w-[70vw] h-[70vw] max-w-[500px] max-h-[500px] bg-amber-600/30 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ 
            x: ['0%', '10%', '-20%', '0%'],
            y: ['0%', '10%', '20%', '0%'],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[40%] left-[30%] w-[50vw] h-[50vw] max-w-[300px] max-h-[300px] bg-purple-600/20 rounded-full blur-[90px]"
        />
      </div>
    );
  }

  // Arcade Variant
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black pointer-events-none perspective-[1000px]">
      {/* Background dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />
      
      {/* Sun/Moon element in distance */}
      {!inGame && (
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b from-amber-400 to-rose-600 rounded-full blur-[4px] opacity-60" />
      )}

      {/* Grid */}
      <div className="absolute bottom-0 w-[200%] h-[60%] left-[-50%] transform rotate-x-[60deg] origin-bottom">
        <motion.div 
          animate={{ y: ['0%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(236,72,153,0.5)_100%),linear-gradient(90deg,transparent_95%,rgba(236,72,153,0.5)_100%)] bg-[size:40px_40px]"
          style={{ backgroundPosition: 'center 0' }}
        />
      </div>

      {/* Speed lines for in-game */}
      {inGame && (
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`line-${i}`}
              initial={{ y: -100, x: Math.random() * 100 + '%' }}
              animate={{ y: '120vh' }}
              transition={{
                duration: Math.random() * 0.5 + 0.5,
                repeat: Infinity,
                ease: 'linear',
                delay: Math.random() * 2
              }}
              className="absolute w-px h-32 bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
              style={{ left: `${Math.random() * 100}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
