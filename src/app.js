// Import F7
import Framework7 from 'framework7/framework7.esm.bundle.js';
import api from './plugins/api';


// Import F7 Styles
import 'framework7/css/framework7.bundle.css';

// font awesome
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'

// Import Icons and App Custom Styles
import './css/icons.css';
import './css/app.css';

// import sass
import './sass/main.sass';

// Import Routes
import routes from './routes.js';


// Init Framework7
const app = new Framework7({
  root: '#app',
  id: 'io.framework7.testapp', // App bundle ID
  name: 'Framework7', // App name
  theme: 'auto', // Automatic theme detection
  // App routes
  routes: routes,
  fastClicks: true
});

api.app = app;
