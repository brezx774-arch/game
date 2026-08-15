import React from 'react';
import { motion } from 'motion/react';

export type BackgroundStyle = 'STADIUM' | 'MESH' | 'ARCADE';

interface Props {
  variant?: BackgroundStyle;
  inGame?: boolean;
}

export const AnimatedBackground: React.FC<Props> = ({ inGame = false }) => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#050B14] pointer-events-none" style={{ perspective: '1000px' }}>
      {/* Core Stadium Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-[#050B14] to-[#050B14]" />
      
      {/* Subtle giant cricket stumps watermark in background */}
      {!inGame && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full max-h-[800px] flex justify-center gap-12 opacity-5 blur-sm z-[-1]">
           <div className="w-8 h-3/4 bg-white rounded-t-full shadow-[0_0_50px_rgba(255,255,255,0.8)]" />
           <div className="w-8 h-3/4 bg-white rounded-t-full shadow-[0_0_50px_rgba(255,255,255,0.8)]" />
           <div className="w-8 h-3/4 bg-white rounded-t-full shadow-[0_0_50px_rgba(255,255,255,0.8)]" />
           {/* Bails */}
           <div className="absolute top-[24%] left-[20%] w-24 h-4 bg-white rounded-full rotate-3" />
           <div className="absolute top-[24%] right-[20%] w-24 h-4 bg-white rounded-full -rotate-3" />
        </div>
      )}

      {/* Dynamic 3D Spotlights */}
      <motion.div
        animate={{ rotateZ: [-10, 10, -10], rotateX: [30, 50, 30] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-[20%] left-[5%] w-[30vw] h-[150vh] bg-gradient-to-t from-white/30 via-blue-400/10 to-transparent blur-[20px] origin-bottom"
        style={{ transformStyle: 'preserve-3d' }}
      />
      <motion.div
        animate={{ rotateZ: [10, -10, 10], rotateX: [50, 30, 50] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-[20%] right-[5%] w-[30vw] h-[150vh] bg-gradient-to-t from-white/30 via-emerald-400/10 to-transparent blur-[20px] origin-bottom"
        style={{ transformStyle: 'preserve-3d' }}
      />

      {/* 3D Floating Sparks (Dust under floodlights) */}
      <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
        {[...Array(30)].map((_, i) => {
          const size = Math.random() * 4 + 2;
          return (
            <motion.div
              key={`spark-${i}`}
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                z: -800,
                opacity: 0,
              }}
              animate={{
                y: [null, -200],
                z: [null, 400], // flies toward camera
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 6 + 4,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5
              }}
              style={{ width: size, height: size, transformStyle: 'preserve-3d' }}
              className="absolute bg-amber-300 rounded-full shadow-[0_0_12px_3px_rgba(252,211,77,0.9)]"
            />
          );
        })}
      </div>

      {/* Stadium Crowd Camera Flashes */}
      <div className="absolute inset-0 z-[-1] overflow-hidden opacity-50">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`flash-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 0.1,
              repeat: Infinity,
              repeatDelay: Math.random() * 4 + 1,
              delay: Math.random() * 5,
            }}
            className="absolute bg-white rounded-full blur-[2px]"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              top: Math.random() * 40 + 10 + '%',
              left: Math.random() * 100 + '%',
              boxShadow: '0 0 10px 2px rgba(255,255,255,0.8)'
            }}
          />
        ))}
      </div>
    </div>
  );
};
