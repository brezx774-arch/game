const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

const oldImport = "import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';";
const newImport = "import { initializeAuth, browserLocalPersistence, browserPopupRedirectResolver, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';";

const oldAuth = "export const auth = getAuth(app);";
const newAuth = `export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
  popupRedirectResolver: browserPopupRedirectResolver
});`;

if (code.includes('getAuth')) {
  code = code.replace(oldImport, newImport).replace(oldAuth, newAuth);
  fs.writeFileSync('src/lib/firebase.ts', code);
  console.log('Firebase auth patched');
} else {
  console.log('already patched');
}
