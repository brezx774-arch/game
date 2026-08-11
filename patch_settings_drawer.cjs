const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsDrawer.tsx', 'utf8');

// Hide game mode/overs/diff if mode is MULTIPLAYER
code = code.replace("{/* Game Mode */}", "{settings.mode !== 'MULTIPLAYER' && (<>\n            {/* Game Mode */}");
code = code.replace("{/* Audio Toggle */}", "</>)}\n            {/* Audio Toggle */}");

// Hide New Match button if mode is MULTIPLAYER
code = code.replace(
  "<button\n            onClick={() => {\n              soundFx.playClick();\n              onRestartMatch();\n              onClose();\n            }}\n            className=\"w-full py-3 rounded-xl bg-rose-900/80 border border-rose-700 text-rose-100 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-rose-800 transition-colors cursor-pointer active:scale-98\"\n          >\n            <RotateCcw className=\"w-4 h-4\" />\n            <span>New Match</span>\n          </button>",
  "{settings.mode !== 'MULTIPLAYER' && (\n          <button\n            onClick={() => {\n              soundFx.playClick();\n              onRestartMatch();\n              onClose();\n            }}\n            className=\"w-full py-3 rounded-xl bg-rose-900/80 border border-rose-700 text-rose-100 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-rose-800 transition-colors cursor-pointer active:scale-98\"\n          >\n            <RotateCcw className=\"w-4 h-4\" />\n            <span>New Match</span>\n          </button>\n          )}"
);

fs.writeFileSync('src/components/SettingsDrawer.tsx', code);
