import { useEffect } from 'react';
import { useGameStore } from '../../state/gameStore';
import { TacticMode } from '../../types';

export const useAiController = (API_URL: string) => {
  const {
    activeScreen, phase, settings, currentStrike, opponentTurnAction, setOpponentTurnAction
  } = useGameStore();

  useEffect(() => {
    if (activeScreen === 'GAME' && phase !== 'MATCH_OVER' && settings.mode === 'VS_AI' && !opponentTurnAction) {
      if (currentStrike !== 'AI') return;
      
      const timer = setTimeout(async () => {
        const tactics: TacticMode[] = ['DEFEND', 'ROTATE', 'ATTACK'];
        let aiTactic: TacticMode = tactics[Math.floor(Math.random() * tactics.length)];
        
        try {
          const response = await fetch(`${API_URL}/api/roll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tactic: aiTactic })
          });
          const data = await response.json();
          setOpponentTurnAction({ tactic: aiTactic, roll: data.roll, catchRand: data.catchRand });
        } catch (err) {
          console.error('Failed to fetch AI roll', err);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeScreen, phase, settings.mode, currentStrike, opponentTurnAction, API_URL, setOpponentTurnAction]);
};
