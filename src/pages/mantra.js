import app from '../js/app';
import api from '../js/api';
import helper from '../js/helper';
import template from '../_compiled/templates/item-mantra';
import tpl_audio from '../_compiled/templates/mantra-audio';
import loader from '../js/loader';

var mantra = {
    $title: null,
    $desc: null,
    $audio: null,

    init_once: () => {
        if(!mantra.initiated) {
            app.$content_mantra.html(template());
            mantra.initiated = true;

            mantra.$desc = $('#mantra-content-desc');
            mantra.$title = $('#mantra-content-title');
            mantra.$audio = $('#mantra-audio');

        }
    },

    hide: () => {
        mantra.$audio.empty();
    },

    show: (params) => {

        loader.start();

        mantra.init_once();

        api.getMantraItem(params.id,{
            cached: true,
            success: (item) => {
                mantra.$title.text(item.content.subTitle);
                mantra.$desc.html(item.content.body);
                mantra.$audio.html(tpl_audio(item));
                console.log(item);
            },
            complete: () => {
                setTimeout(() => {
                    loader.stop();
                },150);
            }
        });
    },

    placeContent: (item) => {



    }
};

export default mantra;