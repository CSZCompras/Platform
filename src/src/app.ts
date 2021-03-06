import { ScriptRunner } from './services/scriptRunner';
import { Identity } from './domain/identity'; 
import { IdentityService } from './services/identityService';
import { autoinject, Aurelia } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { Rest, Config } from 'aurelia-api'; 
import { EventAggregator } from 'aurelia-event-aggregator';
import { NotificationService } from './services/notificationService'; 
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
  		
	
  	$ 						: any;
	api 					: Rest; 
	router 					: Router;  
	identity 				: Identity;  
	routerConfig			: RouterConfiguration;

	constructor(private aurelia					: Aurelia, 
				private config					: Config,
				private ea						: EventAggregator,
				private service 				: IdentityService, 
				private nService 				: NotificationService, 
				private identityService			: IdentityService) {  

		this.api = this.config.getEndpoint('apiAddress');
		this.identityService.configureHttpClient(this.api.client);
	} 
	

	configureRouter(config: RouterConfiguration, router: Router): void {
		
		config = config;
		config.title = 'Econocompras'; 
		this.router = router;
		this.addRoutes(config, router); 
	}	

	attached() : void { 
		 
		ScriptRunner.runScript(); 
		var other = this; 
	}	

 
    addRoutes(config: RouterConfiguration, router: Router): void {

        config.map([
            { route: '', 		redirect: 'login' },
            { route: 'login', 	name: 'login', moduleId: PLATFORM.moduleName('./views/login') },
			{ route: 'invite', 	name: 'invite', moduleId: PLATFORM.moduleName('./views/confirmInvite') },
			{ route: 'forgotMyPassword', name: 'forgotMyPassword', moduleId: PLATFORM.moduleName('./views/forgotMyPassword') },
			{ route: 'welcome', 	name: 'invite', moduleId: PLATFORM.moduleName('./views/welcome') },
			{ route: 'econocompras', 	name: 'econocompras', moduleId: PLATFORM.moduleName('./views/master') },
			
        ]);

        config.mapUnknownRoutes({ route: 'login' }); 
        config.fallbackRoute('login');
    }

   logout() : void {
		this.identityService.resetIdentity();
		window.location.assign('/'); 
   }
}
