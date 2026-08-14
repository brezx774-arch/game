const fs = require('fs');
let c = fs.readFileSync('src/components/LobbyScreen.tsx', 'utf-8');

c = c.replace(
  `  onSpendCoins: (amount: number) => void;
}`,
  `  onSpendCoins: (amount: number) => void;
  playerName?: string;
  playerAvatar?: string;
}`
);

c = c.replace(
  `  onSpendCoins
}) => {`,
  `  onSpendCoins,
  playerName,
  playerAvatar
}) => {`
);

c = c.replace(
  `    const handleMatchFound = (data: any) => {
      soundFx.playMatchFound();
      
      const opponentId = data.players.find((id: string) => id !== socketService.socket?.id);
      onStartMultiplayer(data.roomId, data.firstStriker, opponentId, data.botName);
      setIsMatchmaking(false);
    };`,
  `    const handleMatchFound = (data: any) => {
      soundFx.playMatchFound();
      
      const opponentId = data.players.find((id: string) => id !== socketService.socket?.id);
      const opponentName = data.botName || data.opponentInfo?.name || 'Player 2';
      onStartMultiplayer(data.roomId, data.firstStriker, opponentId, opponentName);
      setIsMatchmaking(false);
    };`
);

c = c.replace(
  `                            socketService.connect();
                            socketService.emit('create_room');`,
  `                            socketService.connect();
                            socketService.emit('create_room', { name: playerName, avatar: playerAvatar });`
);

c = c.replace(
  `                                  socketService.connect();
                                  socketService.emit('join_room', { roomCode: joinCode });`,
  `                                  socketService.connect();
                                  socketService.emit('join_room', { roomCode: joinCode, info: { name: playerName, avatar: playerAvatar } });`
);

c = c.replace(
  `                            socketService.connect();
                            socketService.emit('join_matchmaking');`,
  `                            socketService.connect();
                            socketService.emit('join_matchmaking', { name: playerName, avatar: playerAvatar });`
);

fs.writeFileSync('src/components/LobbyScreen.tsx', c);
