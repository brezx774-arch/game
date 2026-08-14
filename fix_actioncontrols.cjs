const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStart = '{/* Action Controls (Defend, Rotate, Attack, ROLL) */}';
const targetEnd = '</div>\n        </div>\n      )}';

const splitA = code.split(targetStart);
if (splitA.length < 2) { console.log("Start not found"); process.exit(1); }
const splitB = splitA[1].split(targetEnd);
if (splitB.length < 2) { console.log("End not found"); process.exit(1); }

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
          `;

fs.writeFileSync('src/App.tsx', splitA[0] + targetStart + newChunk + targetEnd + splitB[1]);
