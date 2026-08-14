const fs = require('fs');

let code = `import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { socketService } from '../utils/socket';

interface TossScreenProps {
  roomId?: string;
  mode: 'VS_AI' | 'MULTIPLAYER';
  myId: string;
  opponentId: string;
  opponentName: string;
  callerId: string;
  isBotMatch?: boolean;
  onTossComplete: (firstStrikerId: string) => void;
}

export const TossScreen: React.FC<TossScreenProps> = ({
  mode,
  myId,
  opponentId,
  opponentName,
  callerId,
  isBotMatch,
  roomId,
  onTossComplete
}) => {
  const [tossState, setTossState] = useState<'CALLING' | 'FLIPPING' | 'RESULT'>('CALLING');
  const [choice, setChoice] = useState<'HEADS' | 'TAILS' | null>(null);
  const [tossResult, setTossResult] = useState<'HEADS' | 'TAILS' | null>(null);
  const [winnerId, setWinnerId] = useState<string | null>(null);

  const isMyCall = callerId === myId;

  // Listen for multiplayer toss events
  useEffect(() => {
    if (mode === 'MULTIPLAYER' && !isBotMatch) {
      const handleOpponentAction = (data: { action: string, payload: any }) => {
        if (data.action === 'TOSS_RESULT') {
          setChoice(data.payload.choice);
          setTossResult(data.payload.result);
          setWinnerId(data.payload.winnerId);
          setTossState('FLIPPING');
          setTimeout(() => {
            setTossState('RESULT');
            setTimeout(() => {
              onTossComplete(data.payload.winnerId);
            }, 3000);
          }, 3000);
        }
      };
      
      socketService.on('opponent_action', handleOpponentAction);
      return () => {
        socketService.off('opponent_action', handleOpponentAction);
      };
    }
  }, [mode, isBotMatch, onTossComplete]);

  // AI or Local Bot Logic
  useEffect(() => {
    if ((mode === 'VS_AI' || isBotMatch) && tossState === 'CALLING' && !isMyCall) {
      // Bot is calling
      const timer = setTimeout(() => {
        const botChoice = Math.random() > 0.5 ? 'HEADS' : 'TAILS';
        handleTossChoice(botChoice, true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [tossState, winnerId, opponentId, myId, mode, isBotMatch, isMyCall]);

  const handleTossChoice = (selectedChoice: 'HEADS' | 'TAILS', isBot: boolean = false) => {
    if (!isBot && !isMyCall) return;
    
    setChoice(selectedChoice);
    const result = Math.random() > 0.5 ? 'HEADS' : 'TAILS';
    const isCallerWinner = selectedChoice === result;
    
    const theWinner = isCallerWinner ? callerId : (callerId === myId ? opponentId : myId);
    
    setTossResult(result);
    setWinnerId(theWinner);
    
    if (mode === 'MULTIPLAYER' && !isBotMatch && !isBot) {
      socketService.emit('player_action', {
        roomId: roomId,
        action: 'TOSS_RESULT',
        payload: { choice: selectedChoice, result, winnerId: theWinner }
      });
    }

    setTossState('FLIPPING');
    setTimeout(() => {
      setTossState('RESULT');
      setTimeout(() => {
        onTossComplete(theWinner);
      }, 3000);
    }, 3000);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-2xl mx-auto p-4 min-h-[600px]">
      <div className="bg-stone-900/80 backdrop-blur-md p-8 rounded-3xl border-2 border-stone-800 text-center w-full max-w-md">
        <h2 className="text-3xl font-black italic uppercase tracking-widest text-amber-500 mb-8 drop-shadow-md">Match Toss</h2>
        
        {tossState === 'CALLING' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {isMyCall ? (
              <>
                <p className="text-stone-300 font-bold mb-6">Call your side of the coin</p>
                <div className="flex gap-4 justify-center">
                  <button onClick={() => handleTossChoice('HEADS')} className="w-32 h-32 rounded-full bg-stone-800 border-4 border-amber-500 text-amber-500 font-black text-xl hover:bg-stone-700 transition-colors shadow-lg">HEADS</button>
                  <button onClick={() => handleTossChoice('TAILS')} className="w-32 h-32 rounded-full bg-stone-800 border-4 border-amber-500 text-amber-500 font-black text-xl hover:bg-stone-700 transition-colors shadow-lg">TAILS</button>
                </div>
              </>
            ) : (
              <p className="text-stone-300 font-bold animate-pulse text-xl">Waiting for {opponentName} to call...</p>
            )}
          </motion.div>
        )}

        {tossState === 'FLIPPING' && (
          <div className="flex flex-col items-center">
            <motion.div 
              animate={{ rotateY: [0, 180, 360, 540, 720, 900, 1080] }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="w-32 h-32 rounded-full bg-amber-500 flex items-center justify-center border-4 border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.6)] mb-6"
            >
              <span className="text-stone-900 font-black text-3xl">?</span>
            </motion.div>
            <p className="text-stone-300 font-bold italic tracking-wide">Flipping the coin...</p>
          </div>
        )}

        {tossState === 'RESULT' && tossResult && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
             <div className="w-32 h-32 mx-auto rounded-full bg-amber-500 flex items-center justify-center border-4 border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.6)] mb-6">
              <span className="text-stone-900 font-black text-2xl uppercase tracking-wider">{tossResult}</span>
            </div>
            
            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-wider">
              {winnerId === myId ? 'You won the toss!' : \`\${opponentName} won the toss!\`}
            </h3>
            
            <p className="text-amber-500 font-bold text-xl uppercase tracking-widest animate-pulse">
               {winnerId === myId ? 'You' : opponentName} will strike first!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
`
fs.writeFileSync('src/components/TossScreen.tsx', code);
