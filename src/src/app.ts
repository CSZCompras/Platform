import { autoinject, Aurelia } from 'aurelia-framework';
import { Router, RouterConfiguration, NavigationInstruction } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { Rest, Config } from 'aurelia-api';
import { configure } from './resources';

import 'jquery';
import 'popper.js';
import 'bootstrap';
import 'mdbootstrap';
import 'velocity-animate';
import 'velocity';
import 'custom-scrollbar';
import 'jquery-visible';
import 'ie10-viewport';

@autoinject
export class App {
  		
  	$ : any;
	api : Rest; 
	router : Router; 

	configureRouter(config: RouterConfiguration, router: Router): void {
		
		config = config;
		config.title = 'CSZ Compras Inteligentes';

		this.router = router;
		this.addRoutes(config, router);
	}	

	constructor(private aurelia: Aurelia, private config: Config) {

        this.api = this.config.getEndpoint('fol'); 

        let d = new Date(); 
    }


   addRoutes(config: RouterConfiguration, router: Router) : void { 

		config.map([
			{ route: '', redirect: 'dashboard' },
            { route: 'dashboard', name: 'dashboard', moduleId: PLATFORM.moduleName('./views/dashboard') } ,
            { route: 'cadastro', name: 'cadastro', moduleId: PLATFORM.moduleName('./views/cadastro') } 
        ]);

        config.mapUnknownRoutes({ route: null, redirect: '/' });
   }
}
