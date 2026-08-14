const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace handleActionSubmit
const handleActionSubmitRegex = /const handleActionSubmit = useCallback\(\(tactic\?: TacticMode\) => \{[\s\S]*?\}, \[isRolling, phase, myTurnAction, selectedTactic, settings\.mode, multiplayerRoomId, currentStrike\]\);/;

const newHandleActionSubmit = `const handleActionSubmit = useCallback((tactic?: TacticMode) => {
    if (isRolling || phase === 'MATCH_OVER') return;
    
    // Prevent multiple submissions
    if (currentStrike === 'YOU' && myTurnAction) return;
    if (currentStrike === 'AI' && opponentTurnAction) return;
    
    // Check if user is allowed to act
    if (settings.mode !== 'PASS_AND_PLAY' && currentStrike !== 'YOU') return;
    
    soundFx.playClick();
    const activeTactic = tactic || selectedTactic;
    
    let roll = 1;
    if (activeTactic === 'DEFEND') roll = [1, 1, 2, 2, 3][Math.floor(Math.random() * 5)];
    else if (activeTactic === 'ROTATE') roll = [1, 2, 3, 4][Math.floor(Math.random() * 4)];
    else if (activeTactic === 'ATTACK') roll = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
    else roll = Math.floor(Math.random() * 6) + 1;
    
    const action = { tactic: activeTactic, roll };
    
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
      // It's Player 2 in Pass & Play
      setOpponentTurnAction(action);
    }
  }, [isRolling, phase, myTurnAction, opponentTurnAction, selectedTactic, settings.mode, multiplayerRoomId, currentStrike]);`;

code = code.replace(handleActionSubmitRegex, newHandleActionSubmit);


// Replace ActionControls rendering in UI
const actionControlsRegex = /<ActionControls[\s\S]*?onSendEmoji=\{[\s\S]*?\}\s*\/>/m;
const newActionControls = `{ (currentStrike === 'YOU' || settings.mode === 'PASS_AND_PLAY') ? (
              <ActionControls
                selectedTactic={selectedTactic}
                onSelectTactic={setSelectedTactic}
                onRoll={() => handleActionSubmit()}
                isRolling={isRolling || (currentStrike === 'YOU' ? myTurnAction !== null : opponentTurnAction !== null)}
                disabled={phase === 'MATCH_OVER'}
                showEmoji={!!multiplayerRoomId}
                isBatting={true} // Since it's only batting now
                onSendEmoji={(emoji) => {
                  if (multiplayerRoomId) {
                    socketService.emit('player_action', {
                      roomId: multiplayerRoomId,
                      action: 'EMOJI',
                      payload: { emoji }
                    });
                    setEmojiEvent({ player: 'YOU', emoji, id: Date.now() });
                  }
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 bg-[#0f172a] border-t-2 border-[#1e293b] rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.8)] h-32">
                <h3 className="text-xl font-black text-amber-500 uppercase tracking-widest mb-2 animate-pulse">
                  {settings.mode === 'VS_AI' ? 'AI is Batting...' : 'Opponent is Batting...'}
                </h3>
                <p className="text-stone-400 text-sm">Please wait while they take their turn.</p>
              </div>
            )}`;

code = code.replace(actionControlsRegex, newActionControls);

fs.writeFileSync('src/App.tsx', code);
