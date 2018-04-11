import { ScriptRunner } from './services/scriptRunner';
import { Identity } from './domain/identity';
import { isNullOrUndefined } from 'util';
import { IdentityService } from './services/identityService';
import { autoinject, Aurelia } from 'aurelia-framework';
import { Router, RouterConfiguration, NavigationInstruction } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { Rest, Config } from 'aurelia-api';
import { configure } from './resources';
import { EventAggregator } from 'aurelia-event-aggregator';

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
	isLogged : boolean;
	identity : Identity;
	
	configureRouter(config: RouterConfiguration, router: Router): void {
		
		config = config;
		config.title = 'CSZ Compras Inteligentes';

		this.router = router;
		this.addRoutes(config, router);
	}	

	constructor(private aurelia: Aurelia, private config: Config, private ea: EventAggregator, private service : IdentityService) {

        this.api = this.config.getEndpoint('csz'); 
		this.isLogged = this.service.isLogged();
		
		this.ea.subscribe('loginDone', () => {
			this.isLogged = this.service.isLogged()
			this.identity = this.service.getIdentity();
			this.service.configureHttpClient(this.api.client);
			ScriptRunner.runScript();
		});

		if(this.isLogged){
			this.identity = this.service.getIdentity();
		}

		this.service.configureHttpClient(this.api.client);
    }


	attached() : void {

		if(! this.isLogged){
			this.router.navigate('login');
		}
		ScriptRunner.runScript();
	}

   addRoutes(config: RouterConfiguration, router: Router) : void { 

		config.map([
			{ route: '', redirect: 'dashboard' },
            { route: 'dashboard', name: 'dashboard', moduleId: PLATFORM.moduleName('./views/dashboard') },
            { route: 'cadastro', name: 'cadastro', moduleId: PLATFORM.moduleName('./views/cadastro') } ,
			{ route: 'produtos', name: 'produtos', moduleId: PLATFORM.moduleName('./views/produtos') } ,
			{ route: 'regrasDeMercado', name: 'regrasDeMercado', moduleId: PLATFORM.moduleName('./views/regrasDeMercado') } ,
            { route: 'login', name: 'login', moduleId: PLATFORM.moduleName('./views/login') },
			{ route: 'dashboardFoodService', name: 'dashboardFoodService', moduleId: PLATFORM.moduleName('./views/foodService/dashboard') }, 
			{ route: 'cadastroFoodService', name: 'cadastroFoodService', moduleId: PLATFORM.moduleName('./views/foodService/cadastro') }, 
			{ route: 'fornecedores', name: 'fornecedores', moduleId: PLATFORM.moduleName('./views/foodService/fornecedores') }, 
			{ route: 'meusProdutos', name: 'meusProdutos', moduleId: PLATFORM.moduleName('./views/foodService/meusProdutos') },  
			{ route: 'clientes', name: 'clientes', moduleId: PLATFORM.moduleName('./views/fornecedor/clientes') } 
        ]);

        config.mapUnknownRoutes({ route: null, redirect: '/' });
   }

   logout() : void {
	   this.service.resetIdentity();
	   this.isLogged = false;	   
	   this.router.navigate('login'); 
   }
}
