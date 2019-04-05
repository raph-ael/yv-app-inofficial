import storage from './storage';
import helper from './helper';
import ImgCache from './imgcache';
import app from './app';

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

  getMeditation: (options) => {
    api.get('/wallitem?type=meditation', options);
  },

  getPranayama: (options) => {
    api.get('/wallitem?type=pranayama', options);
  },

  getAsana: (options) => {
    api.get('/wallitem?order_by=title&type=asana_lexikon', options);
  },

  getMantra: (options) => {
    api.get('/wallitem?type=mantras', options);
  },

  getMantraItem: (id, options) => {
    api.get('/wallitem/' + id, options);
  },

  getAsanaItem: (id, options) => {
    api.get('/wallitem/' + id, options);
  },

  getItem: (id, options) => {

    options.success_xhr_only = (item, success) => {

      item.youtube_id = helper.getYoutubeId(item.content.video_youtube.url);
      item.thumbnail_sm = helper.getYoutubeImageSmall(item.content.video_youtube.url);
      item.thumbnail_xl = helper.getYoutubeImageMax(item.content.video_youtube.url);

      if(options.cacheImage === undefined) {
          options.cacheImage = true;
      }

      if(options.cacheImage && app.has_image_cache && app.isApp()) {
        ImgCache.get(item.thumbnail_sm, (local_path, status) => {
          item.thumbnail_sm = local_path;
          if(status === -1) {
            item.thumbnail_sm = 'img/thumb_placeholder_sm.jpg';
          }
          ImgCache.get(item.thumbnail_xl, (local_path, status) => {
            item.thumbnail_xl = local_path;
            if(status === -1) {
              item.thumbnail_xl = 'img/thumb_placeholder_xl.jpg';
            }
            success(item);
          });
        });
      }
      else {
        success(item);
      }
    };

    api.get('/wallitem/' + id, options);
  },

  getAll: (options) => {
    api.get('/wallitem', options);
  },

  isCached: (uri, type) => {
    if(type === undefined) {
      type = 'GET';
    }
    let key = 'uri:'+type.toUpperCase()+':'+uri;
    if(api.cache[key] === undefined) {

      let stored = storage.get(key);
      if(!stored || stored === undefined) {
        return false;
      }
    }
    return true;
  },

  get: (uri, options) => {

    let settings = api.requestOptions(options, uri, 'GET');

    if((settings.cached && api.cache[settings.key] !== undefined) && !settings.refresh) {
      settings.success(api.cache[settings.key]);
      settings.complete();
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
          settings.complete();
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

      if(settings.success_xhr_only !== undefined) {
        let suc = settings.success;
        let suc_xhr = settings.success_xhr_only;

        settings.success = (response) => {
          suc_xhr(response, suc);
        }
      }


      if(settings.timeout !== undefined) {
        setTimeout(() => {
          $.ajax(settings);
        }, settings.timeout);
      }
      else {
        $.ajax(settings);
      }
    }
  },

  requestOptions: (options, uri, type) => {

    let key = 'uri:'+type+':'+uri;
    if(options === undefined) {
      options = {
        success: () => {},
        complete: () => {}
      };
    }
    else {
      if(options.success === undefined) {
        options.success = () => {};
      }
      if(options.complete === undefined) {
        options.complete = () => {};
      }
    }

    options.key = key;
    options.method = type.toUpperCase();
    options.url = api.base_url + uri;
    options.dataType = 'json';

    return options;
  }
};

export default api;
