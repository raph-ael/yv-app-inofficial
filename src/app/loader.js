import app from './app';

var loader = {
  start: (options) => {
    app.fw7.preloader.show();
  },

  stop: () => {
    app.fw7.preloader.hide();
  }
}

export default loader;
