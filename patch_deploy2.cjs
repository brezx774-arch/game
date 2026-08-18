const fs = require('fs');
let code = fs.readFileSync('.github/workflows/deploy-vps.yml', 'utf8');

const oldDeployCode = `            # Pull latest changes from GitHub
            git pull origin main

            # Install dependencies and build
            npm install
            npm run build

            # Zip the dist/ output (frontend assets only)
            cd dist
            ZIP_NAME="update_\${SHORT_SHA}.zip"
            # Exclude server backend files during zip to keep OTA lightweight, without deleting them from disk!
            zip -r $ZIP_NAME * -x "server.cjs" -x "server.cjs.map" -x "app-debug.apk"

            # Copy to Nginx updates directory (added sudo in case of permissions, but usually works without if you own the folder)
            mkdir -p /var/www/html/updates/
            cp $ZIP_NAME /var/www/html/updates/

            # Go back to project root
            cd ..

            # Update .env file
            # Remove existing APP_VERSION and APP_UPDATE_URL lines if they exist
            sed -i '/^APP_VERSION=/d' .env
            sed -i '/^APP_UPDATE_URL=/d' .env

            # Append new variables
            echo "APP_VERSION=\${SHORT_SHA}" >> .env
            echo "APP_UPDATE_URL=https://amongush.duckdns.org/updates/\${ZIP_NAME}" >> .env

            # Restart the PM2 process
            /root/.nvm/versions/node/v24.18.1/bin/pm2 restart cricket-server --update-env`;

const newDeployCode = `            # Pull latest changes from GitHub
            git pull origin main

            # Update .env file BEFORE building so Vite can bake it into the frontend
            sed -i '/^APP_VERSION=/d' .env
            sed -i '/^APP_UPDATE_URL=/d' .env
            sed -i '/^VITE_APP_VERSION=/d' .env

            ZIP_NAME="update_\${SHORT_SHA}.zip"
            echo "APP_VERSION=\${SHORT_SHA}" >> .env
            echo "APP_UPDATE_URL=https://amongush.duckdns.org/updates/\${ZIP_NAME}" >> .env
            echo "VITE_APP_VERSION=\${SHORT_SHA}" >> .env

            # Install dependencies and build
            npm install
            npm run build

            # Zip the dist/ output (frontend assets only)
            cd dist
            # Exclude server backend files during zip to keep OTA lightweight, without deleting them from disk!
            zip -r $ZIP_NAME * -x "server.cjs" -x "server.cjs.map" -x "app-debug.apk"

            # Copy to Nginx updates directory
            mkdir -p /var/www/html/updates/
            cp $ZIP_NAME /var/www/html/updates/

            # Go back to project root
            cd ..

            # Restart the PM2 process
            /root/.nvm/versions/node/v24.18.1/bin/pm2 restart cricket-server --update-env`;

if (code.includes('npm install')) {
  code = code.replace(oldDeployCode, newDeployCode);
  fs.writeFileSync('.github/workflows/deploy-vps.yml', code);
  console.log('Fixed deploy-vps.yml');
} else {
  console.log('Could not find target code');
}
