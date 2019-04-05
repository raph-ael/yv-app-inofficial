let splashloader = {
    $loader: null,
    $messages: null,
    progress: null,
    last_progress: null,
    init: () => {

        splashloader.last_progress = 0;

        splashloader.$loader = $('#splash-loader');
        splashloader.$messages = $('#splash-loader-messages');
        splashloader.$progress = $('#splash-loader-progress');
        /*
        splashloader.progress = phonon.progress({
            element: splashloader.$progress[0],
            height: 14,
            min: 0,
            max: 100,
            label: false,
            striped: true,
            background: null,
        });
        */
    },

    setValue: (value) => {
        splashloader.$progress.css('width',value+'%');
    },

    setProgress: (current, total) => {

        let percent = (Math.round(100 * current / total));
        if(percent > (splashloader.last_progress+4)) {
            splashloader.setValue(percent);
            splashloader.last_progress = percent;
        }
        else if(percent > 98) {
            splashloader.setValue(100);
            splashloader.last_progress = 100;
        }
    },

    setMessage: (message) => {
        splashloader.$messages.text(message);
    },

    show: () => {
        splashloader.$loader.show();
    },

    hide: () => {
        splashloader.$loader.hide();
    }


};

export default splashloader;