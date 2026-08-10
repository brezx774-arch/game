import express from 'express';
import { createServer as createHttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import path from 'path';
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

  // Basic Matchmaking Logic
  const waitingPlayers: Socket[] = [];

  io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    socket.on('join_matchmaking', () => {
      console.log(`Player ${socket.id} joined matchmaking`);
      
      if (waitingPlayers.length > 0) {
        // Match found!
        const opponent = waitingPlayers.shift();
        if (opponent) {
          const roomId = `room_${socket.id}_${opponent.id}`;
          
          socket.join(roomId);
          opponent.join(roomId);

          // Tell both players they matched
          io.to(roomId).emit('match_found', {
            roomId,
            players: [socket.id, opponent.id]
          });
          
          // Randomly decide who bats first
          const firstStriker = Math.random() > 0.5 ? socket.id : opponent.id;
          io.to(roomId).emit('match_start', {
            firstStriker
          });
        }
      } else {
        // Wait for an opponent
        waitingPlayers.push(socket);
        socket.emit('waiting_for_opponent');
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
      const index = waitingPlayers.indexOf(socket);
      if (index !== -1) {
        waitingPlayers.splice(index, 1);
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
