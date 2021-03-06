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
            })
            .then( () => this.ea.publish('dataLoaded'))
            .catch( e =>  {
                this.nService.presentError(e);
            });
    }

    
    
    acceptOrderOnMondayChanged(){
        if(! this.rule.acceptOrderOnMonday){
            this.rule.acceptOrderOnMondayStart = null;
            this.rule.acceptOrderOnMondayEnd = null;
            this.validator.isAcceptOrderOnMondayStartInvalid = null;
            this.validator.isAcceptOrderOnMondayEndInvalid = null;
        }
    } 
    
    acceptOrderOnTuesdayChanged(){
        if(! this.rule.acceptOrderOnTuesday){
            this.rule.acceptOrderOnTuesdayStart = null;
            this.rule.acceptOrderOnTuesdayEnd = null;
            this.validator.isAcceptOrderOnTuesdayStartInvalid = null;
            this.validator.isAcceptOrderOnTuesdayEndInvalid = null;
        }
    }
    
    acceptOrderOnWednesdayChanged(){
        if(! this.rule.acceptOrderOnWednesday){
            this.rule.acceptOrderOnWednesdayStart = null;
            this.rule.acceptOrderOnWednesdayEnd = null;
            this.validator.isAcceptOrderOnWednesdayStartInvalid = null;
            this.validator.isAcceptOrderOnWednesdayEndInvalid = null;
        }
    }
    
    acceptOrderOnThursdayChanged(){
        if(! this.rule.acceptOrderOnThursday){
            this.rule.acceptOrderOnThursdayStart = null;
            this.rule.acceptOrderOnThursdayEnd = null;
            this.validator.isAcceptOrderOnThursdayStartInvalid = null;
            this.validator.isAcceptOrderOnThursdayEndInvalid = null;
        }
    }
    
    acceptOrderOnFridayChanged(){
        if(! this.rule.acceptOrderOnFriday){
            this.rule.acceptOrderOnFridayStart = null;
            this.rule.acceptOrderOnFridayEnd = null;
            this.validator.isAcceptOrderOnFridayStartInvalid = null;
            this.validator.isAcceptOrderOnFridayEndInvalid = null;
        }
    }
    
    acceptOrderOnSaturdayChanged(){
        if(! this.rule.acceptOrderOnSaturday){
            this.rule.acceptOrderOnSaturdayStart = null;
            this.rule.acceptOrderOnSaturdayEnd = null;
            this.validator.isAcceptOrderOnSaturdayStartInvalid = null;
            this.validator.isAcceptOrderOnSaturdayEndInvalid = null;
        }
    }

    
    acceptOrderOnSundayChanged(){
        if(! this.rule.acceptOrderOnSunday){
            this.rule.acceptOrderOnSundayStart = null;
            this.rule.acceptOrderOnSundayEnd = null;
            this.validator.isAcceptOrderOnSundayStartInvalid = null;
            this.validator.isAcceptOrderOnSundayEndInvalid = null;
        }
    }
    
    
    deliveryOnMondayChanged(){
        if(! this.rule.deliveryOnMonday){
            this.rule.deliveryOnMondayStart = null;
            this.rule.deliveryOnMondayEnd = null;
            this.validator.isDeliveryOnMondayStartInvalid = null;
            this.validator.isDeliveryOnMondayEndInvalid = null;
        }
    } 
    
    deliveryOnTuesdayChanged(){
        if(! this.rule.deliveryOnTuesday){
            this.rule.deliveryOnTuesdayStart = null;
            this.rule.deliveryOnTuesdayEnd = null;
            this.validator.isDeliveryOnTuesdayStartInvalid = null;
            this.validator.isDeliveryOnTuesdayEndInvalid = null;
        }
    }
    
    deliveryOnWednesdayChanged(){
        if(! this.rule.deliveryOnWednesday){
            this.rule.deliveryOnWednesdayStart = null;
            this.rule.deliveryOnWednesdayEnd = null;
            this.validator.isDeliveryOnWednesdayStartInvalid = null;
            this.validator.isDeliveryOnWednesdayEndInvalid = null;
        }
    }
    
    deliveryOnThursdayChanged(){
        if(! this.rule.deliveryOnThursday){
            this.rule.deliveryOnThursdayStart = null;
            this.rule.deliveryOnThursdayEnd = null;
            this.validator.isDeliveryOnThursdayStartInvalid = null;
            this.validator.isDeliveryOnThursdayEndInvalid = null;
        }
    }
    
    deliveryOnFridayChanged(){
        if(! this.rule.deliveryOnFriday){
            this.rule.deliveryOnFridayStart = null;
            this.rule.deliveryOnFridayEnd = null;
            this.validator.isDeliveryOnFridayStartInvalid = null;
            this.validator.isDeliveryOnFridayEndInvalid = null;
        }
    }
    
    deliveryOnSaturdayChanged(){
        if(! this.rule.deliveryOnSaturday){
            this.rule.deliveryOnSaturdayStart = null;
            this.rule.deliveryOnSaturdayEnd = null;
            this.validator.isDeliveryOnSaturdayStartInvalid = null;
            this.validator.isDeliveryOnSaturdayEndInvalid = null;
        }
    }

    
    deliveryOnSundayChanged(){
        if(! this.rule.deliveryOnSunday){
            this.rule.deliveryOnSundayStart = null;
            this.rule.deliveryOnSundayEnd = null;
            this.validator.isDeliveryOnSundayStartInvalid = null;
            this.validator.isDeliveryOnSundayEndInvalid = null;
        }
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