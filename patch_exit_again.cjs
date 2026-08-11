const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const handleExitOld = `  const handleExitToLobby = () => {
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
  };`;

const handleExitNew = `  const handleExitToLobby = () => {
    setActiveScreen('LOBBY');
    setPhase('MATCH_OVER');
    setIsRolling(false);
    
    if (settings.mode === 'MULTIPLAYER' && multiplayerRoomId) {
      socketService.emit('player_action', {
        roomId: multiplayerRoomId,
        action: 'LEAVE',
        payload: {}
      });
      socketService.emit('cancel_matchmaking');
    }
  };`;

code = code.replace(handleExitOld, handleExitNew);

fs.writeFileSync('src/App.tsx', code);
