const fs = require('fs');
const path = '.github/workflows/deploy-vps.yml';
let code = fs.readFileSync(path, 'utf8');

const oldCode = `# Remove server backend files before zipping to keep OTA lightweight
            rm -f server.cjs server.cjs.map app-debug.apk
            zip -r $ZIP_NAME *`;

const newCode = `# Exclude server backend files during zip to keep OTA lightweight, without deleting them from disk!
            zip -r $ZIP_NAME * -x "server.cjs" -x "server.cjs.map" -x "app-debug.apk"`;

if (code.includes('rm -f server.cjs')) {
  code = code.replace(oldCode, newCode);
  fs.writeFileSync(path, code);
  console.log('Fixed deploy-vps.yml');
} else {
  console.log('Could not find the target code to replace.');
}
