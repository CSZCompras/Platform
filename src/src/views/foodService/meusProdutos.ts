import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router'; 
import { EventAggregator } from 'aurelia-event-aggregator';

@autoinject
export class MeusProdutos{

    productAddedCount : number;

    constructor(private router: Router, private ea : EventAggregator) { 

      this.productAddedCount = 0; 
    } 

    attached(){

      this.ea.publish('loadingData'); 
              
      this.ea.subscribe('productAdded', (product  : any) =>{
        this.productAddedCount ++ ;
      });

      this.ea.subscribe('productRemoved', (product  : any) =>{
        this.productAddedCount -- ;
      });
    }

    loadData() : void{
        
    }
}