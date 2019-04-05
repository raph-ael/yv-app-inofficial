import app from './app';
var loader = {

  $el: null,

  init: () => {
    loader.$el = $('<div style="display: none;" class="app-page-loader"><div><span class="lds-ring"><span></span><span></span><span></span><span></span></span></div></div>');
    $(document.body).append(loader.$el);
  },

  start: (options) => {
    app.content().hide();
    loader.$el.show();
  },

  stop: () => {
    app.content().show();
    loader.$el.hide();
  }
}

export default loader;
