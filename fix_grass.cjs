const fs = require('fs');

let code = fs.readFileSync('src/components/CricketBoard.tsx', 'utf8');

code = code.replace(
  /    <div className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-square my-4 sm:my-8 px-6 sm:px-8">/,
  `    <div className={\`relative w-full max-w-sm sm:max-w-md mx-auto aspect-square my-4 sm:my-8 \${ground?.grassColorClass || 'bg-emerald-800'} rounded-[3rem] shadow-2xl overflow-hidden\`}>
      {/* Grass pattern overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.2) 10px, rgba(0,0,0,0.2) 20px)'
      }} />`
);

fs.writeFileSync('src/components/CricketBoard.tsx', code);
