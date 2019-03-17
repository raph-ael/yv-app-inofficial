import Framework7 from 'framework7/framework7.esm.bundle.js';
import storage from './storage';

const api = {
  base_url: 'http://app.yoga-vidya.de/api/de',
  app: null,

  getYoga: (options) => {
    console.log('getyoga');
    api.get('/wallitem?type=yoga', options);
  },

  getAll: (options) => {
    console.log('get all');
    api.get('/wallitem', options);
  },

  get: (uri, options) => {

    let settings = api.requestOptions(options, uri, 'GET');

    api.app.preloader.show();
    Framework7.request(settings);
  },

  requestOptions: (options, uri, type) => {

    let key = 'uri:'+type+':'+uri;

    api.app.preloader.hide();

    if(options === undefined) {
      options = {};
    }

    options.key = key;
    options.method = type.toUpperCase();
    options.url = api.base_url + uri;
    options.dataType = 'json';
    options.complete = () => {
      api.app.preloader.hide();
    };

    let suc = () =>{};

    return options;
  },
  isCached: (options) => {
    let data = storage.get(options.key);
    if(data) {
      true;
    }
  }
};

export default api;
