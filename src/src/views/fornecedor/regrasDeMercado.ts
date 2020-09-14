import { MarketRuleValidator } from '../../validators/marketRuleValidator';
import { MarketRule } from '../../domain/marketRule';
import { MarketRuleRepository } from '../../repositories/marketRuleRepository';
import { NotificationService } from '../../services/notificationService';
import { IdentityService } from '../../services/identityService';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import 'jquery-mask-plugin';

@autoinject
export class RegrasDeMercado{

    rule                : MarketRule;
    validator           : MarketRuleValidator;
    isLoading           : boolean;
    emailNewClient      : string;
    emailsNewClient     : string[];
    emailNewOrder       : string;
    emailsNewOrder      : string[];
    
    constructor(		
		private router: Router, 
        private service : IdentityService,
        private ea : EventAggregator,
		private nService : NotificationService, 
        private repository : MarketRuleRepository) {

        this.isLoading = false;
        this.emailsNewClient = [];
        this.emailsNewOrder = [];
    } 

    
    attached() : void{ 

        this.ea.publish('loadingData'); 
		this.loadData(); 
    } 

    addEmailNewClient(){

        var emailAlreadyExist = this.emailsNewClient.filter(x => x == this.emailNewClient).length > 0;

        if(emailAlreadyExist){
            this.nService.error('Este e-mail já foi adicionado');
        }
        else{

            if(this.emailNewClient != null && this.emailNewClient != ''){
                this.emailsNewClient.push(this.emailNewClient);
                this.emailNewClient = '';
            }
        }
    }

    removeEmailNewClient(email){

        this.emailsNewClient = this.emailsNewClient.filter(e => e != email);
    }

    addEmailNewOrder(){
    
        var emailAlreadyExist = this.emailsNewOrder.filter(x => x == this.emailNewOrder).length > 0;

        if(emailAlreadyExist){
            this.nService.error('Este e-mail já foi adicionado');
        }
        else{
            if(this.emailNewOrder != null && this.emailNewOrder != ''){
                this.emailsNewOrder.push(this.emailNewOrder);
                this.emailNewOrder = '';
            }
        }
    }

    removeEmailNewOrder(email){

        this.emailsNewOrder = this.emailsNewOrder.filter(e => e != email);
    }

    receiverNewClientChanged(email){
        if(email == null || email == ''){
            this.removeEmailNewClient(email);
        }
    }


    sendNotificationToNewClientChanged(){
        if(! this.rule.sendNotificationToNewClient){
            this.emailNewClient = '';
        }
    };

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
                    if(this.rule.sendNotificationToNewClient && this.rule.receiverNewClient != null && this.rule.receiverNewClient != ''){

                        this.rule
                            .receiverNewClient
                            .split(';')
                            .filter(r => r != null && r != '')
                            .forEach(r => this.emailsNewClient.push(r));
                    }
                    if(this.rule.sendNotificationToNewOrder && this.rule.receiverNewOrder != null && this.rule.receiverNewOrder != ''){

                        this.rule
                            .receiverNewOrder
                            .split(';')
                            .filter(r => r != null && r != '')
                            .forEach(r => this.emailsNewOrder.push(r));
                    }
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

        if(this.rule.sendNotificationToNewClient){
            this.rule.receiverNewClient = '';
            this.emailsNewClient.forEach( e => this.rule.receiverNewClient += e + ';');
        }
        else{
            this.rule.receiverNewClient = '';
        }

        if(this.rule.sendNotificationToNewOrder){
            this.rule.receiverNewOrder = '';
            this.emailsNewOrder.forEach( e => this.rule.receiverNewOrder += e + ';');
        }
        else{
            this.rule.receiverNewOrder = '';
        }

        var errors = this.validator.validate();

        if(! this.rule.sendNotificationToNewOrder){
            this.rule.receiverNewOrder = '';
        }

        if(! this.rule.sendNotificationToNewClient){
            this.rule.receiverNewClient = '';
        }

		if(errors.length == 0){

            this.isLoading = true;

            this.repository
                    .save(this.rule)
                    .then( (result : any) =>{ 

                        this.nService.success('Cadastro realizado!')       
                        this.router.navigate('/#/dashboard');        
                        this.isLoading = false;

                    })
                    .catch( e => {
                        
                        this.nService.error(e);
                        this.isLoading = false;
                    });
        }
		else{
			errors.forEach( (error : string) => {
				this.nService.error(error);
			});
		}                
    }
}