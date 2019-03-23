import $$ from './dom';
import app from './app';
import ImgCache from './imgcache';

var helper = {

  is_app: null,

  getYoutubeId: (url) => {
    url = url.split('/embed/')[1];
    url = url.split('?')[0];

    return url;
  },

  getYoutubeImageMedium: (url) => {
    return 'http://img.youtube.com/vi/' + helper.getYoutubeId(url) + '/default.jpg'
  },

  getYoutubeImageSmall: (url) => {
    return 'http://img.youtube.com/vi/' + helper.getYoutubeId(url) + '/mqdefault.jpg'
  },

  getYoutubeImageHQ: (url) => {
    return 'http://img.youtube.com/vi/' + helper.getYoutubeId(url) + '/hqdefault.jpg';
  },

  getYoutubeImageMax: (url) => {
    return 'http://img.youtube.com/vi/' + helper.getYoutubeId(url) + '/maxresdefault.jpg';
  },
  screenWidth: () => {
    return $$(window).width();
  },
  isApp: () => {
    return app.is_app;
  },
  isPopupOpen: () => {
    if(app.popup === false) {
      return false;
    }
    return true;
  },
  cachedImage: (url, callback) => {
    callback(url);
  }
};

export default helper;
