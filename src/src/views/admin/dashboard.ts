import { ScriptRunner } from '../../services/scriptRunner';
import { autoinject, Aurelia } from 'aurelia-framework';
import { Router, RouterConfiguration, NavigationInstruction } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { Rest, Config } from 'aurelia-api';

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
  		
  	$ 			: any;
	api 		: Rest; 
	router 		: Router;
	startDate 	: string;
	endDate 	: string;


	constructor(private aurelia: Aurelia, private config: Config) {

		this.api = this.config.getEndpoint('csz'); 
    }

	  
   	attached(): void {   
	}

	

    exportOrders(){ 
        var api = this.config.getEndpoint('csz');
        window.open(api.client.baseUrl + 'ExportOrders?startDate=' + this.startDate + '&endDate=' + this.endDate, '_parent');
    }

}
