const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add handleExitToLobby
const exitFunc = `
  const handleExitToLobby = () => {
    setActiveScreen('LOBBY');
    setPhase('MATCH_OVER');
    
    if (settings.mode === 'MULTIPLAYER' && multiplayerRoomId) {
      socketService.emit('player_action', {
        roomId: multiplayerRoomId,
        action: 'LEAVE',
        payload: {}
      });
      // also leave room on server side via disconnect or cancel?
      // cancel_matchmaking works for rooms too
      socketService.emit('cancel_matchmaking');
    }
  };
`;
code = code.replace("const handleRestartMatch = () => {", exitFunc + "\n  const handleRestartMatch = () => {");

// 2. Add opponent left handling in handleOpponentAction
const opponentActionOld = `if (data.action === 'ROLL') {`;
const opponentActionNew = `if (data.action === 'LEAVE') {
          setPhase('MATCH_OVER');
          setCommentaryMsg('Opponent left.');
          setCommentarySubMsg('You win by default!');
        } else if (data.action === 'EMOJI') {
          // Handle emoji here
          setEmojiEvent({ player: 'AI', emoji: data.payload.emoji, id: Date.now() });
        } else if (data.action === 'ROLL') {`;
code = code.replace(opponentActionOld, opponentActionNew);

// 3. Replace onExitToLobby={() => setActiveScreen('LOBBY')}
code = code.replace(/onExitToLobby=\{\(\) \=\> setActiveScreen\('LOBBY'\)\}/g, "onExitToLobby={handleExitToLobby}");

// 4. Add emoji state
const stateOld = "const [selectedTactic, setSelectedTactic] = useState<TacticMode>('ROTATE');";
const stateNew = "const [selectedTactic, setSelectedTactic] = useState<TacticMode>('ROTATE');\n  const [emojiEvent, setEmojiEvent] = useState<{player: 'YOU'|'AI', emoji: string, id: number} | null>(null);";
code = code.replace(stateOld, stateNew);

fs.writeFileSync('src/App.tsx', code);
