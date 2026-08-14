const fs = require('fs');
let code = fs.readFileSync('src/components/CricketBoard.tsx', 'utf8');

code = code.replace(
  /<div \n        className="absolute inset-0 w-full h-full pointer-events-auto"/,
  `<div 
        className="absolute inset-6 sm:inset-8 w-[calc(100%-3rem)] sm:w-[calc(100%-4rem)] h-[calc(100%-3rem)] sm:h-[calc(100%-4rem)] pointer-events-auto"`
);

fs.writeFileSync('src/components/CricketBoard.tsx', code);
