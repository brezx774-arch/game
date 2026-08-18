const fs = require('fs');
let code = fs.readFileSync('src/services/otaService.ts', 'utf8');

const oldCheck = `    if (data.url && data.version !== currentVersion) {
      console.log('Downloading new update:', data.version);
      const version = await CapacitorUpdater.download({
        url: data.url,
        version: data.version,
      });
      localStorage.setItem('app_version', data.version);
      await CapacitorUpdater.set(version);
      await CapacitorUpdater.reload();
    }`;

const newCheck = `    if (data.url && data.version !== currentVersion) {
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

code = code.replace(oldCheck, newCheck);
fs.writeFileSync('src/services/otaService.ts', code);
console.log('otaService.ts patched');
