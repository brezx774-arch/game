const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const updatePlayerScore = \([\s\S]*?\n  };\n\n  \/\/ Multiplayer Opponent Action Listener/m;

const replacement = `const updatePlayerScore = (
    isUser: boolean,
    runs: number,
    isWicket: boolean,
    isWide: boolean,
    isPowerplay: boolean,
    tileLabel: string,
    commentary: string,
    subCommentary?: string
  ) => {
    
    // Rewards System
    if (phase !== 'MATCH_OVER') {
      if (isUser) {
        if (runs >= 4) {
          setCoins(c => c + runs * 2);
          setXp(x => x + 10);
        } else if (runs > 0) {
          setCoins(c => c + runs);
          setXp(x => x + 2);
        }
      } else if (settings.mode === 'VS_AI') {
        if (isWicket) {
          setCoins(c => c + 25);
          setXp(x => x + 30);
        } else if (runs === 0 && !isWide) {
          setCoins(c => c + 2);
          setXp(x => x + 5);
        }
      }
    }

    const updateFn = isUser ? setYouState : setAiState;

    updateFn((prev) => {
      const newRuns = prev.runs + runs;
      const newWickets = isWicket ? prev.wickets + 1 : prev.wickets;
      const newLegalBalls = isWide ? prev.ballsBowled : prev.ballsBowled + 1;

      const oversVal = Math.floor(newLegalBalls / 6) + (newLegalBalls % 6) / 10;
      const overBallStr = \`\${Math.floor(prev.ballsBowled / 6)}.\${(prev.ballsBowled % 6) + 1}\`;

      const newRecord: DeliveryRecord = {
        id: Date.now().toString(),
        overBall: overBallStr,
        player: isUser ? 'YOU' : 'AI',
        runs,
        isWicket,
        isWide,
        isPowerplay,
        isFreeHit,
        tileLabel: \`\${tileLabel}\${isPowerplay ? ' PP' : ''}\`,
        commentary,
        subCommentary,
      };

      const newHistory = [...prev.history, newRecord];

      const totalLegalBalls = settings.maxOvers * 6;
      const isCurrentFinished = newLegalBalls >= totalLegalBalls || newWickets >= settings.maxWickets;
      const otherState = isUser ? aiState : youState;
      const isOtherFinished = otherState.ballsBowled >= totalLegalBalls || otherState.wickets >= settings.maxWickets;

      if (isCurrentFinished && isOtherFinished) {
        setTimeout(() => {
          setPhase('MATCH_OVER');
          const userFinalRuns = isUser ? newRuns : youState.runs;
          const aiFinalRuns = !isUser ? newRuns : aiState.runs;
          const userWon = userFinalRuns >= aiFinalRuns;
          
          if (userWon) {
            setCoins(c => c + 150);
            setXp(x => x + 200);
          } else {
            setCoins(c => c + 50);
            setXp(x => x + 50);
          }
          setStats(s => ({
            ...s,
            matchesPlayed: s.matchesPlayed + 1,
            matchesWon: s.matchesWon + (userWon ? 1 : 0),
            totalRuns: s.totalRuns + userFinalRuns,
            totalWickets: s.totalWickets + (isUser ? newWickets : youState.wickets),
            highestScore: Math.max(s.highestScore, userFinalRuns)
          }));
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

      return {
        ...prev,
        runs: newRuns,
        wickets: newWickets,
        ballsBowled: newLegalBalls,
        overs: oversVal,
        history: newHistory,
        fourCount: runs === 4 || runs === 8 ? prev.fourCount + 1 : prev.fourCount,
        sixCount: runs === 6 || runs === 12 ? prev.sixCount + 1 : prev.sixCount,
        dotsCount: runs === 0 ? prev.dotsCount + 1 : prev.dotsCount,
      };
    });
  };

  // Multiplayer Opponent Action Listener`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
