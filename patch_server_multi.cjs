const fs = require('fs');
let c = fs.readFileSync('server.ts', 'utf-8');

c = c.replace(
  `  const waitingPlayers: Socket[] = [];
  const customRooms: Record<string, Socket[]> = {};`,
  `  const waitingPlayers: { socket: Socket, info: any }[] = [];
  const customRooms: Record<string, { socket: Socket, info: any }[]> = {};`
);

c = c.replace(
  `    socket.on('join_matchmaking', () => {`,
  `    socket.on('join_matchmaking', (info: any = {}) => {`
);

c = c.replace(
  `        const opponent = waitingPlayers.shift();
        if (opponent) {
          const roomId = \`room_\${socket.id}_\${opponent.id}\`;
          
          socket.join(roomId);
          opponent.join(roomId);`,
  `        const opponentData = waitingPlayers.shift();
        if (opponentData) {
          const opponent = opponentData.socket;
          const roomId = \`room_\${socket.id}_\${opponent.id}\`;
          
          socket.join(roomId);
          opponent.join(roomId);`
);

c = c.replace(
  `          io.to(roomId).emit('match_found', {
            roomId,
            players: [socket.id, opponent.id]
          });`,
  `          // Send match_found to socket with opponent's info
          socket.emit('match_found', {
            roomId,
            players: [opponent.id, socket.id],
            opponentInfo: opponentData.info
          });
          // Send match_found to opponent with socket's info
          opponent.emit('match_found', {
            roomId,
            players: [opponent.id, socket.id],
            opponentInfo: info
          });`
);

c = c.replace(
  `        // Wait for an opponent
        waitingPlayers.push(socket);`,
  `        // Wait for an opponent
        waitingPlayers.push({ socket, info });`
);

c = c.replace(
  `        setTimeout(() => {
          const index = waitingPlayers.indexOf(socket);`,
  `        setTimeout(() => {
          const index = waitingPlayers.findIndex(p => p.socket === socket);`
);

c = c.replace(
  `    socket.on('create_room', () => {
      const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
      customRooms[roomCode] = [socket];`,
  `    socket.on('create_room', (info: any = {}) => {
      const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
      customRooms[roomCode] = [{ socket, info }];`
);

c = c.replace(
  `    socket.on('join_room', (data) => {
      const { roomCode } = data;
      if (customRooms[roomCode] && customRooms[roomCode].length === 1) {
        const opponent = customRooms[roomCode][0];
        customRooms[roomCode].push(socket);
        socket.join(roomCode);
        
        // Match found!
        io.to(roomCode).emit('match_found', {
          roomId: roomCode,
          players: [opponent.id, socket.id]
        });`,
  `    socket.on('join_room', (data) => {
      const { roomCode, info = {} } = data;
      if (customRooms[roomCode] && customRooms[roomCode].length === 1) {
        const opponentData = customRooms[roomCode][0];
        const opponent = opponentData.socket;
        customRooms[roomCode].push({ socket, info });
        socket.join(roomCode);
        
        // Match found!
        socket.emit('match_found', {
          roomId: roomCode,
          players: [opponent.id, socket.id],
          opponentInfo: opponentData.info
        });
        opponent.emit('match_found', {
          roomId: roomCode,
          players: [opponent.id, socket.id],
          opponentInfo: info
        });`
);

c = c.replace(
  `    socket.on('cancel_matchmaking', () => {
      const index = waitingPlayers.indexOf(socket);
      if (index !== -1) {
        waitingPlayers.splice(index, 1);
      }
      
      for (const code in customRooms) {
        if (customRooms[code].includes(socket)) {
          customRooms[code] = customRooms[code].filter(s => s !== socket);`,
  `    socket.on('cancel_matchmaking', () => {
      const index = waitingPlayers.findIndex(p => p.socket === socket);
      if (index !== -1) {
        waitingPlayers.splice(index, 1);
      }
      
      for (const code in customRooms) {
        if (customRooms[code].some(p => p.socket === socket)) {
          customRooms[code] = customRooms[code].filter(p => p.socket !== socket);`
);

c = c.replace(
  `    socket.on('disconnect', () => {
      console.log(\`Player disconnected: \${socket.id}\`);
      const index = waitingPlayers.indexOf(socket);
      if (index !== -1) {
        waitingPlayers.splice(index, 1);
      }
      
      for (const code in customRooms) {
        if (customRooms[code].includes(socket)) {
          customRooms[code] = customRooms[code].filter(s => s !== socket);`,
  `    socket.on('disconnect', () => {
      console.log(\`Player disconnected: \${socket.id}\`);
      const index = waitingPlayers.findIndex(p => p.socket === socket);
      if (index !== -1) {
        waitingPlayers.splice(index, 1);
      }
      
      for (const code in customRooms) {
        if (customRooms[code].some(p => p.socket === socket)) {
          customRooms[code] = customRooms[code].filter(p => p.socket !== socket);`
);

fs.writeFileSync('server.ts', c);
