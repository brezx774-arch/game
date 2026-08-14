const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `  // Capacitor Updater Init
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      CapacitorUpdater.notifyAppReady();
    }
  }, []);`;

const replace = `  // Self-Hosted Capacitor Updater Init
  useEffect(() => {
    const checkForUpdates = async () => {
      if (!Capacitor.isNativePlatform()) return;
      try {
        await CapacitorUpdater.notifyAppReady();
        
        // Check our VPS for updates
        const SERVER_URL = import.meta.env.VITE_SERVER_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
        const response = await fetch(\`\${SERVER_URL}/api/check-update\`);
        const data = await response.json();
        
        const currentVersion = localStorage.getItem('app_version') || '1.0.0';
        
        if (data.url && data.version !== currentVersion) {
          console.log('Downloading new update:', data.version);
          const version = await CapacitorUpdater.download({
            url: data.url,
            version: data.version,
          });
          localStorage.setItem('app_version', data.version);
          await CapacitorUpdater.set(version);
        }
      } catch (err) {
        console.error('Update check failed:', err);
      }
    };
    checkForUpdates();
  }, []);`;

if (c.includes(target)) {
    c = c.replace(target, replace);
    fs.writeFileSync('src/App.tsx', c);
}
