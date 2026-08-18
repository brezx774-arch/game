const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const importStr = "import { GameScreen } from './screens/GameScreen';\n";
let newContent = content;

// Add import if not exists
if (!newContent.includes('GameScreen')) {
  newContent = importStr + newContent;
}

// Find the start of the else block for activeScreen
const startIndex = newContent.indexOf('<div className="relative z-10 flex-1 flex flex-col w-full max-w-2xl mx-auto pb-4 h-full overflow-hidden">');
const endIndex = newContent.indexOf('/>\n    </div>\n  );\n}');

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `<GameScreen
          settings={settings}
          coins={coins}
          playerLevel={playerLevel}
          xpProgress={xpProgress}
          selectedGround={selectedGround}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          isRulesOpen={isRulesOpen}
          setIsRulesOpen={setIsRulesOpen}
          handleToggleMute={handleToggleMute}
          youState={youState}
          aiState={aiState}
          emojiEvent={emojiEvent}
          isCurrentPowerplay={isCurrentPowerplay}
          currentStrike={currentStrike}
          turnTimer={turnTimer}
          activeScreen={activeScreen}
          phase={phase}
          isRolling={isRolling}
          youTileIndex={youTileIndex}
          aiTileIndex={aiTileIndex}
          selectedTactic={selectedTactic}
          setSelectedTactic={setSelectedTactic}
          handleActionSubmit={handleActionSubmit}
          myTurnAction={myTurnAction}
          opponentTurnAction={opponentTurnAction}
          multiplayerRoomId={multiplayerRoomId}
          showDiceModal={showDiceModal}
          diceVal={diceVal}
          landedTileInfo={landedTileInfo}
          handleRestartMatch={handleRestartMatch}
          handleExitToLobby={handleExitToLobby}
          targetRuns={targetRuns}
          setSettings={setSettings}
          setEmojiEvent={setEmojiEvent}
        />
      )}
`;
  // We need to keep `    </div>\n  );\n}` after the replacement, so we replace from startIndex up to `/>\n    </div>\n  );\n}`
  const part1 = newContent.substring(0, startIndex);
  // Wait, `/>\n    </div>\n  );\n}` matches the end of `MatchEndModal`.
  // Let's replace up to `    </div>\n  );\n}`
  const exactEndStr = `        onExitToLobby={handleExitToLobby}\n      />\n`;
  const endIndex2 = newContent.indexOf(exactEndStr, startIndex);
  if (endIndex2 !== -1) {
    const part2 = newContent.substring(endIndex2 + exactEndStr.length);
    fs.writeFileSync('src/App.tsx', part1 + replacement + part2);
    console.log("Patched successfully");
  } else {
    console.log("Could not find end string.");
  }
} else {
  console.log("Could not find start string.");
}
