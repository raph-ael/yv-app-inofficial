import $$ from './dom';
import app from './app';

var longscroller = {
  settings: {},

  init: (items, options) => {

    if(!options) {
      options = {};
    }

    if(options.onAppend === undefined) {
      options.onAppend = (item, element) => {};
    }

    longscroller.settings = options;
    longscroller.items = items;

    let $scroller_el = $$('.infinite-scroll-content');
    let $list = $$('.infinite-scroll-content ul');

    items.slice(0,longscroller.settings.items_per_load).forEach((item) => {
      let $el = $$(longscroller.settings.render(item));
      $list.append($el);
      longscroller.settings.onAppend(item, $el);
    });

    let current_index = 1;

    let block_Scrolling = false;

    $scroller_el.on('infinite', () => {

      if (block_Scrolling) {
        return;
      }

      block_Scrolling = true;

      setTimeout(() => {

        block_Scrolling = false;

        let from = current_index * longscroller.settings.items_per_load;
        let to = longscroller.settings.items_per_load * (current_index+1);

        items.slice(from,to).forEach((item) => {
          let $el = $$(longscroller.settings.render(item));
          $list.append($el);
          longscroller.settings.onAppend(item, $el);
        });

        /*
         * finish scrolling
         */
        if((longscroller.settings.items_per_load*current_index) >= items.length) {
          app.fw7.infiniteScroll.destroy('.infinite-scroll-content');
          $$('.infinite-scroll-preloader').remove();
        }

        current_index++;

      },300);

    });

  }
};

export default longscroller;
