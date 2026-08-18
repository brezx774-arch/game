const fs = require('fs');
let code = fs.readFileSync('src/services/otaService.ts', 'utf8');

const newCode = `import { Capacitor } from '@capacitor/core';
import { CapacitorUpdater } from '@capgo/capacitor-updater';

export const checkForUpdates = async () => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await CapacitorUpdater.notifyAppReady();
    
    const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'https://amongush.duckdns.org';
    const response = await fetch(\`\${SERVER_URL}/api/check-update\`);
    const data = await response.json();
    
    // Use the Vite injected version from the build, NOT localStorage!
    const bundledVersion = import.meta.env.VITE_APP_VERSION || '1.0.0';
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
        // Wipe any poisoned localStorage just in case
        localStorage.removeItem('app_version');
        await CapacitorUpdater.reload();
      } catch (err) {
        console.error('Failed to apply update:', err);
      }
    }
  } catch (error) {
    console.error('OTA Update check failed:', error);
  }
};`;

fs.writeFileSync('src/services/otaService.ts', newCode);
console.log('Fully replaced otaService.ts');
