const fs = require('fs');

// 1. Fix CricketBoard (Avatar coordinate bug and Pitch size)
let boardCode = fs.readFileSync('src/components/CricketBoard.tsx', 'utf8');

boardCode = boardCode.replace(
  /left: \`\$\{tilesWithCoords\[index\]\?\.x \|\| 50\}%\`,/g,
  'left: `${tilesWithCoords[index]?.x ?? 50}%`,'
);
boardCode = boardCode.replace(
  /top: \`\$\{tilesWithCoords\[index\]\?\.y \|\| 50\}%\`,/g,
  'top: `${tilesWithCoords[index]?.y ?? 50}%`,'
);

// Fix Pitch Base to look like a cricket pitch (central rectangle)
const oldPitch = "className={`absolute inset-4 rounded-3xl ${ground?.pitchColorClass || 'bg-[#e5d3b3]'} border-4 ${ground?.grassColorClass ? 'border-transparent' : 'border-emerald-800/40'} shadow-2xl`}";
const newPitch = "className={`absolute top-[25%] bottom-[25%] left-[38%] right-[38%] rounded-sm ${ground?.pitchColorClass || 'bg-[#e5d3b3]'} border-2 ${ground?.grassColorClass ? 'border-transparent' : 'border-emerald-800/40'} shadow-2xl`}";
boardCode = boardCode.replace(oldPitch, newPitch);

// Add a circle in the grass to represent the infield
boardCode = boardCode.replace(
  "{/* Stadium Pitch Base */}",
  "{/* 30-yard circle */}\n      <div className=\"absolute inset-[15%] rounded-[50%] border-2 border-white/20 pointer-events-none\" />\n      {/* Stadium Pitch Base */}"
);

fs.writeFileSync('src/components/CricketBoard.tsx', boardCode);

// 2. Fix boardData.ts to make tile 0 START
let dataCode = fs.readFileSync('src/utils/boardData.ts', 'utf8');

dataCode = dataCode.replace(
  /  \{\n    id: 0,\n    type: 'FREE_HIT',\n    label: 'FH',\n    sublabel: 'Free Hit',\n    colorClass: 'border-emerald-400 bg-emerald-950\/80 text-emerald-300',\n    bgHex: '#064e3b',\n    borderHex: '#34d399',\n    textHex: '#6ee7b7',\n    badge: 'FREE HIT'\n  \},/,
  `  {
    id: 0,
    type: 'START',
    label: 'START',
    sublabel: 'Start',
    colorClass: 'border-emerald-400 bg-emerald-950/80 text-emerald-300',
    bgHex: '#064e3b',
    borderHex: '#34d399',
    textHex: '#6ee7b7',
    badge: 'START'
  },`
);

fs.writeFileSync('src/utils/boardData.ts', dataCode);

