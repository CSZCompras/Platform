import { inject, NewInstance} from 'aurelia-framework';
import { NotificationService } from '../../services/notificationService';
import { Identity } from '../../domain/identity';
import { IdentityService } from '../../services/identityService';
import { Aurelia, autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { Rest, Config } from 'aurelia-api';
import { EventAggregator } from 'aurelia-event-aggregator';

@autoinject
export class MeusProdutos{

    productAddedCount : number;

    constructor(private router: Router, private ea : EventAggregator) { 

      this.productAddedCount = 0; 
    } 

    attached(){

      this.ea.subscribe('productAdded', (product  : any) =>{
        this.productAddedCount ++ ;
      });
    }

    loadData() : void{
        
    }
}