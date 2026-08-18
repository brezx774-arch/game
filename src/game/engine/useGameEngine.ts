import { useEffect, useCallback } from 'react';
import { useGameStore } from '../../state/gameStore';
import { soundFx } from '../../utils/audio';
import { socketService } from '../../utils/socket';
import { BOARD_TILES } from '../../utils/boardData';
import { BoardTile, TacticMode, DeliveryRecord } from '../../types';

export const useGameEngine = (
  API_URL: string,
  updateProfile: (data: any) => void,
  profile: any
) => {
  const {
    settings,
    activeScreen,
    phase,
    setPhase,
    currentStrike,
    setCurrentStrike,
    youState,
    setYouState,
    aiState,
    setAiState,
    selectedTactic,
    youTileIndex,
    setYouTileIndex,
    aiTileIndex,
    setAiTileIndex,
    isFreeHit,
    setIsFreeHit,
    multiplayerRoomId,
    myTurnAction,
    setMyTurnAction,
    opponentTurnAction,
    setOpponentTurnAction,
    isRolling,
    setIsRolling,
    turnTimer,
    setTurnTimer,
    setDiceVal,
    setLandedTileInfo,
    setShowDiceModal,
    setCommentaryMsg,
    setCommentarySubMsg
  } = useGameStore();

  const isPowerplayActive = (ballsBowled: number) => {
    return settings.maxOvers >= 5 && ballsBowled < 12;
  };

  const isCurrentPowerplay = isPowerplayActive(
    currentStrike === 'YOU' ? youState.ballsBowled : aiState.ballsBowled
  );

  const handleActionSubmit = useCallback(async (tactic?: TacticMode) => {
    if (isRolling || phase === 'MATCH_OVER') return;
    
    if (currentStrike === 'YOU' && myTurnAction) return;
    if (currentStrike === 'AI' && opponentTurnAction) return;
    
    if (settings.mode !== 'PASS_AND_PLAY' && currentStrike !== 'YOU') return;
    
    soundFx.playClick();
    const activeTactic = tactic || selectedTactic;
    
    try {
      const response = await fetch(`${API_URL}/api/roll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tactic: activeTactic })
      });
      const data = await response.json();
      
      const action = { tactic: activeTactic, roll: data.roll, catchRand: data.catchRand };
      
      if (currentStrike === 'YOU') {
        setMyTurnAction(action);
        if (settings.mode === 'MULTIPLAYER' && multiplayerRoomId) {
          socketService.emit('player_action', {
            roomId: multiplayerRoomId,
            action: 'SUBMIT_TURN',
            payload: action
          });
        }
      } else {
        setOpponentTurnAction(action);
      }
    } catch (err) {
      console.error('Failed to fetch roll', err);
    }
  }, [isRolling, phase, myTurnAction, opponentTurnAction, selectedTactic, settings.mode, multiplayerRoomId, currentStrike, API_URL, setMyTurnAction, setOpponentTurnAction]);

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

  useEffect(() => {
    if (activeScreen !== 'GAME' || phase === 'MATCH_OVER' || isRolling) return;
    
    const batterAction = currentStrike === 'YOU' ? myTurnAction : opponentTurnAction;
    if (batterAction) return;

    const timer = setInterval(() => {
      setTurnTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeScreen, phase, isRolling, myTurnAction, opponentTurnAction, currentStrike, setTurnTimer]);

  useEffect(() => {
    if (activeScreen !== 'GAME' || phase === 'MATCH_OVER' || isRolling) return;
    
    if (turnTimer === 0 && currentStrike === 'YOU' && !myTurnAction) {
       handleActionSubmit('ROTATE');
    } else if (turnTimer < -4 && settings.mode === 'MULTIPLAYER' && currentStrike !== 'YOU' && !opponentTurnAction) {
       useGameStore.getState().setSettings({ mode: 'VS_AI' });
       setCommentaryMsg('Opponent timed out.');
       setCommentarySubMsg('AI took over!');
       setTurnTimer(0);
    }
  }, [turnTimer, myTurnAction, opponentTurnAction, activeScreen, phase, isRolling, currentStrike, handleActionSubmit, settings.mode, setCommentaryMsg, setCommentarySubMsg, setTurnTimer]);

  useEffect(() => {
    const batterAction = currentStrike === 'YOU' ? myTurnAction : opponentTurnAction;
    
    if (batterAction && !isRolling && activeScreen === 'GAME' && phase !== 'MATCH_OVER') {
      setIsRolling(true);
      soundFx.playDiceRoll();
      
      const combinedRoll = batterAction.roll;
      setDiceVal(combinedRoll);
      
      const isUser = currentStrike === 'YOU';
      const currentIndex = isUser ? youTileIndex : aiTileIndex;
      let newIndex = (currentIndex + combinedRoll) % 32;
      
      const landedTile = BOARD_TILES.find(t => t.id === newIndex) || BOARD_TILES[0];
      setLandedTileInfo(landedTile);
      setShowDiceModal(true);
      
      setTimeout(() => {
        setShowDiceModal(false);
        if (isUser) setYouTileIndex(newIndex);
        else setAiTileIndex(newIndex);

        resolveOutcome(landedTile, combinedRoll, batterAction.tactic, batterAction.catchRand || Math.random(), isUser);
        setMyTurnAction(null);
        setOpponentTurnAction(null);
        setTurnTimer(20);
        setIsRolling(false);
      }, 2000); 
    }
  }, [myTurnAction, opponentTurnAction, isRolling, activeScreen, phase, youTileIndex, aiTileIndex, currentStrike, setDiceVal, setLandedTileInfo, setShowDiceModal, setYouTileIndex, setAiTileIndex, setMyTurnAction, setOpponentTurnAction, setTurnTimer, setIsRolling]);

  const updatePlayerScore = (
    isUser: boolean,
    runs: number,
    isWicket: boolean,
    isWide: boolean,
    isPowerplay: boolean,
    tileLabel: string,
    commentary: string,
    subCommentary?: string
  ) => {
    if (phase !== 'MATCH_OVER' && profile) {
      let coinsToAdd = 0;
      let xpToAdd = 0;

      if (isUser) {
        if (runs >= 4) { coinsToAdd = runs * 2; xpToAdd = 10; }
        else if (runs > 0) { coinsToAdd = runs; xpToAdd = 2; }
      } else if (settings.mode === 'VS_AI') {
        if (isWicket) { coinsToAdd = 25; xpToAdd = 30; }
        else if (runs === 0 && !isWide) { coinsToAdd = 2; xpToAdd = 5; }
      }
      
      if (coinsToAdd > 0 || xpToAdd > 0) {
        updateProfile({
           coins: (profile.coins || 0) + coinsToAdd,
           xp: (profile.xp || 0) + xpToAdd
        });
      }
    }

    const updateFn = isUser ? setYouState : setAiState;
    const currentState = isUser ? useGameStore.getState().youState : useGameStore.getState().aiState;
    const newRuns = currentState.runs + runs;
    const newWickets = isWicket ? currentState.wickets + 1 : currentState.wickets;
    const newLegalBalls = isWide ? currentState.ballsBowled : currentState.ballsBowled + 1;
    const overBallStr = `${Math.floor(currentState.ballsBowled / 6)}.${(currentState.ballsBowled % 6) + 1}`;

    const newRecord: DeliveryRecord = {
      id: Date.now().toString(),
      overBall: overBallStr,
      player: isUser ? 'YOU' : 'AI',
      runs, isWicket, isWide, isPowerplay, isFreeHit,
      tileLabel: `${tileLabel}${isPowerplay ? ' PP' : ''}`,
      commentary, subCommentary,
    };

    const newHistory = [...currentState.history, newRecord];

    const totalLegalBalls = settings.maxOvers * 6;
    const isCurrentFinished = newLegalBalls >= totalLegalBalls || newWickets >= settings.maxWickets;
    const otherState = isUser ? useGameStore.getState().aiState : useGameStore.getState().youState;
    const isOtherFinished = otherState.ballsBowled >= totalLegalBalls || otherState.wickets >= settings.maxWickets;

    const oversVal = Math.floor(newLegalBalls / 6) + (newLegalBalls % 6) / 10;
    updateFn({
      runs: newRuns,
      wickets: newWickets,
      ballsBowled: newLegalBalls,
      overs: oversVal,
      history: newHistory,
      fourCount: currentState.fourCount + (runs === 4 || runs === 8 ? 1 : 0),
      sixCount: currentState.sixCount + (runs === 6 || runs === 12 ? 1 : 0),
      dotsCount: currentState.dotsCount + (runs === 0 && !isWide && !isWicket ? 1 : 0)
    });

    if (isCurrentFinished && isOtherFinished) {
      setTimeout(() => {
        setPhase('MATCH_OVER');
        const userFinalRuns = isUser ? newRuns : useGameStore.getState().youState.runs;
        const aiFinalRuns = !isUser ? newRuns : useGameStore.getState().aiState.runs;
        const userWon = userFinalRuns >= aiFinalRuns;
        
        if (profile) {
          updateProfile({
            coins: (profile.coins || 0) + (userWon ? 150 : 50),
            xp: (profile.xp || 0) + (userWon ? 200 : 50),
            stats: {
              ...(profile.stats || { matchesPlayed: 0, matchesWon: 0, totalRuns: 0, totalWickets: 0, highestScore: 0 }),
              matchesPlayed: (profile.stats?.matchesPlayed || 0) + 1,
              matchesWon: (profile.stats?.matchesWon || 0) + (userWon ? 1 : 0),
              totalRuns: (profile.stats?.totalRuns || 0) + userFinalRuns,
              totalWickets: (profile.stats?.totalWickets || 0) + (isUser ? newWickets : useGameStore.getState().youState.wickets),
              highestScore: Math.max(profile.stats?.highestScore || 0, userFinalRuns)
            }
          });
        }
      }, 1000);
    } else {
      setTimeout(() => {
         if (!isOtherFinished && (!isWide || isCurrentFinished)) {
            setCurrentStrike(isUser ? 'AI' : 'YOU');
         } else if (isCurrentFinished && !isOtherFinished) {
            setCurrentStrike(isUser ? 'AI' : 'YOU');
         }
      }, 500);
    }
  };

  const resolveOutcome = (tile: BoardTile, rollVal: number, activeTactic: TacticMode, catchRand: number = Math.random(), isUser: boolean) => {
    let runsEarned = 0, isWicketOut = false, isWide = false, nextFreeHit = false, cMsg = '', cSub = '';
    const isBattingUser = isUser;
    const currentPlayerState = isUser ? useGameStore.getState().youState : useGameStore.getState().aiState;
    const powerplayNow = isPowerplayActive(currentPlayerState.ballsBowled);

    switch (tile.type) {
      case 'START':
        cMsg = `${currentPlayerState.name} is at the start.`;
        soundFx.playBatHit(false);
        break;
      case 'RUN_1':
        runsEarned = 1;
        if (powerplayNow) { runsEarned *= 2; cSub = 'Powerplay doubles it! (+2 runs)'; }
        cMsg = `${currentPlayerState.name} worked the ball away for ${runsEarned} run${runsEarned > 1 ? 's' : ''}.`;
        soundFx.playBatHit(false);
        break;
      case 'RUN_2':
        runsEarned = 2;
        if (powerplayNow) { runsEarned *= 2; cSub = 'Powerplay doubles it! (+4 runs)'; }
        cMsg = `Nicely placed into deep mid-wicket for ${runsEarned} runs!`;
        soundFx.playBatHit(false);
        break;
      case 'RUN_3':
        runsEarned = 3;
        if (powerplayNow) { runsEarned *= 2; cSub = 'Powerplay doubles it! (+6 runs)'; }
        cMsg = `Great running between the wickets! Took ${runsEarned} runs!`;
        soundFx.playBatHit(false);
        break;
      case 'RUN_4':
        runsEarned = 4;
        if (powerplayNow) { runsEarned *= 2; cSub = 'Powerplay doubles it! (+8 runs)'; }
        cMsg = `SMASHED AWAY FOR FOUR! Pure timing!`;
        soundFx.playBatHit(true);
        break;
      case 'RUN_6':
        runsEarned = 6;
        if (powerplayNow) { runsEarned *= 2; cSub = 'Powerplay doubles it! (+12 runs)'; }
        cMsg = `MASSIVE HIT OVER THE BOUNDARY FOR SIX! What a shot!`;
        soundFx.playBatHit(true);
        break;
      case 'DOT':
        runsEarned = 0;
        cMsg = `Dot ball. Defended cleanly to the fielder.`;
        soundFx.playBatHit(false);
        break;
      case 'WICKET':
        if (useGameStore.getState().isFreeHit) {
          runsEarned = 1; cMsg = `SURVIVED FREE HIT! Wicket attempt negated! (+1 run)`; cSub = `Free Hit protected your wicket!`;
          soundFx.playBatHit(false);
        } else {
          isWicketOut = true; cMsg = `OUT! Clean bowled / caught in the deep! Wicket falls!`;
          soundFx.playWicket();
        }
        break;
      case 'CATCH':
        if (useGameStore.getState().isFreeHit) {
          runsEarned = 2; cMsg = `Free Hit active! Dropped in the deep for 2 runs!`; soundFx.playBatHit(false);
        } else {
          const catchProb = activeTactic === 'DEFEND' ? 0.2 : activeTactic === 'ATTACK' ? 0.7 : 0.4;
          if (catchRand < catchProb) {
            isWicketOut = true; cMsg = `OUT! High ball taken cleanly by the fielder!`; soundFx.playWicket();
          } else {
            runsEarned = 2; cMsg = `DROPPED! Fielder spills the catch! Scammed 2 runs!`; cSub = `Lucky escape!`; soundFx.playBatHit(false);
          }
        }
        break;
      case 'WIDE':
        runsEarned = 1; isWide = true; nextFreeHit = true;
        cMsg = `WIDE BALL! Extra run awarded + Extra delivery!`; cSub = `Free Hit awarded for next ball!`; soundFx.playBatHit(false);
        break;
      case 'FREE_HIT':
        runsEarned = 1; nextFreeHit = true;
        cMsg = `Landed on FREE HIT! Next roll cannot result in a wicket!`; cSub = `Free Hit Shield Active!`; soundFx.playBatHit(false);
        break;
      case 'POWER_ROLL':
        runsEarned = 3; cMsg = `POWER ROLL! Accelerated down the track for 3 runs!`; cSub = `Bonus Momentum!`; soundFx.playPowerplayChime();
        break;
      case 'POWER_SHOT':
        runsEarned = 6; cMsg = `POWER SHOT! Dispatched straight over long-on for SIX!`; cSub = `+6 Bonus Runs!`; soundFx.playPowerplayChime(); soundFx.playCrowdCheer(true);
        break;
    }

    setIsFreeHit(nextFreeHit);
    setCommentaryMsg(cMsg);
    setCommentarySubMsg(cSub);

    updatePlayerScore(isBattingUser, runsEarned, isWicketOut, isWide, powerplayNow, tile.label, cMsg, cSub);
  };

  return {
    handleActionSubmit,
    isCurrentPowerplay
  };
};
