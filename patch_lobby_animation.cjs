const fs = require('fs');
let code = fs.readFileSync('src/components/LobbyScreen.tsx', 'utf8');

const matchStartReplacement = `    const handleMatchStart = (data: { firstStriker: string; groundIndex?: number }) => {
      setIsMatchmaking(false);
      setCreatedRoomCode(null);
      setIsSelecting(true);
      
      let iterations = 0;
      let currentIndex = Math.floor(Math.random() * stadiums.length);
      const targetGroundIndex = data.groundIndex !== undefined ? data.groundIndex : Math.floor(Math.random() * stadiums.length);
      
      let baseSpins = 15;
      let diff = (targetGroundIndex - ((currentIndex + baseSpins) % stadiums.length));
      if (diff < 0) diff += stadiums.length;
      const targetSpins = baseSpins + diff;
      
      const baseDelay = 50;
      setRouletteIndex(currentIndex);
      
      const spin = () => {
        iterations++;
        currentIndex = (currentIndex + 1) % stadiums.length;
        setRouletteIndex(currentIndex);

        if (iterations < targetSpins) {
          setTimeout(spin, baseDelay + (iterations * 5));
        } else {
          setTimeout(() => {
            setIsSelecting(false);
            onStartMultiplayer(currentRoomId, data.firstStriker, currentOpponentId, currentOpponentName, isBotMatch, targetGroundIndex);
          }, 800);
        }
      };
      spin();
    };`;

code = code.replace(/const handleMatchStart = \(data[^}]+\}[^}]+\};/, matchStartReplacement);
fs.writeFileSync('src/components/LobbyScreen.tsx', code);
