import app from '../js/app';
import api from '../js/api';
import helper from '../js/helper';
import template from '../_compiled/templates/item-asana';
import loader from '../js/loader';

var asana = {

    initiated: false,

    init_once: () => {
        if(!asana.initiated) {

            asana.initiated = true;
        }
    },

    hide: () => {

    },

    show: (params) => {

        loader.start();

        asana.init_once();

        api.getAsanaItem(params.id,{
            cached: true,
            success: (item) => {
                console.log(item);
                asana.placeContent(item);
            },
            complete: () => {
                setTimeout(() => {
                    loader.stop();
                },400);
            }
        });
    },

    placeContent: (item) => {
        app.$content_asana.html(template(item));
        var mySwiper = new Swiper('.swiper-containerl', {
            pagination: {
                el: '.swiper-pagination',
            },
        });
    }
};

export default asana;