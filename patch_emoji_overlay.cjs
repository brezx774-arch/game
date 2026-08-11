const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const emojiOverlay = `
      {emojiEvent && (
        <motion.div
          key={emojiEvent.id}
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1.5, y: -50 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className={\`absolute top-1/3 z-[100] text-6xl \${emojiEvent.player === 'YOU' ? 'left-10' : 'right-10'}\`}
          onAnimationComplete={() => setEmojiEvent(null)}
        >
          {emojiEvent.emoji}
        </motion.div>
      )}
`;

code = code.replace("{/* Commentary Event Banner */}", emojiOverlay + "\n          {/* Commentary Event Banner */}");
fs.writeFileSync('src/App.tsx', code);
