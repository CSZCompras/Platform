import { autoinject, Aurelia } from 'aurelia-framework';
import { Router } from 'aurelia-router';
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
import { Identity } from '../../domain/identity';
import { IdentityService } from '../../services/identityService';
import { RegisterStatus } from '../../domain/registerStatus';

@autoinject
export class App {
  		
  	$ 			: any;
	api 		: Rest; 
	router 		: Router;
	identity	: Identity;

	constructor(
		private aurelia	: Aurelia, 
		private config	: Config,
		private service : IdentityService) {

		this.identity = this.service.getIdentity();
    }
	  
   	attached(): void { 
		/* ScriptRunner.runScript();

		if(this.identity.registerStatus == RegisterStatus.Valid){
			this.loadData();				this.loadData();
		}  */
	}
}
