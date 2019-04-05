import app from '../js/app';
import api from '../js/api';
import helper from '../js/helper';
import Downloader from '../js/downloader';
import template from '../_compiled/templates/item-yoga';
import loader from '../js/loader';

var yoga = {
    $video_preview: null,
    $download_button: null,
    $delete_button: null,
    $progressbar: null,
    $video_local: null,
    $video_player: null,
    youtube_player: null,
    downloader: null,
    initiated: false,
    download_status: null,
    download_file: null,

    init_once: () => {
        if(!yoga.initiated) {
            app.$content_yoga.html(template());
            yoga.$video_preview = app.$content_yoga.find('.video-preview');
            yoga.$download_button = $('#yoga-download-start');
            yoga.$delete_button = $('#yoga-download-delete');
            yoga.$progressbar = $('#yoga-download-progress');
            yoga.$video_player = $('#yoga-video-player');
            yoga.$content_title = $('#yoga-content-title');
            yoga.$content_time = $('#yoga-content-time');
            yoga.$content_speaker = $('#yoga-content-speaker');
            yoga.$content_desc = $('#yoga-content-desc');
            yoga.$content_desc_full = $('#yoga-content-desc-full');
            yoga.initiated = true;
            yoga.initProgressbar();

            yoga.setImageHeight();

            $(window).resize(() => {
                yoga.setImageHeight();
            });
        }
    },

    hide: () => {
        console.log('HIDE!!!');
        yoga.resetPlayer();

    },

    resetLocalPlayer: () => {
        if(yoga.$video_local) {
            yoga.$video_local.remove();

        }
        yoga.$video_player.html('');
        yoga.$video_local = null;
    },

    resetPlayer: () => {
        yoga.removeYoutubePlayer();
        yoga.resetLocalPlayer();
        yoga.$video_preview.css({
            'position': 'inherit',
            'top': 'auto',
            'margin-bottom': '0'
        });
        yoga.$video_preview.show();
        yoga.$video_player.hide();
    },

    removeYoutubePlayer: () => {

        if(yoga.youtube_player && yoga.youtube_player.stopVideo) {
            yoga.youtube_player.stopVideo();
            yoga.youtube_player.destroy();
            delete yoga.youtube_player;
        }
        yoga.youtube_player = null;
        yoga.$video_player.innerHTML = '';
        yoga.$video_player.hide();
        app.$content_yoga.find('iframe').remove();

        if($('#yoga-video-player').length === 0) {
            yoga.$video_player = $('<div id="yoga-video-player"></div>');
            app.$content_yoga.prepend(yoga.$video_player);
        }
    },

    show: (params) => {

        loader.start();

        yoga.init_once();

        api.getItem(params.id,{
            cached: true,
            success: (item) => {
                yoga.$video_preview.css('background-image','url(' + item.thumbnail_xl + ')');
                yoga.$video_preview.unbind('click').click(() => {
                    yoga.loadVideo(item)
                });
                if(app.isApp()){
                    yoga.initDownloader(item);
                }
                else {
                    yoga.$delete_button.hide();
                    yoga.$download_button.show();
                }

                yoga.placeContent(item);
            },
            complete: () => {
                setTimeout(() => {
                    loader.stop();
                },300);
            }
        });
    },

    setImageHeight: () => {

        let height = Math.round((helper.screenWidth()/16)*9);

        yoga.$video_preview.css('height', height+'px');

        let $iframe = app.$content_yoga.find('iframe');
        if($iframe.length > 0) {
            $iframe.css({
                'width': '100%',
                'height': (height-6) + 'px'
            });
            $iframe.attr('height', (height-6)).attr('width','100%');
        }

        if(yoga.$video_local) {
            yoga.$video_local.attr('height', height);
        }
    },

    loadVideo: (item) => {

        yoga.$video_preview.addClass('loading');

        if(yoga.downloader) {
            yoga.downloader.getStatus((status, file) => {

                if(status === 1) {
                    yoga.loadVideoLocal(item, file);
                }
                else {
                    yoga.loadVideoYoutube(item);
                }

            });
        }
        else {
            yoga.loadVideoYoutube(item);
        }
    },

    loadVideoLocal: (item, file) => {

        yoga.$video_local = $(`<video height="1" width="100%" preload="metadata" controls autoplay>
        <source src="` + file.nativeURL + `" type="video/mp4">
        Auf Deinem Gerät können Keine Videos abgespielt werden.
      </video>`);


        yoga.$video_player.append(yoga.$video_local);
        yoga.setImageHeight();
        yoga.$video_preview.hide();
        yoga.$video_player.show();
        $(window).unbind('resize');
        yoga.$video_preview.removeClass('loading');

    },

    loadVideoYoutube:(item) => {

        yoga.fallbackYoutubePlayer(item);
        /*
        YoutubeVideoPlayer.openVideo(item.youtube_id, (result) => {
            if(result == 'error') {

            }
        });
        */
    },

    fallbackYoutubePlayer:(item) => {

        $(window).unbind('resize');
        yoga.removeYoutubePlayer();

        app.youtubeScript(() => {
            yoga.$video_player.show();
            //$$('#yoga-video-starter').parent().prepend('<iframe id="youtube-player" width="100%" height="320" style="margin:0;padding:0;width:100%;height:320px" src="https://www.youtube.com/embed/' + item.youtube_id + '?&theme=dark&autohide=1&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3" frameborder="0" allowfullscreen></iframe>');


            let height = Math.round((helper.screenWidth()/16)*9);

            yoga.youtube_player = new YT.Player('yoga-video-player', {
                height: (height-6),
                width: '100%',
                videoId: item.youtube_id,
                events: {
                    'onReady': function(event) {
                        event.target.playVideo();
                        setTimeout(() => {
                            yoga.$video_preview.css({
                                'position': 'inherit',
                                'top': 'auto',
                                'margin-bottom': '0'
                            });
                            yoga.$video_preview.hide();
                            yoga.$video_preview.removeClass('loading');
                            //setImageHeight();
                        },3000);
                    }
                }
            });

            yoga.$video_preview.css({
                'position': 'relative',
                'top': '-' + (height+1) + 'px',
                'margin-bottom': '-' + height + 'px'
            });
        });
    },

    initProgressbar: () => {
        yoga.progressbar = phonon.progress({
            element: '#yoga-download-progress',
            height: 14,
            min: 0,
            max: 100,
            label: false,
            striped: false,
            background: null,
        });
    },

    initDownloader: (item) => {
        let filename = item.content.offline_video.url.split('/').slice(-1)[0];

        yoga.downloader = new Downloader(item.content.offline_video.url, {
            filename: filename,
            folder: 'item-' + item.id,
            title: item.title,
            success: (ret) => {
                yoga.updateDownloadStatus();
            },
            error: (ret) => {
                yoga.updateDownloadStatus();
            },
            progress: (progress) => {
                yoga.progressbar.set(Math.round(100 * progress.bytesReceived / progress.totalBytesToReceive));
            }
        });

        yoga.updateDownloadStatus();

        yoga.$download_button.unbind('click').click(() => {
            yoga.downloader.start();
            yoga.$progressbar.show();
            yoga.$delete_button.hide();
            yoga.$download_button.hide();
        });

        yoga.$delete_button.unbind('click').click(() => {
            yoga.downloader.delete(() => {
                yoga.updateDownloadStatus();
                yoga.$video_preview.show();
                if(yoga.$video_local) {
                    yoga.$video_local.remove();
                }
            });
        });
    },

    updateDownloadStatus: () => {
        yoga.downloader.getStatus((status, file) => {

            yoga.download_status = status;
            yoga.download_file = file;
            if(status === 1) {
                yoga.$progressbar.hide();
                yoga.$download_button.hide();
                yoga.$delete_button.show();
            }
            else if(status === 2) {
                yoga.$progressbar.show();
                yoga.$delete_button.hide();
                yoga.$download_button.hide();
            }
            else {
                yoga.$progressbar.hide();
                yoga.$download_button.show();
                yoga.$delete_button.hide();
            }

        });
    },

    placeContent: (item) => {

        yoga.$content_desc_full.hide();
        yoga.$content_desc.show();

        let $modal_opener = $('<a href="#">weiterlesen</a>');
        $modal_opener.click((ev) => {
            ev.preventDefault();
            yoga.$content_desc_full.show();
            yoga.$content_desc.hide();
        });
        let $modal_closer = $('<a href="#">...weniger</a>');
        $modal_closer.click((ev) => {
            ev.preventDefault();
            yoga.$content_desc_full.hide();
            yoga.$content_desc.show();
        });

        let $content_full = $('<div>' + item.content.body + '</div>');
        $content_full.find('p').each(function() {
            var $this = $(this);
            if ($this.text().trim() == '') {
                $this.remove();
            }
        });
        let $modal_closer_wrap =$('<p></p>');
        $modal_closer_wrap.append($modal_closer);
        $content_full.append($modal_closer_wrap);

        yoga.$content_desc_full.empty().append($content_full);

        let $text = $('<p></p>');
        $text.text(item.content.short_body + '  ').append($modal_opener);

        yoga.$content_desc.empty().append($text);
        yoga.$content_title.text(item.title);
        yoga.$content_speaker.text(item.speaker);
        yoga.$content_time.text(item.duration + ' min');
    }
};

export default yoga;