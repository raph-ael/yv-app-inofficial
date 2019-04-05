import api from '../js/api';
import yogalist from '../_compiled/templates/list-yoga';
import app from '../js/app';
import loader from '../js/loader';


let page = {

    //observer: null,
    list_items: null,
    initiated: null,

    init: (callback) => {

        setTimeout(() => {
            api.getMeditation({
                cached: true,
                success: (items) => {

                    app.$content_list_meditation.html(yogalist({
                        items:items
                    }));

                    var complete_items = 0;

                    page.list_items = document.querySelectorAll('#content-list-meditation .itemlist-media');
                    page.list_items.forEach((image) => {
                        api.getItem(image.dataset.id,{
                            cached: true,
                            success: (item) => {
                                image.dataset.loaded = true;
                                image.setAttribute('style','background-image:url(' + item.thumbnail_sm + ')');
                            },
                            complete: () => {
                                complete_items++;
                                if(complete_items >= page.list_items.length) {
                                    if(callback !== undefined) {
                                        callback();
                                    }
                                }
                            }
                        });
                    });

                    /*

                    setTimeout(() => {

                        page.list_items = document.querySelectorAll('.itemlist-media');
                            page.list_items.forEach((image) => {
                                page.observer.observe(image);
                            });

                    },500);

                    */

                    page.initiated = true;


                },
                error: () => {
                    loader.stop();
                }
            });
        },300);
    },

    hide: () => {
        /*
        if(page.list_items) {
            page.list_items.forEach((image) => {
                page.observer.unobserve(image);
            });

            delete page.observer;
            delete page.list_items;
        }
        */
    },

    show: () => {

        loader.start();
        if(!page.initiated) {
            page.init(() => {
                loader.stop();
            });
        }
        else {
            setTimeout(() => {
                loader.stop();
            },300);
        }
    }
};

export default page;