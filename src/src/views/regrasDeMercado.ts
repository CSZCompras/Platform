import { MarketRuleValidator } from '../validators/marketRuleValidator';
import { MarketRule } from '../domain/marketRule';
import { MarketRuleRepository } from '../repositories/marketRuleRepository';
import { NotificationService } from '../services/notificationService';
import { IdentityService } from '../services/identityService';
import { inject, NewInstance, Aurelia, autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import 'jquery-mask-plugin';
import { EventAggregator } from 'aurelia-event-aggregator';

@autoinject
export class RegrasDeMercado{

    rule : MarketRule;
    validator : MarketRuleValidator;
    
    constructor(		
		private router: Router, 
        private service : IdentityService,
        private ea : EventAggregator,
		private nService : NotificationService, 
        private repository : MarketRuleRepository) {

    } 

    
    attached() : void{ 

        this.ea.publish('loadingData'); 
		this.loadData(); 
    } 

    loadData() : void {

		var identity = this.service.getIdentity();

		this.repository
            .getRule(identity.id)
            .then( (rule : MarketRule) => { 
                if(rule == null){
                    this.rule = new MarketRule();
                }
                else{
                    this.rule = rule;
                }
				this.validator = new MarketRuleValidator(this.rule);
                this.validator.validate();
            })
            .then( () => this.ea.publish('dataLoaded'))
            .catch( e =>  {
                this.nService.presentError(e);
            });
	}

    save(){
        var errors = this.validator.validate();

        if(! this.rule.sendNotificationToNewOrder){
            this.rule.receiverNewOrder = '';
        }

        if(! this.rule.sendNotificationToNewClient){
            this.rule.receiverNewClient = '';
        }

		if(errors.length == 0){

            this.repository
                    .save(this.rule)
                    .then( (result : any) =>{         
                        this.nService.success('Cadastro realizado!')       
                        this.router.navigate('/#/dashboard');                
                    }).catch( e => {
                        this.nService.error(e);
                    });
        }
		else{
			errors.forEach( (error : string) => {
				this.nService.error(error);
			});
		}                
    }
}