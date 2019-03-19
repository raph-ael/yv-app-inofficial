#/bin/bash
npm run build-prod
rm -rf ./cordova/www
cp -r ./www ./cordova/
cd cordova
cordova build android
