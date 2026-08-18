import { Capacitor } from '@capacitor/core';
import { CapacitorUpdater } from '@capgo/capacitor-updater';

export const checkForUpdates = async () => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await CapacitorUpdater.notifyAppReady();
    
    // Check our VPS for updates
    const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'https://amongush.duckdns.org';
    const response = await fetch(`${SERVER_URL}/api/check-update`);
    const data = await response.json();
    
    const currentVersion = localStorage.getItem('app_version') || '1.0.0';
    
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
    }
  } catch (error) {
    console.error('OTA Update check failed:', error);
  }
};
