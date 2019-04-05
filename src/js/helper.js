import app from './app';

var helper = {

  is_app: null,

  getYoutubeId: (url) => {
    url = url.split('/embed/')[1];
    url = url.split('?')[0];

    return url;
  },

  getYoutubeImageMedium: (url) => {
    return 'https://img.youtube.com/vi/' + helper.getYoutubeId(url) + '/default.jpg'
  },

  getYoutubeImageSmall: (url) => {
    return 'https://img.youtube.com/vi/' + helper.getYoutubeId(url) + '/mqdefault.jpg'
  },

  getYoutubeImageHQ: (url) => {
    return 'https://img.youtube.com/vi/' + helper.getYoutubeId(url) + '/hqdefault.jpg';
  },

  getYoutubeImageMax: (url) => {
    return 'https://img.youtube.com/vi/' + helper.getYoutubeId(url) + '/maxresdefault.jpg';
  },
  screenWidth: () => {
    return $(window).width();
  },
  isApp: () => {
    return true;
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
