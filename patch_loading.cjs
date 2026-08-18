const fs = require('fs');
let code = fs.readFileSync('src/screens/LoadingScreen.tsx', 'utf8');

const oldBg = `<div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/loading_bg.jpg)' }}
      />`;

const newBg = `<img 
        src="/loading_bg.jpg"
        alt="Loading Background"
        className="absolute inset-0 w-full h-full object-cover"
      />`;

if (code.includes('url(/loading_bg.jpg)')) {
  code = code.replace(oldBg, newBg);
  fs.writeFileSync('src/screens/LoadingScreen.tsx', code);
  console.log('Fixed loading bg');
} else {
  console.log('Could not find target');
}
