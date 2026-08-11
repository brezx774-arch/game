const fs = require('fs');
let code = fs.readFileSync('src/components/ActionControls.tsx', 'utf8');

// We need to know if the player is batting or bowling to show the right tactics
code = code.replace(
  "interface ActionControlsProps {",
  "interface ActionControlsProps {\n  isBatting: boolean;"
);

code = code.replace(
  "  showEmoji,\n}) => {",
  "  showEmoji,\n  isBatting,\n}) => {"
);

// Tactic definitions
const tacticsStr = `
          <div className="flex gap-2">
            {isBatting ? (
              <>
            {/* DEFEND */}
            <motion.button
              whileTap={{ scale: 0.9, y: 4 }}
              disabled={disabled || isRolling}
              onClick={() => {
                soundFx.playClick();
                onSelectTactic("DEFEND");
              }}
              className={\`flex-1 relative flex flex-col items-center justify-center p-2 rounded-xl border-b-4 transition-all overflow-hidden \${
                selectedTactic === "DEFEND"
                  ? "bg-gradient-to-b from-[#3b82f6] to-[#2563eb] border-[#1e40af] text-white shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                  : "bg-[#1e293b] border-[#0f172a] text-[#94a3b8] hover:bg-[#334155]"
              } \${disabled || isRolling ? "opacity-50 grayscale" : ""}\`}
            >
              <Shield className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-black uppercase">DEFEND</span>
            </motion.button>
            {/* ROTATE */}
            <motion.button
              whileTap={{ scale: 0.9, y: 4 }}
              disabled={disabled || isRolling}
              onClick={() => {
                soundFx.playClick();
                onSelectTactic("ROTATE");
              }}
              className={\`flex-1 relative flex flex-col items-center justify-center p-2 rounded-xl border-b-4 transition-all overflow-hidden \${
                selectedTactic === "ROTATE"
                  ? "bg-gradient-to-b from-[#10b981] to-[#059669] border-[#064e3b] text-white shadow-[0_0_20px_rgba(16,185,129,0.6)]"
                  : "bg-[#1e293b] border-[#0f172a] text-[#94a3b8] hover:bg-[#334155]"
              } \${disabled || isRolling ? "opacity-50 grayscale" : ""}\`}
            >
              <RotateCw className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-black uppercase">ROTATE</span>
            </motion.button>
            {/* ATTACK */}
            <motion.button
              whileTap={{ scale: 0.9, y: 4 }}
              disabled={disabled || isRolling}
              onClick={() => {
                soundFx.playClick();
                onSelectTactic("ATTACK");
              }}
              className={\`flex-1 relative flex flex-col items-center justify-center p-2 rounded-xl border-b-4 transition-all overflow-hidden \${
                selectedTactic === "ATTACK"
                  ? "bg-gradient-to-b from-[#f59e0b] to-[#d97706] border-[#92400e] text-white shadow-[0_0_20px_rgba(245,158,11,0.6)]"
                  : "bg-[#1e293b] border-[#0f172a] text-[#94a3b8] hover:bg-[#334155]"
              } \${disabled || isRolling ? "opacity-50 grayscale" : ""}\`}
            >
              <svg className="w-5 h-5 mb-1 fill-current" viewBox="0 0 24 24"><path d="M19.7 3.3a1 1 0 0 0-1.4 0l-12 12a1 1 0 0 0 0 1.4l2 2a1 1 0 0 0 1.4 0l12-12a1 1 0 0 0 0-1.4l-2-2zM3 21l3-3-1.4-1.4L1.6 19.6a1 1 0 0 0 0 1.4l0 0a1 1 0 0 0 1.4 0z" /></svg>
              <span className="text-[10px] font-black uppercase">ATTACK</span>
            </motion.button>
            </>
            ) : (
            <>
            {/* FAST */}
            <motion.button
              whileTap={{ scale: 0.9, y: 4 }}
              disabled={disabled || isRolling}
              onClick={() => {
                soundFx.playClick();
                onSelectTactic("FAST");
              }}
              className={\`flex-1 relative flex flex-col items-center justify-center p-2 rounded-xl border-b-4 transition-all overflow-hidden \${
                selectedTactic === "FAST"
                  ? "bg-gradient-to-b from-[#ef4444] to-[#b91c1c] border-[#7f1d1d] text-white shadow-[0_0_20px_rgba(239,68,68,0.6)]"
                  : "bg-[#1e293b] border-[#0f172a] text-[#94a3b8] hover:bg-[#334155]"
              } \${disabled || isRolling ? "opacity-50 grayscale" : ""}\`}
            >
              <span className="text-sm mb-1">🔥</span>
              <span className="text-[10px] font-black uppercase">FAST</span>
            </motion.button>
            {/* SPIN */}
            <motion.button
              whileTap={{ scale: 0.9, y: 4 }}
              disabled={disabled || isRolling}
              onClick={() => {
                soundFx.playClick();
                onSelectTactic("SPIN");
              }}
              className={\`flex-1 relative flex flex-col items-center justify-center p-2 rounded-xl border-b-4 transition-all overflow-hidden \${
                selectedTactic === "SPIN"
                  ? "bg-gradient-to-b from-[#8b5cf6] to-[#6d28d9] border-[#4c1d95] text-white shadow-[0_0_20px_rgba(139,92,246,0.6)]"
                  : "bg-[#1e293b] border-[#0f172a] text-[#94a3b8] hover:bg-[#334155]"
              } \${disabled || isRolling ? "opacity-50 grayscale" : ""}\`}
            >
              <span className="text-sm mb-1">🌪️</span>
              <span className="text-[10px] font-black uppercase">SPIN</span>
            </motion.button>
            {/* YORKER */}
            <motion.button
              whileTap={{ scale: 0.9, y: 4 }}
              disabled={disabled || isRolling}
              onClick={() => {
                soundFx.playClick();
                onSelectTactic("YORKER");
              }}
              className={\`flex-1 relative flex flex-col items-center justify-center p-2 rounded-xl border-b-4 transition-all overflow-hidden \${
                selectedTactic === "YORKER"
                  ? "bg-gradient-to-b from-[#14b8a6] to-[#0f766e] border-[#134e4a] text-white shadow-[0_0_20px_rgba(20,184,166,0.6)]"
                  : "bg-[#1e293b] border-[#0f172a] text-[#94a3b8] hover:bg-[#334155]"
              } \${disabled || isRolling ? "opacity-50 grayscale" : ""}\`}
            >
              <span className="text-sm mb-1">🎯</span>
              <span className="text-[10px] font-black uppercase">YORKER</span>
            </motion.button>
            </>
            )}
          </div>
`;

// Find where `<div className="flex gap-2">` is and replace up to `</div>` before `</div> {/* Giant ROLL Button */}`
// Actually I'll just use a simpler replace strategy:
code = code.substring(0, code.indexOf('<div className="flex gap-2">')) + tacticsStr + code.substring(code.indexOf('</div>', code.indexOf('</motion.button>', code.lastIndexOf('ATTACK')) + 10) + 6);

// Update ROLL button text
code = code.replace(
  "{isRolling ? \"ROLLING\" : \"ROLL!\"}",
  "{isRolling ? \"WAITING\" : (isBatting ? \"BAT!\" : \"BOWL!\")}"
);
code = code.replace(
  "{isRolling ? \"ROLLING\" : \"ROLL!\"}",
  "{isRolling ? \"WAITING\" : (isBatting ? \"BAT!\" : \"BOWL!\")}"
);
code = code.replace(
  "{isRolling ? \"ROLLING\" : \"ROLL!\"}",
  "{isRolling ? \"WAITING\" : (isBatting ? \"BAT!\" : \"BOWL!\")}"
);

fs.writeFileSync('src/components/ActionControls.tsx', code);
