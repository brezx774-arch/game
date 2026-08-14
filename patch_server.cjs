const fs = require('fs');
let c = fs.readFileSync('server.ts', 'utf-8');

const target = "app.use(express.json());";
const replace = `app.use(express.json());

  // Self-Hosted OTA Update Endpoint
  app.get('/api/check-update', (req, res) => {
    // Read the version from env or fallback
    // The zip file should be hosted at this URL on your VPS
    res.json({
      version: process.env.APP_VERSION || '1.0.0',
      url: process.env.APP_UPDATE_URL || ''
    });
  });
`;

if (c.includes(target) && !c.includes('/api/check-update')) {
    c = c.replace(target, replace);
    fs.writeFileSync('server.ts', c);
}
