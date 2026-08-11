const fs = require('fs');
let code = fs.readFileSync('src/components/MatchPlayersBanner.tsx', 'utf8');
code = code.replace("interface MatchPlayersBannerProps {", "interface MatchPlayersBannerProps {\n  playerLevel: number;\n  opponentLevel: number;");
code = code.replace("({ youState, aiState, emojiEvent })", "({ youState, aiState, emojiEvent, playerLevel, opponentLevel })");
code = code.replace(/<span className="text-\[9px\] font-bold text-amber-400 uppercase tracking-widest">Level 5<\/span>/, "<span className=\"text-[9px] font-bold text-amber-400 uppercase tracking-widest\">Level {playerLevel}</span>");
code = code.replace(/<span className="text-\[9px\] font-bold text-amber-400 uppercase tracking-widest">Level 5<\/span>/, "<span className=\"text-[9px] font-bold text-amber-400 uppercase tracking-widest\">Level {opponentLevel}</span>");
fs.writeFileSync('src/components/MatchPlayersBanner.tsx', code);
