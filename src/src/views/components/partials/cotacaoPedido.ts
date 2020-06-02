import { Config } from 'aurelia-api'; 
import { ProductRepository } from '../../../repositories/productRepository';
import { NotificationService } from '../../../services/notificationService';
import { IdentityService } from '../../../services/identityService'; 
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router'; 
import { EventAggregator } from 'aurelia-event-aggregator';

@autoinject
export class CotacaoPedido{

    constructor(		
        private router: Router, 
		private service : IdentityService,
		private nService : NotificationService, 
        private ea : EventAggregator ,
        private config: Config,
        private repository : ProductRepository) {  
    } 
}