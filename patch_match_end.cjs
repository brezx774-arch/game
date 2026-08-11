const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "onPlayAgain={handleRestartMatch}",
  "onPlayAgain={settings.mode === 'MULTIPLAYER' ? undefined : handleRestartMatch}"
);

fs.writeFileSync('src/App.tsx', code);

let modalCode = fs.readFileSync('src/components/MatchEndModal.tsx', 'utf8');
modalCode = modalCode.replace(
  "  onPlayAgain: () => void;",
  "  onPlayAgain?: () => void;"
);

const oldPlayAgain = `<button
            onClick={() => {
              soundFx.playClick();
              onPlayAgain();
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-black text-sm uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>PLAY AGAIN</span>
          </button>`;

const newPlayAgain = `{onPlayAgain && (<button
            onClick={() => {
              soundFx.playClick();
              onPlayAgain();
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-black text-sm uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>PLAY AGAIN</span>
          </button>)}`;

modalCode = modalCode.replace(oldPlayAgain, newPlayAgain);
fs.writeFileSync('src/components/MatchEndModal.tsx', modalCode);
