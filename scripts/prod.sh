echo "compile templates"
node ./scripts/tpl-process.js

echo "erstelle js app bundle"
npm run prod

echo "kopiere statische files"
cp -r ./src/static/* ./dist/
