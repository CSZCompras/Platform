import { Aurelia, autoinject, inject, NewInstance} from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { Rest, Config } from 'aurelia-api';
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';

@autoinject
export class Produtos {

	 
    constructor(		
		private router: Router) {	
    }  
} 