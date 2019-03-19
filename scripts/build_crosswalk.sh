#!/bin/bash
npm run build-prod
cordova platform remove android
cordova plugin add cordova-plugin-crosswalk-webview
cordova clean
cordova platform add android
cordova build android -- --minSdkVersion=19
