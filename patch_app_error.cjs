const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldImport = `  // Self-Hosted Capacitor Updater Init
  useEffect(() => {
    import('./services/otaService').then(m => m.checkForUpdates());
  }, []);`;

const newImport = `  // Self-Hosted Capacitor Updater Init
  useEffect(() => {
    import('./services/otaService')
      .then(m => m.checkForUpdates().catch(e => console.warn('OTA init skipped', e)))
      .catch(e => console.warn('OTA Service load skipped', e));
  }, []);`;

code = code.replace(oldImport, newImport);
fs.writeFileSync('src/App.tsx', code);
console.log('App patched to catch OTA load errors');
