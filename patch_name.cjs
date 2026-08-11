const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace('<title>My Google AI Studio App</title>', '<title>Cricket Royale</title>');
fs.writeFileSync('index.html', indexHtml);

let metadata = JSON.parse(fs.readFileSync('metadata.json', 'utf8'));
metadata.name = "Cricket Royale";
metadata.description = "Cricket Royale is an immersive circular cricket board game featuring dice rolling, tactical shots (Defend, Rotate, Attack), multiplayer, AI & Pass-n-Play modes, and full stadium visuals.";
fs.writeFileSync('metadata.json', JSON.stringify(metadata, null, 2));

