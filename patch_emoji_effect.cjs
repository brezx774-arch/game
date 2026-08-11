const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const effect = `
  // Emoji clear timer
  useEffect(() => {
    if (emojiEvent) {
      const timer = setTimeout(() => {
        setEmojiEvent(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [emojiEvent]);
`;

code = code.replace("  // Main Dice Roll Handler", effect + "\n  // Main Dice Roll Handler");
fs.writeFileSync('src/App.tsx', code);
