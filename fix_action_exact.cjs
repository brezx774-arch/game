const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStart = '{/* Action Controls (Defend, Rotate, Attack, ROLL) */}';
const targetEnd = '        </div>\n      )}';

const splitA = code.split(targetStart);
const splitB = splitA[1].split(targetEnd);

const newChunk = `
          <div className="flex flex-col items-center">
            <ActionControls
              selectedTactic={selectedTactic}
              onSelectTactic={setSelectedTactic}
              onRoll={() => handleActionSubmit()}
              isRolling={isRolling || (currentStrike === 'YOU' ? myTurnAction !== null : opponentTurnAction !== null)}
              disabled={phase === 'MATCH_OVER' || (settings.mode !== 'PASS_AND_PLAY' && currentStrike !== 'YOU')}
              showEmoji={!!multiplayerRoomId}
              isBatting={true}
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
          </div>
`;

fs.writeFileSync('src/App.tsx', splitA[0] + targetStart + newChunk + targetEnd + splitB[1]);
