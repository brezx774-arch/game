const fs = require('fs');
const path = 'src/game/engine/useGameEngine.ts';
let code = fs.readFileSync(path, 'utf8');

const oldUpdateBlock = `
    const updateFn = isUser ? setYouState : setAiState;

    updateFn({
      runs: 0, wickets: 0, overs: 0, ballsBowled: 0, history: [], fourCount: 0, sixCount: 0, dotsCount: 0 // Placeholder, we should use functional update
    });
    // Let's implement this properly:
    const currentState = isUser ? useGameStore.getState().youState : useGameStore.getState().aiState;
`;

const newUpdateBlock = `
    const updateFn = isUser ? setYouState : setAiState;
    const currentState = isUser ? useGameStore.getState().youState : useGameStore.getState().aiState;
`;

code = code.replace(oldUpdateBlock.trim(), newUpdateBlock.trim());

// Also make sure we update overs properly
const oldHistoryBlock = `
    updateFn({
      runs: newRuns,
      wickets: newWickets,
      ballsBowled: newLegalBalls,
      history: newHistory,
      fourCount: currentState.fourCount + (runs === 4 ? 1 : 0),
      sixCount: currentState.sixCount + (runs === 6 ? 1 : 0),
      dotsCount: currentState.dotsCount + (runs === 0 && !isWide && !isWicket ? 1 : 0)
    });
`;

const newHistoryBlock = `
    const oversVal = Math.floor(newLegalBalls / 6) + (newLegalBalls % 6) / 10;
    updateFn({
      runs: newRuns,
      wickets: newWickets,
      ballsBowled: newLegalBalls,
      overs: oversVal,
      history: newHistory,
      fourCount: currentState.fourCount + (runs === 4 ? 1 : 0),
      sixCount: currentState.sixCount + (runs === 6 ? 1 : 0),
      dotsCount: currentState.dotsCount + (runs === 0 && !isWide && !isWicket ? 1 : 0)
    });
`;

code = code.replace(oldHistoryBlock.trim(), newHistoryBlock.trim());

fs.writeFileSync(path, code);
console.log('Score patched');
