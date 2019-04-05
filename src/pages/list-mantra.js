import api from '../js/api';
import mantralist from '../_compiled/templates/list-mantra';
import mantra_li from '../_compiled/templates/mantra-li';
import app from '../js/app';
import loader from '../js/loader';


let page = {

    //observer: null,
    list_items: null,
    initiated: null,
    $search: null,
    $list: null,
    $search_results: null,
    items: null,

    init: (callback) => {

        setTimeout(() => {
            api.getMantra({
                cached: true,
                success: (items) => {

                    page.items = items;

                    app.$content_list_mantra.html(mantralist({
                        items:items
                    }));

                    page.$search = $('#mantra-search');
                    page.$list = $('#mantra-content-ul');
                    page.$search_results = $('#mantra-search-results');

                    page.initSearch();

                    page.initiated = true;

                    callback();


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
    },

    initSearch: () => {

        let search_timeout = 0;
        let show_timeout = 0;

        page.$search.keyup(() => {
           let val = page.$search.val().toLowerCase();
           console.log(val);

           if(val.length >= 3) {

               if(search_timeout !== 0) {
                   clearTimeout(search_timeout);
               }

               search_timeout = setTimeout(() =>{
                   search_timeout = 0;
                   page.$list.hide();
                   page.$search_results.empty().show();
                   page.items.forEach((el) => {
                       if(el.subTitle.toLowerCase().indexOf(val) > -1) {

                           page.$search_results.append(mantra_li(el));
                       }
                   },400);
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
               },400);
           }
        });
    }
};

export default page;