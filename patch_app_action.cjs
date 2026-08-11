const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const newProps = `            disabled={phase === 'MATCH_OVER' || (currentStrike === 'AI' && (settings.mode === 'VS_AI' || settings.mode === 'MULTIPLAYER'))}
            showEmoji={settings.mode === 'MULTIPLAYER'}
            onSendEmoji={(emoji) => {
              if (settings.mode === 'MULTIPLAYER' && multiplayerRoomId) {
                socketService.emit('player_action', {
                  roomId: multiplayerRoomId,
                  action: 'EMOJI',
                  payload: { emoji }
                });
                setEmojiEvent({ player: 'YOU', emoji, id: Date.now() });
              }
            }}`;

code = code.replace("disabled={phase === 'MATCH_OVER' || (currentStrike === 'AI' && (settings.mode === 'VS_AI' || settings.mode === 'MULTIPLAYER'))}", newProps);

fs.writeFileSync('src/App.tsx', code);
