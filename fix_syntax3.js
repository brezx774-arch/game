import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const searchRegex = /socketService\.off\('opponent_disconnected', handleOpponentDisconnected\);\s*\};\s*\},\s*\[activeScreen[^\]]+\]\);\s*return \(/;

code = code.replace(searchRegex, `socketService.off('opponent_disconnected', handleOpponentDisconnected);
      };
    }
  }, [settings.mode]);

  return (`);
fs.writeFileSync('src/App.tsx', code);
