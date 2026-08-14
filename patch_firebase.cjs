const fs = require('fs');
let c = fs.readFileSync('src/lib/firebase.ts', 'utf-8');

c = c.replace(
  "import { getFirestore } from 'firebase/firestore';",
  "import { getFirestore, initializeFirestore } from 'firebase/firestore';"
);

c = c.replace(
  "export const db = getFirestore(app, config.firestoreDatabaseId);",
  "export const db = initializeFirestore(app, { experimentalForceLongPolling: true }, config.firestoreDatabaseId);"
);

fs.writeFileSync('src/lib/firebase.ts', c);
