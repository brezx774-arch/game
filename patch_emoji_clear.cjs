const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const effect = `
  useEffect(() => {
    if (emojiEvent) {
      const timer = setTimeout(() => {
        setEmojiEvent(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [emojiEvent]);
`;

code = code.replace("  // Initialize Socket Connection", effect + "\n  // Initialize Socket Connection");
fs.writeFileSync('src/App.tsx', code);
