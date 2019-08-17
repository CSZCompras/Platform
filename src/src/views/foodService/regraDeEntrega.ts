import { NotificationService } from '../../services/notificationService';
import { IdentityService } from '../../services/identityService';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ProductRepository } from '../../repositories/productRepository';
import { ProductClass } from '../../domain/productClass'; 
import { DeliveryRule } from '../../domain/deliveryRule'; 
import 'jquery-mask-plugin';
import { DeliveryRuleRepository } from '../../repositories/deliveryRuleRepository';

@autoinject
export class RegraDeEntrega{

    rule            : DeliveryRule;
    isLoading       : boolean;
    productClasses  : ProductClass[];
    selectedClass   : ProductClass;
    
    constructor(		
		private router              : Router, 
        private service             : IdentityService,
        private ea                  : EventAggregator,
		private nService            : NotificationService, 
        private productRepository   : ProductRepository,
        private deliveryRepository  : DeliveryRuleRepository) {

        this.isLoading = false;
    } 

    
    attached() : void{ 

        this.ea.publish('loadingData'); 
		this.loadData(); 
    } 

    loadData() : void {

		var identity = this.service.getIdentity();

		this.productRepository
            .getAllClasses()
            .then( (classes : ProductClass[]) => { 
                this.productClasses = classes;
            })
            .then( () => this.ea.publish('dataLoaded'))
            .catch( e =>  {
                this.nService.presentError(e);
            });
    }
    
    loadRule() : void{

        debugger;

        this.deliveryRepository
            .getRule(this.selectedClass.id)
            .then( (x: DeliveryRule) => { 
                
                if(x == null){
                    this.rule = new DeliveryRule();
                    this.rule.productClass = this.selectedClass;
                }
                else{
                    this.rule = x;
                }

            })
            .catch( e =>  this.nService.presentError(e));
    }

    save(){
 

            this.isLoading = true;

            this.deliveryRepository
                    .save(this.rule)
                    .then( (result : any) =>{ 
                        this.rule = result;
                        this.nService.success('Regra salva com sucesso!');
                        this.isLoading = false;

                    }).catch( e => {
                        this.nService.error(e);
                        this.isLoading = false;
                    }); 
    }
}