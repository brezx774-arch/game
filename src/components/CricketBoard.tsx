import React, { useMemo, useState, useEffect } from 'react';
import { BoardTile, Ground } from '../types';
import { BOARD_TILES } from '../utils/boardData';
import { motion, AnimatePresence } from 'motion/react';

interface CricketBoardProps {
  currentTileIndex: number;
  isRolling: boolean;
  onSelectTile?: (tile: BoardTile) => void;
  ground?: Ground;
}

export const CricketBoard: React.FC<CricketBoardProps> = ({
  currentTileIndex,
  isRolling,
  onSelectTile,
  ground,
}) => {
  const totalTiles = BOARD_TILES.length; // 32 tiles

  // Calculate coordinates for 32 tiles around a rounded square track
  const tilesWithCoords = useMemo(() => {
    return BOARD_TILES.map((tile, index) => {
      // Create a rounded square track (like a Monopoly board) rather than a pure circle
      // to give more space for the pitch in the center.
      // Progress from 0 to 1 around the board
      const progress = index / totalTiles;
      const perimeterOffset = progress * 4; // 4 sides
      
      const side = Math.floor(perimeterOffset); // 0: Top, 1: Right, 2: Bottom, 3: Left
      const sideProgress = perimeterOffset % 1;
      
      const minP = 15; // padding from edge
      const maxP = 85;
      const range = maxP - minP;
      
      let x = 50;
      let y = 50;
      
      if (side === 0) { // Top edge, moving right
        x = minP + (sideProgress * range);
        y = minP;
      } else if (side === 1) { // Right edge, moving down
        x = maxP;
        y = minP + (sideProgress * range);
      } else if (side === 2) { // Bottom edge, moving left
        x = maxP - (sideProgress * range);
        y = maxP;
      } else { // Left edge, moving up
        x = minP;
        y = maxP - (sideProgress * range);
      }
      
      // Add slight curved bulging to the sides to make it a squircle
      if (side === 0 || side === 2) { // Top/Bottom
        const distFromCenter = Math.abs(x - 50);
        const bulge = (1 - (distFromCenter / 35)) * 4;
        y = side === 0 ? y - Math.max(0, bulge) : y + Math.max(0, bulge);
      } else {
        const distFromCenter = Math.abs(y - 50);
        const bulge = (1 - (distFromCenter / 35)) * 4;
        x = side === 3 ? x - Math.max(0, bulge) : x + Math.max(0, bulge);
      }

      return {
        ...tile,
        index,
        x,
        y,
      };
    });
  }, [totalTiles]);

  const currentTile = BOARD_TILES[currentTileIndex] || BOARD_TILES[0];

  const [showBoundaryAnim, setShowBoundaryAnim] = useState<string | null>(null);

  useEffect(() => {
    if (!isRolling) {
      if (currentTile.type === 'RUN_4') {
        setShowBoundaryAnim('4');
        const t = setTimeout(() => setShowBoundaryAnim(null), 2500);
        return () => clearTimeout(t);
      } else if (currentTile.type === 'RUN_6' || currentTile.type === 'POWER_SHOT') {
        setShowBoundaryAnim('6');
        const t = setTimeout(() => setShowBoundaryAnim(null), 2500);
        return () => clearTimeout(t);
      }
    } else {
      setShowBoundaryAnim(null);
    }
  }, [isRolling, currentTile]);

  return (
    <div id="board-container" className="relative w-full max-w-[500px] aspect-square mx-auto my-2 flex items-center justify-center p-2 select-none perspective-[1200px]">
      
      {/* 3D Board Base (Wood/Metal) */}
      <div 
        className="absolute inset-4 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.5),inset_0_-10px_20px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.4)]"
        style={{
          background: 'linear-gradient(145deg, #4b3621 0%, #2a1f12 100%)', // Rich wood texture base
          border: '4px solid #8b5a2b', // Wood trim
          transform: 'rotateX(15deg) scale(0.95)',
          transformStyle: 'preserve-3d',
        }}
      >
        
        {/* Stadium Grass Surface */}
        <div 
          className={`absolute inset-2 rounded-[32px] overflow-hidden shadow-[inset_0_5px_15px_rgba(0,0,0,0.6)] transition-colors duration-1000 ${ground?.grassColorClass || "bg-emerald-800"}`}
        >
          {/* Mown grass stripes */}
          <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(0deg,transparent,transparent_20px,#ffffff_20px,#ffffff_40px)]" />
          
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPHBhdGggZD0iTTAgMEgxdjFIMHoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4xIi8+CjxwYXRoIGQ9Ik0yIDFIM3YxSDJ6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')]" />
          
          {/* Boundary Rope */}
          <div className="absolute inset-8 rounded-[24px] border-4 border-dashed border-white/60 shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-colors duration-1000" />

          {/* Stadium Crowd / Stands (Outer Edge) */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/40 to-transparent flex justify-around items-start overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div 
                key={`crowd-${i}`}
                className="w-1.5 h-1.5 rounded-full mt-1"
                style={{ backgroundColor: ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#ffffff'][Math.floor(Math.random() * 5)] }}
                animate={{
                  y: [0, -2, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 0.5 + Math.random() * 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random()
                }}
              />
            ))}
          </div>

          {/* Central Pitch Area */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%] h-[40%] rounded-md shadow-[inset_0_0_10px_rgba(0,0,0,0.2),0_4px_10px_rgba(0,0,0,0.3)] flex flex-col justify-between items-center py-2 border-2 border-black/20 transition-colors duration-1000 ${ground?.pitchColorClass || "bg-[#d9b88c]"}`}>
             {/* Pitch Texture */}
             <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPHBhdGggZD0iTTAgMEgxdjFIMHoiIGZpbGw9IiM4YjVhMmIiIGZpbGwtb3BhY2l0eT0iMC41Ii8+Cjwvc3ZnPg==')]" />
            
             {/* Boundary Animation Overlay */}
             <AnimatePresence>
               {showBoundaryAnim && (
                 <motion.div
                   key="boundary-anim"
                   initial={{ scale: 0, opacity: 0, y: 50, rotateX: 30 }}
                   animate={{ scale: [0, 1.8, 1.4], opacity: 1, y: -20, rotateX: 0 }}
                   exit={{ opacity: 0, scale: 2, y: -60 }}
                   transition={{ duration: 1.5, times: [0, 0.4, 1], ease: "easeOut" }}
                   className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
                 >
                    <div className="relative">
                      {/* Exploding starburst behind text */}
                      <motion.div 
                        animate={{ rotate: 180, scale: [0.5, 1.2, 1.5], opacity: [1, 0] }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[radial-gradient(circle,rgba(255,255,255,1)_0%,rgba(251,191,36,0)_70%)] mix-blend-overlay"
                      />
                      <span className="text-5xl sm:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-tr from-[#facc15] to-[#fef08a] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] tracking-tighter" style={{ WebkitTextStroke: '2px #000' }}>
                        {showBoundaryAnim === '4' ? 'FOUR!' : 'SIX!'}
                      </span>
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>

             {/* Top Crease */}
             <div className="relative w-full px-2 flex flex-col items-center">
               <div className="w-full h-[2px] bg-white/90 shadow-[0_0_2px_rgba(255,255,255,0.8)]" />
               <div className="flex gap-[2px] mt-1">
                 <div className="w-[3px] h-4 bg-amber-200 rounded-t-sm shadow-sm" />
                 <div className="w-[3px] h-4 bg-amber-200 rounded-t-sm shadow-sm" />
                 <div className="w-[3px] h-4 bg-amber-200 rounded-t-sm shadow-sm" />
               </div>
             </div>
             
             {/* Dust patches */}
             <div className="w-3/4 h-1/3 bg-amber-900/10 blur-[4px] rounded-full" />

             {/* Bottom Crease */}
             <div className="relative w-full px-2 flex flex-col items-center">
               <div className="flex gap-[2px] mb-1">
                 <div className="w-[3px] h-4 bg-amber-200 rounded-t-sm shadow-sm" />
                 <div className="w-[3px] h-4 bg-amber-200 rounded-t-sm shadow-sm" />
                 <div className="w-[3px] h-4 bg-amber-200 rounded-t-sm shadow-sm" />
               </div>
               <div className="w-full h-[2px] bg-white/90 shadow-[0_0_2px_rgba(255,255,255,0.8)]" />
             </div>
          </div>
        </div>
      </div>

      {/* Floating Stadium Lights */}
      <motion.div 
        animate={{ opacity: [0.6, 0.9, 0.6] }} 
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-0 left-6 w-12 h-12 bg-white rounded-full blur-[20px] pointer-events-none mix-blend-overlay" 
      />
      <motion.div 
        animate={{ opacity: [0.5, 0.8, 0.5] }} 
        transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
        className="absolute top-0 right-6 w-12 h-12 bg-white rounded-full blur-[20px] pointer-events-none mix-blend-overlay" 
      />

      {/* The Tiles */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-auto"
        style={{ transform: 'rotateX(15deg)', transformStyle: 'preserve-3d' }}
      >
        {tilesWithCoords.map((tile) => {
          const isSelected = tile.index === currentTileIndex;
          const isCorner = tile.index % 8 === 0;
          
          const isBlackSquare = tile.bgHex === '#1c1917' || tile.bgHex === '#262626';
          const tileBg = (isBlackSquare && ground?.pitchHex) ? ground.pitchHex : tile.bgHex;
          const tileText = (isBlackSquare && ground?.pitchHex) ? '#292524' : tile.textHex;
          const tileBorder = (isBlackSquare && ground?.pitchHex) ? '#44403c40' : tile.borderHex;

          return (
            <motion.div
              key={tile.id}
              style={{
                left: `${tile.x}%`,
                top: `${tile.y}%`,
                x: '-50%',
                y: '-50%',
                backgroundColor: tileBg,
                borderColor: tileBorder,
                color: tileText,
              }}
              animate={isSelected && !isRolling ? {
                y: ['-50%', '-60%', '-50%'],
                scale: 1.15,
                boxShadow: `0 15px 25px -5px ${tile.borderHex}80, 0 8px 10px -6px ${tile.borderHex}80, inset 0 2px 4px rgba(255,255,255,0.5)`,
              } : {
                y: '-50%',
                scale: 1,
                boxShadow: `0 6px 12px -2px rgba(0,0,0,0.5), inset 0 2px 2px rgba(255,255,255,0.4), inset 0 -4px 0 rgba(0,0,0,0.2)`,
              }}
              transition={isSelected && !isRolling ? {
                y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                scale: { type: "spring", stiffness: 300, damping: 20 }
              } : {
                type: "spring", stiffness: 300, damping: 20
              }}
              className={`absolute z-10 cursor-pointer flex flex-col items-center justify-center font-black ${
                isCorner ? 'w-10 h-10 sm:w-12 sm:h-12 text-sm sm:text-base rounded-xl border-4' : 'w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm rounded-lg border-[3px]'
              } transform-gpu`}
              onClick={() => onSelectTile && onSelectTile(tile)}
              title={`${tile.sublabel || tile.label} (Tile ${tile.index + 1})`}
            >
              <span className="drop-shadow-sm">{tile.label}</span>
            </motion.div>
          );
        })}

        {/* Cute Cartoon Player Token */}
        <motion.div
          animate={{
            left: `${tilesWithCoords[currentTileIndex]?.x || 50}%`,
            top: `${tilesWithCoords[currentTileIndex]?.y || 50}%`,
            x: '-50%',
            y: '-50%',
          }}
          transition={{
            left: { type: 'spring', stiffness: 200, damping: 22 },
            top: { type: 'spring', stiffness: 200, damping: 22 },
          }}
          className="absolute z-40 pointer-events-none drop-shadow-2xl flex flex-col items-center"
        >
          {/* Dynamic Shadow underneath player */}
          <motion.div 
            animate={{ 
              scale: isRolling ? [1, 0.6, 1] : 1,
              opacity: isRolling ? [0.8, 0.4, 0.8] : 0.8
            }}
            transition={{
               scale: { type: 'tween', duration: isRolling ? 0.3 : 0.6, repeat: isRolling ? Infinity : 0 },
               opacity: { type: 'tween', duration: isRolling ? 0.3 : 0.6, repeat: isRolling ? Infinity : 0 }
            }}
            className="absolute -bottom-1 w-6 h-2 bg-black/60 rounded-full blur-[2px]" 
          />

          {/* Player Sprite Wrapper */}
          <motion.div
             animate={isRolling ? {
               y: [0, -25, 0], // Jumping while rolling
               rotate: [0, -10, 10, 0],
             } : {
               y: [0, -3, 0], // Idle breathing
               scaleY: [1, 0.95, 1], // Squash and stretch breathing
             }}
             transition={isRolling ? {
               y: { duration: 0.3, repeat: Infinity, ease: "easeOut" },
               rotate: { duration: 0.4, repeat: Infinity, ease: "linear" }
             } : {
               duration: 1.5, repeat: Infinity, ease: "easeInOut"
             }}
             className="relative"
          >
            {/* Built with DOM elements for a pure CSS cartoon character look */}
            <div className="relative w-10 h-14 drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)] scale-[0.55] sm:scale-[0.65] origin-bottom">
              {/* Helmet */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-7 bg-blue-600 rounded-t-full border-2 border-blue-800 z-20 overflow-hidden">
                <div className="absolute top-1 right-1 w-2 h-1 bg-white/40 rounded-full rotate-45" />
                {/* Grill */}
                <div className="absolute bottom-0 left-0 right-0 h-3 border-t-2 border-slate-300 bg-slate-800/30">
                  <div className="w-full h-[1px] bg-slate-300 mt-[2px]" />
                  <div className="w-full h-[1px] bg-slate-300 mt-[2px]" />
                </div>
              </div>
              
              {/* Face */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-6 h-5 bg-[#fcd4b1] rounded-b-xl border-x-2 border-b-2 border-[#d09d70] z-10 flex justify-center items-center gap-1">
                 {/* Eyes */}
                 <motion.div 
                   animate={{ scaleY: [1, 1, 0.1, 1, 1] }} 
                   transition={{ duration: 4, repeat: Infinity, times: [0, 0.95, 0.96, 0.97, 1] }}
                   className="w-1.5 h-1.5 bg-slate-900 rounded-full" 
                 />
                 <motion.div 
                   animate={{ scaleY: [1, 1, 0.1, 1, 1] }} 
                   transition={{ duration: 4, repeat: Infinity, times: [0, 0.95, 0.96, 0.97, 1] }}
                   className="w-1.5 h-1.5 bg-slate-900 rounded-full" 
                 />
              </div>

              {/* Body / Jersey */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-7 h-6 bg-blue-500 rounded-t-lg border-2 border-blue-700 z-20 flex justify-center items-center">
                <span className="text-[8px] font-black text-yellow-400">10</span>
              </div>
              
              {/* Bat (Swinging if rolling) */}
              <motion.div 
                animate={isRolling ? { rotate: [-20, 60, -20] } : { rotate: 15 }}
                transition={isRolling ? { duration: 0.3, repeat: Infinity } : {}}
                className="absolute top-8 -right-2 w-2 h-8 bg-[#d2b48c] rounded-b-sm rounded-t-full border border-[#8b5a2b] z-30 origin-top"
              >
                <div className="w-full h-2 bg-red-600 rounded-t-full" /> {/* Handle grip */}
              </motion.div>

              {/* Legs */}
              <div className="absolute top-[52px] left-2 w-2 h-3 bg-white border border-slate-300 rounded-sm z-10" />
              <div className="absolute top-[52px] right-2 w-2 h-3 bg-white border border-slate-300 rounded-sm z-10" />

              {/* Shoes */}
              <div className="absolute top-[62px] left-1 w-3 h-2 bg-red-500 rounded-full border border-red-700 z-10" />
              <div className="absolute top-[62px] right-1 w-3 h-2 bg-red-500 rounded-full border border-red-700 z-10" />
            </div>
          </motion.div>

          {/* Dust Particles when moving */}
          <AnimatePresence>
            {isRolling && (
              <motion.div
                initial={{ opacity: 1, scale: 0 }}
                animate={{ opacity: 0, scale: 2, y: 10 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute -bottom-2 w-4 h-2 bg-white/50 blur-[2px] rounded-full"
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

