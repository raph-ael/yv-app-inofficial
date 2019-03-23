import Framework7 from 'framework7/framework7.esm.bundle.js';
import loader from './loader';
import storage from './storage';
import helper from './helper';
import ImgCache from './imgcache';

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

    var suc = () => {};
    if(options.success !== undefined) {
      suc = options.success;
    }
    options.success = (item) => {

      item.youtube_id = helper.getYoutubeId(item.content.video_youtube.url);

      ImgCache.get(helper.getYoutubeImageSmall(item.content.video_youtube.url), (image_url_sm) => {
        item.thumbnail_sm = image_url_sm;
        ImgCache.get(helper.getYoutubeImageMax(item.content.video_youtube.url), (image_url_xl) => {
          item.thumbnail_xl = image_url_xl;
          suc(item);
        });
      });
    };

    api.get('/wallitem/' + id, options);
  },

  getAll: (options) => {
    api.get('/wallitem', options);
  },

  get: (uri, options) => {

    let settings = api.requestOptions(options, uri, 'GET');

    if((settings.cached && api.cache[settings.key] !== undefined) && !settings.refresh) {
      settings.success(api.cache[settings.key]);
      if(settings.loader) {
        loader.stop();
      }
    }
    else {

      var call_endpoint = true;

      if(settings.cached) {

        var response = false;
        if(!settings.refresh) {
          response = storage.get(settings.key);
        }

        if(response) {
          settings.success(response);
          if(settings.loader) {
            loader.stop();
          }
          return;
        }
        else {
          let suc = settings.success;
          settings.success = (response) => {
            suc(response);
            api.cache[settings.key] = response;
            storage.set(settings.key, response);
          };
        }
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
      if(options.success === undefined) {
        options.success = () => {};
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
