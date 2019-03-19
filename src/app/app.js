import Framework7 from 'framework7/framework7.esm.bundle.js';
import routes from './routes.js';
import $$ from './dom';
import helper from './helper';

let app = {
  fw7: null,
  is_app: false,
  popup: false,
  route: {},
  router: {},
  init: () => {

    app.initFramework7();

    if (document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1) {
      app.is_app = true;
    }

    document.addEventListener('deviceready', () => {

      app.initBackKey();
      app.initStatusbar();

    }, false);
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
  }

};


export default app;
