#!/bin/bash
#npm run build-dev
./scripts/prod.sh
#./scripts/dev.sh
rm -rf ./cordova/www
cp -r ./dist ./cordova/www
cd cordova
cordova run android --device
