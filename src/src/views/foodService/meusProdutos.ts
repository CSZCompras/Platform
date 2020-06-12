import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router'; 
import { EventAggregator } from 'aurelia-event-aggregator';

@autoinject
export class MeusProdutos{ 

    constructor(private router: Router, private ea : EventAggregator) {  
    } 

    attached(){

      this.ea.publish('loadingData');  
    }

    loadData() : void{
        
    }
}