import React, { useMemo } from 'react';
import { BoardTile, Ground, PlayerState } from '../types';
import { BOARD_TILES } from '../utils/boardData';
import { motion, AnimatePresence } from 'motion/react';

interface CricketBoardProps {
  youTileIndex: number;
  aiTileIndex: number;
  youIsRolling: boolean;
  aiIsRolling: boolean;
  onSelectTile?: (tile: BoardTile) => void;
  ground?: Ground;
}

export const CricketBoard: React.FC<CricketBoardProps> = ({
  youTileIndex,
  aiTileIndex,
  youIsRolling,
  aiIsRolling,
  onSelectTile,
  ground,
}) => {
  const totalTiles = BOARD_TILES.length; // 32 tiles

  // Calculate positions in a square loop
  const tilesWithCoords = useMemo(() => {
    const sideLength = totalTiles / 4;
    return BOARD_TILES.map((tile, i) => {
      let x = 0;
      let y = 0;
      
      const side = Math.floor(i / sideLength);
      const pos = i % sideLength;
      const pct = (pos / sideLength) * 100;
      
      if (side === 0) { // Top edge (left to right)
        x = pct; y = 0;
      } else if (side === 1) { // Right edge (top to bottom)
        x = 100; y = pct;
      } else if (side === 2) { // Bottom edge (right to left)
        x = 100 - pct; y = 100;
      } else { // Left edge (bottom to top)
        x = 0; y = 100 - pct;
      }

      return { ...tile, x, y };
    });
  }, [totalTiles]);

  const renderToken = (index: number, isRolling: boolean, colorClass: string, hatClass: string, isAi: boolean) => {
     return (
        <motion.div
          animate={{
            left: `${tilesWithCoords[index]?.x ?? 50}%`,
            top: `${tilesWithCoords[index]?.y ?? 50}%`,
            x: '-50%',
            y: isAi ? '-70%' : '-30%',
          }}
          transition={{
            left: { type: 'spring', stiffness: 200, damping: 22 },
            top: { type: 'spring', stiffness: 200, damping: 22 },
          }}
          className="absolute z-40 pointer-events-none  flex flex-col items-center"
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
               y: [0, -25, 0],
               rotate: [0, -10, 10, 0],
             } : {
               y: [0, -3, 0],
               scaleY: [1, 0.95, 1],
             }}
             transition={isRolling ? {
               y: { duration: 0.3, repeat: Infinity, ease: "easeOut" },
               rotate: { duration: 0.4, repeat: Infinity, ease: "linear" }
             } : {
               duration: 1.5, repeat: Infinity, ease: "easeInOut"
             }}
             className="relative"
          >
            <div className="relative w-10 h-14 drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)] scale-[0.55] sm:scale-[0.65] origin-bottom">
              {/* Helmet */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-7 ${hatClass} rounded-t-full border-2 border-slate-800 z-20 overflow-hidden`}>
                <div className="absolute top-1 right-1 w-2 h-1 bg-white/40 rounded-full rotate-45" />
                {/* Grill */}
                <div className="absolute bottom-0 left-0 right-0 h-3 border-t-2 border-slate-300 bg-slate-800/30">
                  <div className="w-full h-[1px] bg-slate-300 mt-[2px]" />
                  <div className="w-full h-[1px] bg-slate-300 mt-[2px]" />
                </div>
              </div>
              
              {/* Face */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-6 h-5 bg-[#fcd4b1] rounded-b-xl border-x-2 border-b-2 border-[#d09d70] z-10 flex justify-center items-center gap-1">
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
              <div className={`absolute top-8 left-1/2 -translate-x-1/2 w-7 h-6 ${colorClass} rounded-t-lg border-2 border-slate-800 z-20 flex justify-center items-center`}>
              </div>
              
              {/* Bat */}
              <motion.div 
                animate={isRolling ? { rotate: [-20, 60, -20] } : { rotate: 15 }}
                transition={isRolling ? { duration: 0.3, repeat: Infinity } : {}}
                className="absolute top-8 -right-2 w-2 h-8 bg-[#d2b48c] rounded-b-sm rounded-t-full border border-[#8b5a2b] z-30 origin-top"
              >
                <div className="w-full h-2 bg-red-600 rounded-t-full" />
              </motion.div>

              {/* Legs */}
              <div className="absolute top-[52px] left-2 w-2 h-3 bg-white border border-slate-300 rounded-sm z-10" />
              <div className="absolute top-[52px] right-2 w-2 h-3 bg-white border border-slate-300 rounded-sm z-10" />

              {/* Shoes */}
              <div className="absolute top-[62px] left-1 w-3 h-2 bg-slate-800 rounded-full border border-slate-950 z-10" />
              <div className="absolute top-[62px] right-1 w-3 h-2 bg-slate-800 rounded-full border border-slate-950 z-10" />
            </div>
          </motion.div>
        </motion.div>
     );
  };

  return (
    <div className={`relative h-full max-h-[420px] aspect-square mx-auto ${ground?.grassColorClass || 'bg-emerald-800'} rounded-[3rem] shadow-md overflow-hidden`}>
      {/* Grass pattern overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.2) 10px, rgba(0,0,0,0.2) 20px)'
      }} />
      {/* 30-yard circle */}
      <div className="absolute inset-[15%] rounded-[50%] border-2 border-white/20 pointer-events-none" />
      {/* Stadium Pitch Base */}
      <div className={`absolute top-[25%] bottom-[25%] left-[38%] right-[38%] rounded-sm ${ground?.pitchColorClass || 'bg-[#e5d3b3]'} border-2 ${ground?.grassColorClass ? 'border-transparent' : 'border-emerald-800/40'} shadow-md`} style={{
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0,0,0,0.03) 20px, rgba(0,0,0,0.03) 40px)`
      }} />
      
      {/* Floodlights Glow */}
      <motion.div 
        animate={{ opacity: [0.3, 0.6, 0.3] }} 
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
        className="absolute inset-6 sm:inset-8 w-[calc(100%-3rem)] sm:w-[calc(100%-4rem)] h-[calc(100%-3rem)] sm:h-[calc(100%-4rem)] pointer-events-auto"
        style={{ transform: 'rotateX(15deg)', transformStyle: 'preserve-3d' }}
      >
        {tilesWithCoords.map((tile) => {
          const isSelected = tile.id === youTileIndex || tile.id === aiTileIndex;
          const isCorner = tile.id % 8 === 0;
          
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
              animate={isSelected ? {
                y: ['-50%', '-55%', '-50%'],
                scale: 1.05,
                boxShadow: `0 15px 25px -5px ${tile.borderHex}80, 0 8px 10px -6px ${tile.borderHex}80, inset 0 2px 4px rgba(255,255,255,0.5)`,
              } : {
                y: '-50%',
                scale: 1,
                boxShadow: `0 6px 12px -2px rgba(0,0,0,0.5), inset 0 2px 2px rgba(255,255,255,0.4), inset 0 -4px 0 rgba(0,0,0,0.2)`,
              }}
              transition={isSelected ? {
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

        {renderToken(aiTileIndex, aiIsRolling, 'bg-red-500', 'bg-red-600', true)}
        {renderToken(youTileIndex, youIsRolling, 'bg-blue-500', 'bg-blue-600', false)}

      </div>
    </div>
  );
};
