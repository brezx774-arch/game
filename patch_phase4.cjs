const fs = require('fs');

// 1. Create multiplayerController.ts
const multiplayerCode = `import { socketService } from '../../utils/socket';

export const multiplayerController = {
  joinMatchmaking: () => {
    socketService.connect();
    socketService.emit('join_matchmaking');
  },
  cancelMatchmaking: () => {
    socketService.emit('cancel_matchmaking');
  },
  createRoom: (name: string, avatar: string) => {
    socketService.connect();
    socketService.emit('create_room', { name, avatar });
  },
  joinRoom: (roomCode: string) => {
    socketService.connect();
    socketService.emit('join_room', { roomCode });
  },
  leaveRoom: (roomId: string) => {
    socketService.emit('player_action', {
      roomId,
      action: 'LEAVE',
      payload: {}
    });
  },
  submitTurn: (roomId: string, action: any) => {
    socketService.emit('player_action', {
      roomId,
      action: 'SUBMIT_TURN',
      payload: action
    });
  },
  sendEmoji: (roomId: string, emoji: string) => {
    socketService.emit('player_action', {
      roomId,
      action: 'EMOJI',
      payload: { emoji }
    });
  },
  tossResult: (roomId: string, choice: string, result: string, winnerId: string) => {
    socketService.emit('player_action', {
      roomId,
      action: 'TOSS_RESULT',
      payload: { choice, result, winnerId }
    });
  }
};
`;
fs.writeFileSync('src/game/multiplayer/multiplayerController.ts', multiplayerCode);

// 2. Create aiController.ts
const aiCode = `import { useEffect } from 'react';
import { useGameStore } from '../../state/gameStore';
import { TacticMode } from '../../types';

export const useAiController = (API_URL: string) => {
  const {
    activeScreen, phase, settings, currentStrike, opponentTurnAction, setOpponentTurnAction
  } = useGameStore();

  useEffect(() => {
    if (activeScreen === 'GAME' && phase !== 'MATCH_OVER' && settings.mode === 'VS_AI' && !opponentTurnAction) {
      if (currentStrike !== 'AI') return;
      
      const timer = setTimeout(async () => {
        const tactics: TacticMode[] = ['DEFEND', 'ROTATE', 'ATTACK'];
        let aiTactic: TacticMode = tactics[Math.floor(Math.random() * tactics.length)];
        
        try {
          const response = await fetch(\`\${API_URL}/api/roll\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tactic: aiTactic })
          });
          const data = await response.json();
          setOpponentTurnAction({ tactic: aiTactic, roll: data.roll, catchRand: data.catchRand });
        } catch (err) {
          console.error('Failed to fetch AI roll', err);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeScreen, phase, settings.mode, currentStrike, opponentTurnAction, API_URL, setOpponentTurnAction]);
};
`;
fs.writeFileSync('src/game/ai/aiController.ts', aiCode);

// 3. Patch useGameEngine.ts
let engineCode = fs.readFileSync('src/game/engine/useGameEngine.ts', 'utf8');
// Replace AI hook (remove it)
engineCode = engineCode.replace(/useEffect\(\(\) => \{\n\s*if \(activeScreen === 'GAME'[\s\S]*?\}, \[activeScreen, phase, settings\.mode, currentStrike, opponentTurnAction, API_URL, setOpponentTurnAction\]\);\n/, '');

// Add multiplayerController import and remove socketService if not used for listening (wait, it's not listening here)
engineCode = engineCode.replace("import { socketService } from '../../utils/socket';", "import { multiplayerController } from '../multiplayer/multiplayerController';");
// Replace socketService emit in useGameEngine
engineCode = engineCode.replace(/socketService\.emit\('player_action', \{\s*roomId: multiplayerRoomId,\s*action: 'SUBMIT_TURN',\s*payload: action\s*\}\);/g, "multiplayerController.submitTurn(multiplayerRoomId, action);");

fs.writeFileSync('src/game/engine/useGameEngine.ts', engineCode);

// 4. Patch App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace("import { socketService } from './utils/socket';", "import { socketService } from './utils/socket';\nimport { multiplayerController } from './game/multiplayer/multiplayerController';\nimport { useAiController } from './game/ai/aiController';");
// Replace leave room
appCode = appCode.replace(/socketService\.emit\('player_action', \{\s*roomId: multiplayerRoomId,\s*action: 'LEAVE',\s*payload: \{\}\s*\}\);/g, "multiplayerController.leaveRoom(multiplayerRoomId);");
// Replace cancel matchmaking
appCode = appCode.replace(/socketService\.emit\('cancel_matchmaking'\);/g, "multiplayerController.cancelMatchmaking();");
// Inject useAiController
appCode = appCode.replace("const { profile, updateProfile, profileLoading } = useProfile(user);", "const { profile, updateProfile, profileLoading } = useProfile(user);\n  useAiController(API_URL);");
fs.writeFileSync('src/App.tsx', appCode);

// 5. Patch GameScreen.tsx
let gameCode = fs.readFileSync('src/screens/GameScreen.tsx', 'utf8');
gameCode = gameCode.replace("import { socketService } from '../utils/socket';", "import { multiplayerController } from '../game/multiplayer/multiplayerController';");
gameCode = gameCode.replace(/socketService\.emit\('player_action', \{\s*roomId: props\.multiplayerRoomId,\s*action: 'EMOJI',\s*payload: \{ emoji \}\s*\}\);/g, "multiplayerController.sendEmoji(props.multiplayerRoomId, emoji);");
fs.writeFileSync('src/screens/GameScreen.tsx', gameCode);

// 6. Patch TossScreen.tsx
let tossCode = fs.readFileSync('src/screens/TossScreen.tsx', 'utf8');
tossCode = tossCode.replace("import { socketService } from '../utils/socket';", "import { socketService } from '../utils/socket';\nimport { multiplayerController } from '../game/multiplayer/multiplayerController';");
tossCode = tossCode.replace(/socketService\.emit\('player_action', \{\s*roomId: roomId,\s*action: 'TOSS_RESULT',\s*payload: \{ choice: selectedChoice, result, winnerId: theWinner \}\s*\}\);/g, "multiplayerController.tossResult(roomId!, selectedChoice, result, theWinner!);");
fs.writeFileSync('src/screens/TossScreen.tsx', tossCode);

// 7. Patch LobbyScreen.tsx
let lobbyCode = fs.readFileSync('src/screens/LobbyScreen.tsx', 'utf8');
lobbyCode = lobbyCode.replace("import { socketService } from '../utils/socket';", "import { socketService } from '../utils/socket';\nimport { multiplayerController } from '../game/multiplayer/multiplayerController';");
lobbyCode = lobbyCode.replace(/socketService\.emit\('cancel_matchmaking'\);/g, "multiplayerController.cancelMatchmaking();");
lobbyCode = lobbyCode.replace(/socketService\.connect\(\);\s*socketService\.emit\('join_matchmaking'\);/g, "multiplayerController.joinMatchmaking();");
lobbyCode = lobbyCode.replace(/socketService\.connect\(\);\s*socketService\.emit\('create_room', \{ name: playerName, avatar: playerAvatar \}\);/g, "multiplayerController.createRoom(playerName || 'Player', playerAvatar || '');");
lobbyCode = lobbyCode.replace(/socketService\.connect\(\);\s*socketService\.emit\('join_room', \{ roomCode: code \}\);/g, "multiplayerController.joinRoom(code);");
fs.writeFileSync('src/screens/LobbyScreen.tsx', lobbyCode);

console.log('Phase 4 Patch Complete');
