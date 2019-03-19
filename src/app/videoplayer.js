import helper from './helper';

var videoplayer = {

  play: (path, options) => {
    if(helper.isApp()) {
      videoplayer.play_app(path, options);
    }
    else {
      videoplayer.play_desktop(path, options);
    }
  },
  close: () => {
    if(helper.isApp()) {
      VideoPlayer.close();
    }
    else {
      alert('todo desktop player close...');
    }
  },

  play_app: (path, options) => {

    let settings = videoplayer.prepareOptions(options);

    VideoPlayer.play(path, options, options.complete, options.error);
  },
  play_desktop: (path, options) => {
    alert('play ' + path);
  },
  prepareOptions: (options) => {
    if(options === undefined) {
      options = {};
    }

    if(options.complete === undefined) {
      options.complete = () => {};
    }

    if(options.error === undefined) {
      options.error = () => {
        alert('Beim abspielen des Videos ist ein Fehler aufgetreten');
      };
    }

    return options;
  }

};

export default videoplayer;
