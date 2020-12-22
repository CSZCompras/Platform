import { MarketRule } from '../domain/marketRule';
import { Contact } from '../domain/contact'; 


export class MarketRuleValidator {

    errorMessages                       : Array<string>;
    isMinimumOrderValueInvalid          : boolean;
    isnumberOfDaysToAcceptInvalid       : boolean;
    isPeriodToAcceptOrder1Invalid       : boolean;
    isPeriodToAcceptOrder2Invalid       : boolean;
    isReceiverNewClientInvalid          : boolean;
    isReceiverNewOrderInvalid           : boolean;
    
    isDeliveryOnMondayStartInvalid      : boolean;
    isDeliveryOnMondayEndInvalid        : boolean;
    isDeliveryOnTuesdayStartInvalid     : boolean;
    isDeliveryOnTuesdayEndInvalid       : boolean;
    isDeliveryOnWednesdayStartInvalid   : boolean;
    isDeliveryOnWednesdayEndInvalid     : boolean;    
    isDeliveryOnThursdayStartInvalid    : boolean;
    isDeliveryOnThursdayEndInvalid      : boolean;
    isDeliveryOnFridayStartInvalid      : boolean;
    isDeliveryOnFridayEndInvalid        : boolean;
    isDeliveryOnSaturdayStartInvalid    : boolean;
    isDeliveryOnSaturdayEndInvalid      : boolean;
    isDeliveryOnSundayStartInvalid      : boolean;
    isDeliveryOnSundayEndInvalid        : boolean; 
    
    isDeliverySchedule1Invalid  : boolean;
    isDeliverySchedule2Invalid  : boolean;    
    
    constructor(private rule : MarketRule) {   

        this.errorMessages = new Array<string>();
        this.validate();
    }


    validate() : Array<string> {                
        this.errorMessages = [];   
        this.validateMinimumOrderValue();
        this.validateNumberOfDaysToAccept();
        this.validatePeriodToAcceptOrder1();
        this.validatePeriodToAcceptOrder2();
        this.validateDeliverySchedule1();
        this.validateDeliverySchedule2();
        this.validateReceiverNewClient();
        this.validateReceiverNewOrder();
        return this.errorMessages;
    }

    validateReceiverNewClient(email = null){

        if(email == null){
            if(this.rule.sendNotificationToNewClient && (this.rule.receiverNewClient == null || this.rule.receiverNewClient  == '')){
                this.errorMessages.push('É necessário adicionar ao menos um e-mail em caso de novo cliente');
                this.isReceiverNewClientInvalid = true;
            }
        }
        else{
            if(this.rule.sendNotificationToNewClient && (email == null || email  == '')){
                this.errorMessages.push('O e-mail do destinatário em caso de novo cliente está em branco');
                this.isReceiverNewClientInvalid = true;
            }
            else{
                this.isReceiverNewClientInvalid = false;
            }
        }
    }
    
    validateReceiverNewOrder(email = null){

        if(email == null){
            if(this.rule.sendNotificationToNewOrder && (this.rule.receiverNewOrder == null || this.rule.receiverNewOrder  == '')){
                this.errorMessages.push('É necessário adicionar ao menos um e-mail em caso de novo pedido');
                this.isReceiverNewOrderInvalid = true;
            }
        }
        else{
            if(this.rule.sendNotificationToNewOrder && (email == null || email  == '')){
                this.errorMessages.push('O e-mail do destinatário em caso de novo pedido está em branco');
                this.isReceiverNewOrderInvalid = true;
            }
            else{
                this.isReceiverNewOrderInvalid = false;
            }
        }
    } 
    
    validateMinimumOrderValue(){
        
        if(this.rule.minimumOrderValue  == null || ('' + this.rule.minimumOrderValue)  == "" ){
            this.errorMessages.push('O valor mínimo do pedido é obrigatório');            
            this.isMinimumOrderValueInvalid = true;
        }
        else if(this.rule.minimumOrderValue <= 0){
            this.errorMessages.push('O valor mínimo do pedido deve ser maior que zero');            
            this.isMinimumOrderValueInvalid = true;
        }
        else{
            this.isMinimumOrderValueInvalid = false;
        }
    }


    validateNumberOfDaysToAccept(){
        
        if(this.rule.numberOfDaysToAccept  == null || ('' + this.rule.numberOfDaysToAccept)  == "" ){
            this.errorMessages.push('A quantidade de dias para aceite do pedido é obrigatória');            
            this.isnumberOfDaysToAcceptInvalid = true;
        }
        else if(this.rule.numberOfDaysToAccept <= 0){
            this.errorMessages.push('A quantidade de dias para aceite do pedido deve ser maior que zero');            
            this.isnumberOfDaysToAcceptInvalid = true;
        }
        else{
            this.isnumberOfDaysToAcceptInvalid = false;
        }
    }

    validatePeriodToAcceptOrder1(){

        if(this.rule.periodToAcceptOrder1  == null || ( '' + this.rule.periodToAcceptOrder1) == ''){
            this.errorMessages.push('O período inicial de aceite é obrigatório');
            this.isPeriodToAcceptOrder1Invalid = true;
        }
        else if (  ( <Number> this.rule.periodToAcceptOrder1) > 1800){
            this.errorMessages.push('O período inicial de aceite é inválido');
            this.isPeriodToAcceptOrder1Invalid = true;
        }
        else{
            this.isPeriodToAcceptOrder1Invalid = false;
        }
    }

    validatePeriodToAcceptOrder2()
    {
        if(this.rule.periodToAcceptOrder2  == null || ( '' + this.rule.periodToAcceptOrder2) == ''){
            this.errorMessages.push('O período final de aceite é obrigatório');
            this.isPeriodToAcceptOrder2Invalid = true;
        }
        else if (  ( <Number> this.rule.periodToAcceptOrder2) > 2400){
            this.errorMessages.push('O período final  de aceite é inválido');
            this.isPeriodToAcceptOrder2Invalid = true;
        }
        else{
            this.isPeriodToAcceptOrder2Invalid = false;
        }
    }

    validateDeliverySchedule1(){

        if(this.rule.deliverySchedule1  == null || ( '' + this.rule.deliverySchedule1) == ''){
            this.errorMessages.push('O horário inicial de entrega é obrigatório');
            this.isDeliverySchedule1Invalid = true;
        }
        else if (  ( <Number> this.rule.deliverySchedule1) > 1800){
            this.errorMessages.push('O horário inicial de entrega é inválido');
            this.isDeliverySchedule1Invalid = true;
        }
        else{
            this.isDeliverySchedule1Invalid = false;
        }
    }

    validateDeliverySchedule2(){ 

        if(this.rule.deliverySchedule2  == null || ( '' + this.rule.deliverySchedule2) == ''){
            this.errorMessages.push('O horário final de entrega é obrigatório');
            this.isDeliverySchedule2Invalid = true;
        }
        else if (  ( <Number> this.rule.deliverySchedule1) > 2400){
            this.errorMessages.push('O horário final de entrega é inválido');
            this.isDeliverySchedule2Invalid = true;
        }
        else{
            this.isDeliverySchedule2Invalid = false;
        }
    }
}