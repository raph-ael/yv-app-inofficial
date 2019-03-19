import Framework7 from 'framework7/framework7.esm.bundle.js';
import loader from './loader';

const api = {
  base_url: 'http://app.yoga-vidya.de/api/de',
  options: {},
  cache: {},
  app: null,

  init: (options) => {
    api.options = options;
  },

  getYoga: (options) => {
    api.get('/wallitem?type=yoga', options);
  },

  getItem: (id, options) => {
    api.get('/wallitem/' + id, options);
  },

  getAll: (options) => {
    api.get('/wallitem', options);
  },

  get: (uri, options) => {

    let settings = api.requestOptions(options, uri, 'GET');

    if(settings.cached && api.cache[settings.key] !== undefined) {
      settings.success(api.cache[settings.key]);
      if(settings.loader) {
        loader.stop();
      }
    }
    else {
      if(settings.cached) {

        let suc = settings.success;
        settings.success = (response) => {
          suc(response);
          api.cache[settings.key] = response;
        };
      }

      if(settings.loader) {
        let suc = settings.success;
        settings.success = (response) => {
          suc(response);
          loader.stop();
        };
      }

      Framework7.request(settings);
    }
  },

  requestOptions: (options, uri, type) => {

    let key = 'uri:'+type+':'+uri;
    if(options === undefined) {
      options = {
        success: () => {},
        complete: () => {},
        loader: false,
      };
    }
    else {
      if(options.loader === undefined) {
        options.loader = false;
      }
    }

    options.key = key;
    options.method = type.toUpperCase();
    options.url = api.base_url + uri;
    options.dataType = 'json';

    if(options.loader ) {
      loader.start();
    }

    return options;
  }
};

export default api;
