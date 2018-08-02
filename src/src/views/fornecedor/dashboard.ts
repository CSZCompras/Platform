import { ScriptRunner } from '../../services/scriptRunner';
import { autoinject, Aurelia } from 'aurelia-framework';
import { Router, RouterConfiguration, NavigationInstruction } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { Rest, Config } from 'aurelia-api';
import { AnalyticsRepository } from '../../repositories/analytics/analyticsRepository';
import { IdentityService } from '../../services/identityService';
import { NotificationService } from '../../services/notificationService';
import { GenericAnalytics } from '../../domain/analytics/genericAnalytics'; 
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
  		
  	$ 							: any;
	api 						: Rest; 
	router 						: Router;
	numberOfCustomers			: GenericAnalytics;
	numberOfOrders				: GenericAnalytics;
	isLoadingNumberOfCustomers	: boolean;
	isLoadingNumberOfOrders		: boolean;

	constructor(
			private aurelia: Aurelia, 
			private config: Config, 
			private service : IdentityService, 
			private repository : AnalyticsRepository,
			private nService : NotificationService) {

		this.api = this.config.getEndpoint('csz'); 
		this.isLoadingNumberOfCustomers = true;
		this.isLoadingNumberOfOrders = true;
    }

	  
   	attached(): void { 


		this.loadData();
		/* ScriptRunner.runScript();*/
	}

	loadData(){ 

		this.repository
			.getNumberOfCustomers()
			.then(x => {
				this.numberOfCustomers = x;
				this.isLoadingNumberOfCustomers = false;
			})
			.catch(e => {
				this.nService.error(e);
				this.isLoadingNumberOfCustomers = false;
			});

			

		this.repository
			.getNumberOfOrders()
			.then(x => {
				this.numberOfOrders = x;
				this.isLoadingNumberOfOrders = false;
			})
			.catch(e => {
				this.nService.error(e);
				this.isLoadingNumberOfOrders = false;
			});
	}

}
