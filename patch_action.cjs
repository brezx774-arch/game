const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /          <div className="flex flex-col items-center">\n            \{ isUserFinished \? \([\s\S]*?\}              \/>\n            \)\}\n          <\/div>/m,
  `          <div className="flex flex-col items-center">
            {/* Timer visualizer */}
            {activeScreen === 'GAME' && phase !== 'MATCH_OVER' && !isRolling && (
              <div className="w-full max-w-xl mx-auto px-4 mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-stone-400">TURN TIMER</span>
                <div className="flex-1 mx-3 h-2 bg-stone-800 rounded-full overflow-hidden border border-stone-700">
                  <div 
                    className={\`h-full transition-all duration-1000 \${turnTimer <= 3 ? 'bg-rose-500' : 'bg-amber-500'}\`} 
                    style={{ width: \`\${(Math.max(0, turnTimer) / 20) * 100}%\` }}
                  />
                </div>
                <span className={\`text-sm font-black \${turnTimer <= 3 ? 'text-rose-500' : 'text-amber-500'}\`}>{turnTimer}s</span>
              </div>
            )}
            { (currentStrike === 'YOU' || settings.mode === 'PASS_AND_PLAY') ? (
              <ActionControls
                selectedTactic={selectedTactic}
                onSelectTactic={setSelectedTactic}
                onRoll={() => handleActionSubmit()}
                isRolling={isRolling || (currentStrike === 'YOU' ? myTurnAction !== null : opponentTurnAction !== null)}
                disabled={phase === 'MATCH_OVER'}
                showEmoji={!!multiplayerRoomId}
                isBatting={true} // Since it's only batting now
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
            ) : (
              <div className="flex flex-col items-center justify-center p-6 bg-[#0f172a] border-t-2 border-[#1e293b] rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.8)] h-32 w-full max-w-xl mx-auto">
                <h3 className="text-xl font-black text-amber-500 uppercase tracking-widest mb-2 animate-pulse">
                  {settings.mode === 'VS_AI' ? 'AI is Batting...' : 'Opponent is Batting...'}
                </h3>
                <p className="text-stone-400 text-sm">Please wait while they take their turn.</p>
              </div>
            )}
          </div>`
);

fs.writeFileSync('src/App.tsx', code);
