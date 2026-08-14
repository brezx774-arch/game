const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "const [youTileIndex, setYouTileIndex] = useState<number>(1);",
  "const [youTileIndex, setYouTileIndex] = useState<number>(0);"
);

code = code.replace(
  "const [aiTileIndex, setAiTileIndex] = useState<number>(1);",
  "const [aiTileIndex, setAiTileIndex] = useState<number>(0);"
);

code = code.replace(
  "setYouTileIndex(1);",
  "setYouTileIndex(0);"
);

code = code.replace(
  "setAiTileIndex(1);",
  "setAiTileIndex(0);"
);

code = code.replace(
  /let newIndex = currentIndex \+ combinedRoll;\n      if \(newIndex > 36\) newIndex -= 36;/g,
  "let newIndex = (currentIndex + combinedRoll) % 32;"
);

fs.writeFileSync('src/App.tsx', code);
