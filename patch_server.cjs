const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "const firstStriker = Math.random() > 0.5 ? socket.id : opponent.id;\n          io.to(roomId).emit('match_start', {\n            firstStriker\n          });",
  "const firstStriker = Math.random() > 0.5 ? socket.id : opponent.id;\n          const groundIndex = Math.floor(Math.random() * 5);\n          io.to(roomId).emit('match_start', {\n            firstStriker,\n            groundIndex\n          });"
);

code = code.replace(
  "const firstStriker = Math.random() > 0.5 ? socket.id : fakeOpponentId;\n            socket.emit('match_start', {\n              firstStriker\n            });",
  "const firstStriker = Math.random() > 0.5 ? socket.id : fakeOpponentId;\n            const groundIndex = Math.floor(Math.random() * 5);\n            socket.emit('match_start', {\n              firstStriker,\n              groundIndex\n            });"
);

code = code.replace(
  "const firstStriker = Math.random() > 0.5 ? opponent.id : socket.id;\n        io.to(roomCode).emit('match_start', {\n          firstStriker\n        });",
  "const firstStriker = Math.random() > 0.5 ? opponent.id : socket.id;\n        const groundIndex = Math.floor(Math.random() * 5);\n        io.to(roomCode).emit('match_start', {\n          firstStriker,\n          groundIndex\n        });"
);

fs.writeFileSync('server.ts', code);
