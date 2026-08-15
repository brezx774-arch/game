import 'dotenv/config';
import express from 'express';
import { createServer as createHttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;

async function startServer() {
  const app = express();
  const httpServer = createHttpServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: '*', // Allow all origins for now, customize as needed
      methods: ['GET', 'POST'],
    },
  });

  app.use(cors());
  app.use(express.json());

  // Self-Hosted OTA Update Endpoint
  app.get('/api/check-update', (req, res) => {
    // Read the version from env or fallback
    // The zip file should be hosted at this URL on your VPS
    res.json({
      version: process.env.APP_VERSION || '1.0.0',
      url: process.env.APP_UPDATE_URL || ''
    });
  });


  // Game Logic API
  app.post('/api/roll', (req, res) => {
    const { tactic } = req.body;
    
    let roll = 1;
    if (tactic === 'DEFEND') roll = [1, 1, 2, 2, 3][Math.floor(Math.random() * 5)];
    else if (tactic === 'ROTATE') roll = [1, 2, 3, 4][Math.floor(Math.random() * 4)];
    else if (tactic === 'ATTACK') roll = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
    else roll = Math.floor(Math.random() * 6) + 1;

    res.json({ roll, catchRand: Math.random() });
  });

  // Basic Matchmaking Logic
  const waitingPlayers: { socket: Socket, info: any }[] = [];
  const customRooms: Record<string, { socket: Socket, info: any }[]> = {};

  io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    socket.on('join_matchmaking', (info: any = {}) => {
      console.log(`Player ${socket.id} joined matchmaking`);
      
      if (waitingPlayers.length > 0) {
        // Match found!
        const opponentData = waitingPlayers.shift();
        if (opponentData) {
          const opponent = opponentData.socket;
          const roomId = `room_${socket.id}_${opponent.id}`;
          
          socket.join(roomId);
          opponent.join(roomId);

          // Tell both players they matched
          // Send match_found to socket with opponent's info
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
          });
          
          // Randomly decide who bats first
          const firstStriker = Math.random() > 0.5 ? socket.id : opponent.id;
          const groundIndex = Math.floor(Math.random() * 5);
          io.to(roomId).emit('match_start', {
            firstStriker,
            groundIndex
          });
        }
      } else {
        // Wait for an opponent
        waitingPlayers.push({ socket, info });
        socket.emit('waiting_for_opponent');

        // After 4 seconds, if still waiting, give them an AI match disguised as a real player
        setTimeout(() => {
          const index = waitingPlayers.findIndex(p => p.socket === socket);
          if (index !== -1) {
            // Still waiting
            waitingPlayers.splice(index, 1);
            
            const roomId = `room_ai_${socket.id}`;
            socket.join(roomId);
            
            const fakeOpponentId = `bot_${Math.floor(Math.random() * 100000)}`;
            
            socket.emit('match_found_bot', {
              roomId,
              botId: fakeOpponentId,
              botName: `Guest${Math.floor(1000 + Math.random() * 9000)}`
            });
            
            const firstStriker = Math.random() > 0.5 ? socket.id : fakeOpponentId;
            const groundIndex = Math.floor(Math.random() * 5);
            socket.emit('match_start', {
              firstStriker,
              groundIndex
            });
          }
        }, 4000);
      }
    });

    socket.on('create_room', (info: any = {}) => {
      const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
      customRooms[roomCode] = [{ socket, info }];
      socket.join(roomCode);
      socket.emit('room_created', { roomCode });
      console.log(`Player ${socket.id} created room ${roomCode}`);
    });

    socket.on('join_room', (data) => {
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
        });

        // Randomly decide who bats first
        const firstStriker = Math.random() > 0.5 ? opponent.id : socket.id;
        const groundIndex = Math.floor(Math.random() * 5);
        io.to(roomCode).emit('match_start', {
          firstStriker,
          groundIndex
        });
        
        console.log(`Player ${socket.id} joined room ${roomCode}`);
        delete customRooms[roomCode]; // Remove from joinable list
      } else {
        socket.emit('room_error', { message: 'Room not found or full' });
      }
    });

    socket.on('cancel_matchmaking', () => {
      const index = waitingPlayers.findIndex(p => p.socket === socket);
      if (index !== -1) {
        waitingPlayers.splice(index, 1);
      }
      
      for (const code in customRooms) {
        if (customRooms[code].some(p => p.socket === socket)) {
          customRooms[code] = customRooms[code].filter(p => p.socket !== socket);
          if (customRooms[code].length === 0) {
            delete customRooms[code];
          }
        }
      }
    });
    
    // Pass actions to the other player in the room
    socket.on('player_action', (data) => {
      const { roomId, action, payload } = data;
      // Broadcast to everyone else in the room
      socket.to(roomId).emit('opponent_action', { action, payload });
    });

    socket.on('disconnect', () => {
      console.log(`Player disconnected: ${socket.id}`);
      const index = waitingPlayers.findIndex(p => p.socket === socket);
      if (index !== -1) {
        waitingPlayers.splice(index, 1);
      }
      
      for (const code in customRooms) {
        if (customRooms[code].some(p => p.socket === socket)) {
          customRooms[code] = customRooms[code].filter(p => p.socket !== socket);
          if (customRooms[code].length === 0) {
            delete customRooms[code];
          }
        }
      }

      // Optional: Inform other players in rooms about the disconnect
      socket.rooms.forEach((roomId) => {
         socket.to(roomId).emit('opponent_disconnected');
      });
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
