import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sixappeal.cricket',
  appName: 'Cricket Royale',
  webDir: 'dist',
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ["google.com", "facebook.com", "phone"]
    }
  }
};

export default config;
