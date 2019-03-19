import $$ from './dom';
import app from './app';

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
  }
};

export default helper;
