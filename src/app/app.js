import Framework7 from 'framework7/framework7.esm.bundle.js';
import routes from './routes.js';
import $$ from './dom';
import helper from './helper';
import ImgCache from './imgcache';
import api from './api';
import Downloader from "./downloader";

let app = {
  fw7: null,
  is_app: false,
  popup: false,
  route: {},
  router: {},
  loaded_scripts: [],
  youtube_api_ready: false,
  youtube_api_ready_callbacks: [],
  directory_data: null,
  init: () => {

    if (document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1) {
      app.is_app = true;
    }

    app.initFramework7();
    app.initYTApi();
    app.preCacheUrls();

    document.addEventListener('deviceready', () => {

      app.directory_data = cordova.file.externalDataDirectory;

      app.initBackKey();
      app.initStatusbar();
      app.initImgCache();

    }, false);
  },

  initImgCache: () => {

    // increase allocated space on Chrome to 50MB, default was 10MB
    ImgCache.options.chromeQuota = 50*1024*1024;
    //ImgCache.options.cordovaFilesystemRoot = cordova.file.cacheDirectory;
    ImgCache.options.cordovaFilesystemRoot = cordova.file.externalDataDirectory;

    ImgCache.init(function () {
      console.log('ImgCache init: success!');

    }, function () {
      console.error('ImgCache init: error! Check the log for errors');
    });
  },

  initYTApi: () => {
    window.onYouTubeIframeAPIReady = function () {
      app.youtube_api_ready = true;
      app.youtube_api_ready_callbacks.forEach(function(cb){
        cb();
      });
      app.youtube_api_ready_callbacks = [];
    }
  },

  youtubeScript: (callback) => {
    app.loadScript('https://www.youtube.com/iframe_api');
    if(app.youtube_api_ready) {
      callback();
    }
    else {
      app.youtube_api_ready_callbacks.push(callback);
    }
  },

  initFramework7: () => {
    app.fw7 = new Framework7({
      root: '#app',
      id: 'de.yogavidya.app', // App bundle ID
      name: 'YogaVidya', // App name
      theme: 'auto', // Automatic theme detection
      // App routes
      routes: routes,
      fastClicks: true,
      view: {
        animate: false
      },
      panel: {
        swipe: 'left'
      },
      popup: {
        closeByBackdropClick: false,
      },
      pushState: true,
      on: {
        // each object key means same name event handler
        pageInit: function (page) {
          app.page = page;
          app.route = page.route;
          app.router = page.router;
        },
        popupOpen: function (popup) {
          app.popup = popup;
        },
        popupClose: function () {
          app.popup = false;
        },
      },
    });
  },

  initBackKey: () => {

    document.addEventListener('backbutton', () => {

      console.log(app.route.path);

      if (($$('.panel').hasClass('panel-active'))) {
        app.fw7.panel.close();
        return false;
      }
      else if (helper.isPopupOpen()) {
        app.popup.close();
        return false;
      }
      else if (app.route.path == '/') {
        navigator.app.exitApp();
      }
      else {
        app.router.back();
        return false;
      }
    }, false);
  },

  initStatusbar: () => {
    //StatusBar.backgroundColorByHexString('#FFFFFF');
  },

  loadScript: (url) => {

    if(app.loaded_scripts.indexOf(url) == -1) {
      var tag = document.createElement('script');
      tag.src = url;
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      app.loaded_scripts.push(url);
    }
  },

  preCacheUrls: () => {
    api.getYoga({
      cached: true,
      refresh: true,
      success: (items) => {

        Downloader.getAllVideos(() => {

        });

        items.slice(0,10).forEach((item) => {
          api.getItem(item.id,{
            cached: true
          });
        });
      }
    });
  }
};


export default app;
