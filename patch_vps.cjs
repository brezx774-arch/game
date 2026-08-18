const fs = require('fs');
let code = fs.readFileSync('.github/workflows/deploy-vps.yml', 'utf8');

// Change the zip command to only zip the frontend assets, avoiding server.cjs and apk
const oldZip = `            # Zip the dist/ output
            cd dist
            ZIP_NAME="update_\${SHORT_SHA}.zip"
            zip -r $ZIP_NAME *`;

const newZip = `            # Zip the dist/ output (frontend assets only)
            cd dist
            ZIP_NAME="update_\${SHORT_SHA}.zip"
            # Remove server backend files before zipping to keep OTA lightweight
            rm -f server.cjs server.cjs.map app-debug.apk
            zip -r $ZIP_NAME *`;

code = code.replace(oldZip, newZip);
fs.writeFileSync('.github/workflows/deploy-vps.yml', code);
console.log('deploy-vps.yml patched');
