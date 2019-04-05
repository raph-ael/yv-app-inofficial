import api from '../js/api';
import tpl_asana_list from '../_compiled/templates/list-asana';
import app from '../js/app';
import loader from '../js/loader';
import asana_li from "../_compiled/templates/asana-li";


let page = {

    //observer: null,
    list_items: null,
    initiated: null,
    $search: null,
    $search_results: null,
    $list: null,
    items: null,

    init: (callback, onComplete) => {

        setTimeout(() => {
            api.getAsana({
                cached: true,
                success: (items) => {

                    app.$content_list_asana.html(tpl_asana_list({
                        items:items
                    }));

                    page.$list = $('#asana-content-ul');
                    page.$search = $('#asana-search');
                    page.$search_results = $('#asana-search-results');

                    callback();

                    page.items = items;

                    page.initSearch();

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
            },150);
        }
    },

    initSearch: () => {

        let search_timeout = 0;
        let show_timeout = 0;

        page.$search.keyup(() => {
            let val = page.$search.val().toLowerCase();

            if(val.length >= 2) {

                if(search_timeout !== 0) {
                    clearTimeout(search_timeout);
                }

                search_timeout = setTimeout(() =>{
                    search_timeout = 0;
                    page.$list.hide();
                    page.$search_results.empty().show();
                    page.items.forEach((el) => {
                        if((el.title + ' ' + el.sanskrit).toLowerCase().indexOf(val) > -1) {
                            page.$search_results.append(asana_li(el));
                        }
                    },300);
                });
            }
            else {
                if(show_timeout !== 0) {
                    clearTimeout(show_timeout);
                    show_timeout = 0;
                }
                show_timeout = setTimeout(() =>{
                    show_timeout = 0;
                    page.$list.show();
                    page.$search_results.hide();
                },300);
            }
        });
    }
};

export default page;