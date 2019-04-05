import de from '../i18n/de';
import en from '../i18n/en';

import routes from './routes';
import loader from './loader';

import ImgCache from './imgcache';
import api from './api';

import listYoga from '../pages/list-yoga';
import listMediation from '../pages/list-meditation';
import listPranayama from '../pages/list-pranayama';
import listMantras from '../pages/list-mantra';
import listAsana from '../pages/list-asana';

import splashloader from './splash-loader';

let app = {

    pager: null,

    loaded_scripts: [],
    youtube_api_ready: false,
    youtube_api_ready_callbacks: [],
    directory_data: null,
    has_image_cache: null,
    go_online_events: [],
    go_offline_events: [],
    $body: null,
    $content_list_yoga: null,
    $content_list_meditation: null,
    $content_list_mantra: null,
    $content_list_pranayama: null,
    $content_list_asana: null,
    $content_yoga: null,
    $content_asana: null,
    $content_mantra: null,
    $sidebar_left: null,
    offcanvas_left: null,

    init: () => {
        loader.init();
        app.initPhonon();
        app.initFastClicks();
        app.initYTApi();
        app.initOffCanvas();
        app.initDom();

        document.addEventListener('deviceready', () => {

            app.directory_data = cordova.file.externalDataDirectory;
            app.initImgCache();
            app.initOnlineOfflineHandling();
            app.initBackButton();
            if(app.isOnline()) {
                app.initApiCache(() => {
                    splashloader.setMessage('lade Yoga Stunden...');
                    listYoga.init(() => {
                        splashloader.setMessage('lade Meditationen...');
                        listMediation.init(() => {
                            splashloader.setMessage('lade Pranayama...');
                            listPranayama.init(() => {
                                splashloader.setMessage('lade Mantras...');
                                listMantras.init(() => {
                                    splashloader.setMessage('lade Asana Lexikon...');
                                    listAsana.init(() => {
                                        setTimeout(() => {
                                            splashloader.hide();
                                        },300);
                                    });
                                });
                            });
                        });
                    });
                });
            }
            else {
                navigator.splashscreen.hide();
            }

        }, false);
    },

    initDom: () => {
        app.$body = $('body');
        app.$content_list_yoga = $('#content-list-yoga');
        app.$content_list_meditation = $('#content-list-meditation');
        app.$content_list_mantra = $('#content-list-mantra');
        app.$content_list_pranayama = $('#content-list-pranayama');
        app.$content_list_asana = $('#content-list-asana');
        app.$content_yoga = $('#content-yoga');
        app.$content_asana = $('#content-asana');
        app.$content_mantra = $('#content-mantra');
        app.$sidebar_left = $('#leftOffCanvas');
    },

    initRoutes: () => {

        for (let route in routes) {
            if (routes.hasOwnProperty(route)) {
                app.pager.getPage(route).addEvents(routes[route]);
            }
        }
    },

    initPhonon: () => {

        /*
         * init Pager
         */
        app.pager = phonon.pager({
            hashPrefix: '#!',
            useHash: true,
            defaultPage: 'start',
            animatePages: false,
        });

        /*
         * init internationalisation
         */
        phonon.i18n({
            fallbackLocale: 'de',
            locale: 'de',
            bind: true,
            data: {
                de: de,
                en: en
            },
        });

        app.initRoutes();

        /*
         * run phonon
         */
        app.pager.start();

    },

    page: () => {
        return $('.app-page.current');
    },

    content: () => {
        return $('.app-page.current > .app-content');
    },

    navbar: () => {
        return $('.app-page.current > .navbar');
    },

    initFastClicks: () => {
        $(() => {
            FastClick.attach(document.body);
        });
    },

    loadScript: (url) => {

        if(app.loaded_scripts.indexOf(url) == -1) {
            var tag = document.createElement('script');
            tag.src = url;
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            app.loaded_scripts.push(url);
        }
    },

    initYTApi: () => {
        window.onYouTubeIframeAPIReady = function () {
            app.youtube_api_ready = true;
            app.youtube_api_ready_callbacks.forEach(function(cb){
                cb();
            });
            app.youtube_api_ready_callbacks = [];
        }
    },

    youtubeScript: (callback) => {
        app.loadScript('https://www.youtube.com/iframe_api');
        if(app.youtube_api_ready) {
            callback();
        }
        else {
            app.youtube_api_ready_callbacks.push(callback);
        }
    },

    initImgCache: () => {

        // increase allocated space on Chrome to 50MB, default was 10MB
        ImgCache.options.chromeQuota = 50*1024*1024;
        //ImgCache.options.cordovaFilesystemRoot = cordova.file.cacheDirectory;
        ImgCache.options.cordovaFilesystemRoot = cordova.file.externalDataDirectory;

        ImgCache.init( () => {
            console.log('ImgCache init: success!');
            app.has_image_cache = true;

        }, () => {
            console.error('ImgCache init: error! Check the log for errors');
            app.has_image_cache = false;
        });
    },

    initOnlineOfflineHandling: () => {

        app.addGoOfflineEvent(() => {
            app.$body.removeClass('is-online').addClass('is-offline');
        });

        app.addGoOnlineEvent(() => {
            app.$body.addClass('is-online').removeClass('is-offline');
        });

        if(app.isOnline()) {
            app.setAppOnline();
        }
        else {
            app.setAppOffline();
        }

    },

    isCached: () => {
        if(api.isCached('/wallitem/140')) {
            return true;
        }
        return false;
    },

    isOnline: () => {

        console.log(navigator.connection.type);

        if([Connection.CELL_2G, Connection.NONE].indexOf(navigator.connection.type) === -1) {
            return true;
        }

        return false;

        /*
         * Connection.UNKNOWN
            Connection.ETHERNET
            Connection.WIFI
            Connection.CELL_2G
            Connection.CELL_3G
            Connection.CELL_4G
            Connection.CELL
            Connection.NONE
         */

    },

    addGoOfflineEvent: (callback) => {
        app.go_offline_events.push(callback);
    },

    addGoOnlineEvent: (callback) => {
        app.go_online_events.push(callback);
    },

    setAppOnline: () => {
        app.go_online_events.forEach((callback) => {
            callback();
        });
    },
    setAppOffline: () => {
        app.go_offline_events.forEach((callback) => {
            callback();
        });
    },

    initApiCache: (callback) => {

        let item_success_count = 0;

        api.getYoga({
            cached: true,
            refresh:true,
            success: (yogas) => {

                api.getMeditation({
                    cached: true,
                    refresh:true,
                    success: (meditations) => {
                        api.getPranayama({
                            success: (pranayamas) => {

                                let sleep_between = 30;
                                let sleep_ms = 0;
                                let items = yogas.concat(meditations, pranayamas);

                                if(app.isCached()) {
                                    sleep_between = 0;
                                }

                                splashloader.init();
                                splashloader.show();
                                splashloader.setMessage('synchronisiere Datenbank...');

                                items.forEach((item) => {

                                    if(sleep_between === 0) {
                                        api.getItem(item.id,{
                                            cached: true,
                                            timeout: sleep_ms,
                                            complete: () => {

                                                if(item_success_count===1) {
                                                    setTimeout(() => {
                                                        navigator.splashscreen.hide();
                                                    },500);
                                                }

                                                item_success_count++;

                                                splashloader.setProgress(item_success_count, items.length);

                                                if(item_success_count >= items.length) {
                                                    callback(item_success_count);
                                                }
                                            }
                                        });
                                    }
                                    else {
                                        sleep_ms = sleep_ms + sleep_between;

                                        setTimeout(() => {
                                            api.getItem(item.id,{
                                                cached: true,
                                                timeout: sleep_ms,
                                                complete: () => {

                                                    if(item_success_count===1) {
                                                        navigator.splashscreen.hide();
                                                    }

                                                    item_success_count++;

                                                    splashloader.setProgress(item_success_count, items.length);

                                                    if(item_success_count >= items.length) {
                                                        callback(item_success_count);
                                                    }
                                                }
                                            });
                                        }, sleep_ms);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    },

    initOffCanvas: () => {
        app.offcanvas_left = phonon.offCanvas({
            element: '#leftOffCanvas',
            container: document.body,
            toggle: false,
            aside: {
                md: false,
                lg: false,
                xl: false,
            },
        });
    },

    initBackButton: () => {
        document.addEventListener("backbutton", () => {

            if(app.$sidebar_left.hasClass('show')) {
                app.offcanvas_left.hide();
                return false;
            }
            else {
                window.history.back();
            }

        }, false);
    },

    isApp: () => {
        var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
        if ( app ) {
            // PhoneGap application
            return true;
        } else {
            // Web page
            return false;
        }
    }
};

export default app;