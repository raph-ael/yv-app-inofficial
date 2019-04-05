import pageYoga from '../pages/yoga';
import pageAsana from '../pages/asana';
import pageMantra from '../pages/mantra';
import pageListYoga from '../pages/list-yoga';
import pageListMeditation from '../pages/list-meditation';
import pageListPrana from '../pages/list-pranayama';
import pageListMantra from '../pages/list-mantra';
import pageListAsana from '../pages/list-asana';

import app from './app';

let routes = {
    'list-yoga': {
        show: (params) => {
            pageListYoga.show(params);
        },
        hide: () => {
            pageListYoga.hide();
        }
    },
    'list-meditation': {
        show: (params) => {
            pageListMeditation.show(params);
        },
        hide: () => {
            pageListMeditation.hide();
        }
    },
    'list-pranayama': {
        show: (params) => {
            pageListPrana.show(params);
        },
        hide: () => {
            pageListPrana.hide();
        }
    },
    'list-mantra': {
        show: (params) => {
            pageListMantra.show(params);
        },
        hide: () => {
            pageListMantra.hide();
        }
    },
    'list-asana': {
        show: (params) => {
            console.log('asana');
            pageListAsana.show(params);
        },
        hide: () => {
            pageListAsana.hide();
        }
    },
    'yoga/{id}': {
        show: (params) => {
            pageYoga.show(params);
        },
        hide: () => {
            pageYoga.hide();
        }
    },
    'mantra/{id}': {
        show: (params) => {
            pageMantra.show(params);
        },
        hide: () => {
            pageMantra.hide();
        }
    },
    'asana/{id}': {
        show: (params) => {
            pageAsana.show(params);
        },
        hide: () => {
            pageAsana.hide();
        }
    }
};

export default routes;