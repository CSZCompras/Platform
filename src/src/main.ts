import {Aurelia} from 'aurelia-framework'
import { PLATFORM } from 'aurelia-pal';
import environment from './environment';

import 'jquery';
import 'popper.js';
import 'bootstrap';
import 'mdbootstrap';
import 'velocity-animate';
import 'velocity';
import 'custom-scrollbar';
import 'jquery-visible';
import 'ie10-viewport';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()    
    .feature('resources')
    /* .plugin('aurelia-autocomplete')
    .plugin('aurelia-dialog')
    .plugin('aurelia-validation')*/
    .plugin('aurelia-api', config => {
      config.registerEndpoint('csz', environment.apiAddress);
      config.registerEndpoint('viacep', environment.viacepAddress);
    });

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

   aurelia.start().then(() => aurelia.setRoot());
}
