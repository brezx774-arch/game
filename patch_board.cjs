const fs = require('fs');

let code = fs.readFileSync('src/components/CricketBoard.tsx', 'utf8');

code = code.replace(
  /  const tilesWithCoords = useMemo\(\(\) => \{[\s\S]*?    \}\);\n  \}, \[\]\);/m,
  `  const tilesWithCoords = useMemo(() => {
    return BOARD_TILES.map((tile, i) => {
      let x = 0; let y = 0;
      if (i < 8) { 
         x = (i / 8) * 100; 
         y = 0; 
      } else if (i < 16) { 
         x = 100; 
         y = ((i - 8) / 8) * 100; 
      } else if (i < 24) { 
         x = 100 - ((i - 16) / 8) * 100; 
         y = 100; 
      } else { 
         x = 0; 
         y = 100 - ((i - 24) / 8) * 100; 
      }
      return { ...tile, x, y };
    });
  }, []);`
);

code = code.replace(
  /tile\.index === youTileIndex \|\| tile\.index === aiTileIndex/g,
  `tile.id === youTileIndex || tile.id === aiTileIndex`
);
code = code.replace(
  /const isCorner = tile\.index % 8 === 0;/g,
  `const isCorner = tile.id % 8 === 0;`
);

fs.writeFileSync('src/components/CricketBoard.tsx', code);
