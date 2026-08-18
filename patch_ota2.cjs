const fs = require('fs');
let code = fs.readFileSync('src/services/otaService.ts', 'utf8');

const oldCheck = `    const currentVersion = localStorage.getItem('app_version') || '1.0.0';

    if (data.url && data.version !== currentVersion) {
      console.log('Downloading new update:', data.version);
      try {
        const version = await CapacitorUpdater.download({
          url: data.url,
          version: data.version,
        });

        await CapacitorUpdater.set(version);
        // Only save to localStorage AFTER set succeeds to prevent fake-success bug
        localStorage.setItem('app_version', data.version);
        await CapacitorUpdater.reload();
      } catch (err) {
        console.error('Failed to apply update, clearing version:', err);
        localStorage.removeItem('app_version'); // Reset so it tries again next time
      }
    }`;

const newCheck = `    const bundledVersion = import.meta.env.VITE_APP_VERSION || '1.0.0';
    console.log('Current App Version:', bundledVersion);
    console.log('Server Update Version:', data.version);

    if (data.url && data.version !== bundledVersion) {
      console.log('Downloading new update:', data.version);
      try {
        const version = await CapacitorUpdater.download({
          url: data.url,
          version: data.version,
        });

        await CapacitorUpdater.set(version);
        await CapacitorUpdater.reload();
      } catch (err) {
        console.error('Failed to apply update:', err);
      }
    }`;

if (code.includes('localStorage.getItem')) {
  code = code.replace(oldCheck, newCheck);
  fs.writeFileSync('src/services/otaService.ts', code);
  console.log('Fixed otaService.ts');
} else {
  console.log('Could not find target code');
}
