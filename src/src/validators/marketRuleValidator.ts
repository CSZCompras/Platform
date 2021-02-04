import { MarketRule } from '../domain/marketRule';


export class MarketRuleValidator {

    errorMessages                       : Array<string>;
    isMinimumOrderValueInvalid          : boolean;
    isnumberOfDaysToAcceptInvalid       : boolean;
    isPeriodToAcceptOrder1Invalid       : boolean;
    isPeriodToAcceptOrder2Invalid       : boolean;
    isReceiverNewClientInvalid          : boolean;
    isReceiverNewOrderInvalid           : boolean;

    isAcceptOrderOnMondayStartInvalid      : boolean;
    isAcceptOrderOnMondayEndInvalid        : boolean;
    isAcceptOrderOnTuesdayStartInvalid     : boolean;
    isAcceptOrderOnTuesdayEndInvalid       : boolean;
    isAcceptOrderOnWednesdayStartInvalid   : boolean;
    isAcceptOrderOnWednesdayEndInvalid     : boolean;    
    isAcceptOrderOnThursdayStartInvalid    : boolean;
    isAcceptOrderOnThursdayEndInvalid      : boolean;
    isAcceptOrderOnFridayStartInvalid      : boolean;
    isAcceptOrderOnFridayEndInvalid        : boolean;
    isAcceptOrderOnSaturdayStartInvalid    : boolean;
    isAcceptOrderOnSaturdayEndInvalid      : boolean;
    isAcceptOrderOnSundayStartInvalid      : boolean;
    isAcceptOrderOnSundayEndInvalid        : boolean; 

    
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
    }


    validate() : Array<string> {                
        this.errorMessages = [];   
        this.validateMinimumOrderValue();
        this.validateNumberOfDaysToAccept();
        this.validatePeriodToAcceptOrder1();
        this.validatePeriodToAcceptOrder2();

        

        this.validateAcceptOrderMondayScheduleStart();
        this.validateAcceptOrderMondayScheduleEnd();
        this.validateAcceptOrderTuesdayScheduleStart();
        this.validateAcceptOrderTuesdayScheduleEnd();        
        this.validateAcceptOrderWednesdayScheduleStart();
        this.validateAcceptOrderWednesdayScheduleEnd();
        this.validateAcceptOrderThursdayScheduleStart();
        this.validateAcceptOrderThursdayScheduleEnd();
        this.validateAcceptOrderFridayScheduleStart();
        this.validateAcceptOrderFridayScheduleEnd();
        this.validateAcceptOrderSaturdayScheduleStart();
        this.validateAcceptOrderSaturdayScheduleEnd();
        this.validateAcceptOrderSundayScheduleStart();
        this.validateAcceptOrderSundayScheduleEnd();


        this.validateDeliveryMondayScheduleStart();
        this.validateDeliveryMondayScheduleEnd();
        this.validateDeliveryTuesdayScheduleStart();
        this.validateDeliveryTuesdayScheduleEnd();        
        this.validateDeliveryWednesdayScheduleStart();
        this.validateDeliveryWednesdayScheduleEnd();
        this.validateDeliveryThursdayScheduleStart();
        this.validateDeliveryThursdayScheduleEnd();
        this.validateDeliveryFridayScheduleStart();
        this.validateDeliveryFridayScheduleEnd();
        this.validateDeliverySaturdayScheduleStart();
        this.validateDeliverySaturdayScheduleEnd();
        this.validateDeliverySundayScheduleStart();
        this.validateDeliverySundayScheduleEnd();

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

    

    validateAcceptOrderMondayScheduleStart(){

        if(this.rule.acceptOrderOnMonday){
            
            if(this.rule.acceptOrderOnMondayStart  == null || ( '' + this.rule.acceptOrderOnMondayStart) == '' || ( <Number> this.rule.acceptOrderOnMondayStart) > 1800) {
                this.errorMessages.push('O horário inicial de aceite é obrigatório');
                this.isAcceptOrderOnMondayStartInvalid = true;
            }
            else{
                this.isAcceptOrderOnMondayStartInvalid = false;
            }
        }
    }

    validateAcceptOrderMondayScheduleEnd(){

        if(this.rule.acceptOrderOnMonday){

            if(this.rule.acceptOrderOnMondayEnd  == null || ( '' + this.rule.acceptOrderOnMondayEnd) == '' ||  ( <Number> this.rule.acceptOrderOnMondayEnd) > 2400){
                this.errorMessages.push('O horário final de aceite é obrigatório');
                this.isAcceptOrderOnMondayEndInvalid = true;
            } 
            else{
                this.isAcceptOrderOnMondayEndInvalid = false;
            }
        }
    } 

    validateAcceptOrderTuesdayScheduleStart(){

        if(this.rule.acceptOrderOnTuesday){

            if(this.rule.acceptOrderOnTuesdayStart  == null || ( '' + this.rule.acceptOrderOnTuesdayStart) == '' || ( <Number> this.rule.acceptOrderOnTuesdayStart) > 1800){
                this.errorMessages.push('O horário inicial de aceite é obrigatório');
                this.isAcceptOrderOnTuesdayStartInvalid = true;
            } 
            else{
                this.isAcceptOrderOnTuesdayStartInvalid = false;
            } 
        }
    }

    validateAcceptOrderTuesdayScheduleEnd(){

        if(this.rule.acceptOrderOnTuesday){

            if(this.rule.acceptOrderOnTuesdayEnd  == null || ( '' + this.rule.acceptOrderOnTuesdayEnd) == '' || ( <Number> this.rule.acceptOrderOnTuesdayEnd) > 2400){
                this.errorMessages.push('O horário final de aceite é obrigatório');
                this.isAcceptOrderOnTuesdayEndInvalid = true;
            }
            else{
                this.isAcceptOrderOnTuesdayEndInvalid = false;
            }
        }
    } 
    

    validateAcceptOrderWednesdayScheduleStart(){

        if(this.rule.acceptOrderOnWednesday){
        
            if(this.rule.acceptOrderOnWednesdayStart  == null || ( '' + this.rule.acceptOrderOnWednesdayStart) == '' || ( <Number> this.rule.acceptOrderOnWednesdayStart) > 1800){
                this.errorMessages.push('O horário inicial de aceite é obrigatório');
                this.isAcceptOrderOnWednesdayStartInvalid = true;
            } 
            else{
                this.isAcceptOrderOnWednesdayStartInvalid = false;
            }
        }
    }

    validateAcceptOrderWednesdayScheduleEnd(){

        if(this.rule.acceptOrderOnWednesday){

            if(this.rule.acceptOrderOnWednesdayEnd  == null || ( '' + this.rule.acceptOrderOnWednesdayEnd) == '' || ( <Number> this.rule.acceptOrderOnWednesdayEnd) > 2400){
                this.errorMessages.push('O horário final de aceite é obrigatório');
                this.isAcceptOrderOnWednesdayEndInvalid = true;
            } 
            else{
                this.isAcceptOrderOnWednesdayEndInvalid = false;
            }
        }
    }

    
    validateAcceptOrderThursdayScheduleStart(){

        if(this.rule.acceptOrderOnThursday){

            if(this.rule.acceptOrderOnThursdayStart  == null || ( '' + this.rule.acceptOrderOnThursdayStart) == '' || ( <Number> this.rule.acceptOrderOnThursdayStart) > 1800){
                this.errorMessages.push('O horário inicial de aceite é obrigatório');
                this.isAcceptOrderOnThursdayStartInvalid = true;
            }
            else{
                this.isAcceptOrderOnThursdayStartInvalid = false;
            }

        }
    }

    validateAcceptOrderThursdayScheduleEnd(){

        if(this.rule.acceptOrderOnThursday){

            if(this.rule.acceptOrderOnThursdayEnd  == null || ( '' + this.rule.acceptOrderOnThursdayEnd) == '' || ( <Number> this.rule.acceptOrderOnThursdayEnd) > 2400){
                this.errorMessages.push('O horário final de aceite é obrigatório');
                this.isAcceptOrderOnThursdayEndInvalid = true;
            } 
            else{
                this.isAcceptOrderOnThursdayEndInvalid = false;
            } 
        }
    }

    
    validateAcceptOrderFridayScheduleStart(){


        if(this.rule.acceptOrderOnFriday){

            if(this.rule.acceptOrderOnFridayStart  == null || ( '' + this.rule.acceptOrderOnFridayStart) == '' || ( <Number> this.rule.acceptOrderOnFridayStart) > 1800){
                this.errorMessages.push('O horário inicial de aceite é obrigatório');
                this.isAcceptOrderOnFridayStartInvalid = true;
            }
            else{
                this.isAcceptOrderOnFridayStartInvalid = false;
            }
        }
    }

    validateAcceptOrderFridayScheduleEnd(){


        if(this.rule.acceptOrderOnFriday){

            if(this.rule.acceptOrderOnFridayEnd  == null || ( '' + this.rule.acceptOrderOnFridayEnd) == '' || ( <Number> this.rule.acceptOrderOnFridayEnd) > 2400){
                this.errorMessages.push('O horário final de aceite é obrigatório');
                this.isAcceptOrderOnFridayEndInvalid = true;
            } 
            else{
                this.isAcceptOrderOnFridayEndInvalid = false;
            }
        }
    }

    validateAcceptOrderSaturdayScheduleStart(){

        if(this.rule.acceptOrderOnSaturday){

            if(this.rule.acceptOrderOnSaturdayStart  == null || ( '' + this.rule.acceptOrderOnSaturdayStart) == '' || ( <Number> this.rule.acceptOrderOnSaturdayStart) > 1800){
                this.errorMessages.push('O horário inicial de aceite é obrigatório');
                this.isAcceptOrderOnSaturdayStartInvalid = true;
            }
            else{
                this.isAcceptOrderOnSaturdayStartInvalid = false;
            } 
        }
    }

    validateAcceptOrderSaturdayScheduleEnd(){

        if(this.rule.acceptOrderOnSaturday){

            if(this.rule.acceptOrderOnSaturdayEnd  == null || ( '' + this.rule.acceptOrderOnSaturdayEnd) == ''){
                this.errorMessages.push('O horário final de aceite é obrigatório');
                this.isAcceptOrderOnSaturdayEndInvalid = true;
            }
            else if (  ( <Number> this.rule.acceptOrderOnSaturdayEnd) > 2400){
                this.errorMessages.push('O horário final de aceite é inválido');
                this.isAcceptOrderOnSaturdayEndInvalid = true;
            }
            else{
                this.isAcceptOrderOnSaturdayEndInvalid = false;
            }
        }
    }

    validateAcceptOrderSundayScheduleStart(){

        if(this.rule.acceptOrderOnSunday){

            if(this.rule.acceptOrderOnSundayStart  == null || ( '' + this.rule.acceptOrderOnSundayStart) == '' || ( <Number> this.rule.acceptOrderOnSundayStart) > 1800){
                this.errorMessages.push('O horário inicial de aceite é obrigatório');
                this.isAcceptOrderOnSundayStartInvalid = true;
            } 
            else{
                this.isAcceptOrderOnSundayStartInvalid = false;
            } 
        }
    }

    validateAcceptOrderSundayScheduleEnd(){

        if(this.rule.acceptOrderOnSunday){

            if(this.rule.acceptOrderOnSundayEnd  == null || ( '' + this.rule.acceptOrderOnSundayEnd) == ''){
                this.errorMessages.push('O horário final de aceite é obrigatório');
                this.isAcceptOrderOnSundayEndInvalid = true;
            }
            else if (  ( <Number> this.rule.acceptOrderOnSundayEnd) > 2400){
                this.errorMessages.push('O horário final de aceite é inválido');
                this.isAcceptOrderOnSundayEndInvalid = true;
            }
            else{
                this.isAcceptOrderOnSundayEndInvalid = false;
            } 
        }
    }





    /* 888888888888888888888 */ 

    validateDeliveryMondayScheduleStart(){

        if(this.rule.deliveryOnMonday){
            
            if(this.rule.deliveryOnMondayStart  == null || ( '' + this.rule.deliveryOnMondayStart) == '' || ( <Number> this.rule.deliveryOnMondayStart) > 1800) {
                this.errorMessages.push('O horário inicial de entrega é obrigatório');
                this.isDeliveryOnMondayStartInvalid = true;
            }
            else{
                this.isDeliveryOnMondayStartInvalid = false;
            }
        }
    }

    validateDeliveryMondayScheduleEnd(){

        if(this.rule.deliveryOnMonday){

            if(this.rule.deliveryOnMondayEnd  == null || ( '' + this.rule.deliveryOnMondayEnd) == '' ||  ( <Number> this.rule.deliveryOnMondayEnd) > 2400){
                this.errorMessages.push('O horário final de entrega é obrigatório');
                this.isDeliveryOnMondayEndInvalid = true;
            } 
            else{
                this.isDeliveryOnMondayEndInvalid = false;
            }
        }
    } 

    validateDeliveryTuesdayScheduleStart(){

        if(this.rule.deliveryOnTuesday){

            if(this.rule.deliveryOnTuesdayStart  == null || ( '' + this.rule.deliveryOnTuesdayStart) == '' || ( <Number> this.rule.deliveryOnTuesdayStart) > 1800){
                this.errorMessages.push('O horário inicial de entrega é obrigatório');
                this.isDeliveryOnTuesdayStartInvalid = true;
            } 
            else{
                this.isDeliveryOnTuesdayStartInvalid = false;
            } 
        }
    }

    validateDeliveryTuesdayScheduleEnd(){

        if(this.rule.deliveryOnTuesday){

            if(this.rule.deliveryOnTuesdayEnd  == null || ( '' + this.rule.deliveryOnTuesdayEnd) == '' || ( <Number> this.rule.deliveryOnTuesdayEnd) > 2400){
                this.errorMessages.push('O horário final de entrega é obrigatório');
                this.isDeliveryOnTuesdayEndInvalid = true;
            }
            else{
                this.isDeliveryOnTuesdayEndInvalid = false;
            }
        }
    } 
    

    validateDeliveryWednesdayScheduleStart(){

        if(this.rule.deliveryOnWednesday){
        
            if(this.rule.deliveryOnWednesdayStart  == null || ( '' + this.rule.deliveryOnWednesdayStart) == '' || ( <Number> this.rule.deliveryOnWednesdayStart) > 1800){
                this.errorMessages.push('O horário inicial de entrega é obrigatório');
                this.isDeliveryOnWednesdayStartInvalid = true;
            } 
            else{
                this.isDeliveryOnWednesdayStartInvalid = false;
            }
        }
    }

    validateDeliveryWednesdayScheduleEnd(){

        if(this.rule.deliveryOnWednesday){

            if(this.rule.deliveryOnWednesdayEnd  == null || ( '' + this.rule.deliveryOnWednesdayEnd) == '' || ( <Number> this.rule.deliveryOnWednesdayEnd) > 2400){
                this.errorMessages.push('O horário final de entrega é obrigatório');
                this.isDeliveryOnWednesdayEndInvalid = true;
            } 
            else{
                this.isDeliveryOnWednesdayEndInvalid = false;
            }
        }
    }

    
    validateDeliveryThursdayScheduleStart(){

        if(this.rule.deliveryOnThursday){

            if(this.rule.deliveryOnThursdayStart  == null || ( '' + this.rule.deliveryOnThursdayStart) == '' || ( <Number> this.rule.deliveryOnThursdayStart) > 1800){
                this.errorMessages.push('O horário inicial de entrega é obrigatório');
                this.isDeliveryOnThursdayStartInvalid = true;
            }
            else{
                this.isDeliveryOnThursdayStartInvalid = false;
            }

        }
    }

    validateDeliveryThursdayScheduleEnd(){

        if(this.rule.deliveryOnThursday){

            if(this.rule.deliveryOnThursdayEnd  == null || ( '' + this.rule.deliveryOnThursdayEnd) == '' || ( <Number> this.rule.deliveryOnThursdayEnd) > 2400){
                this.errorMessages.push('O horário final de entrega é obrigatório');
                this.isDeliveryOnThursdayEndInvalid = true;
            } 
            else{
                this.isDeliveryOnThursdayEndInvalid = false;
            } 
        }
    }

    
    validateDeliveryFridayScheduleStart(){


        if(this.rule.deliveryOnFriday){

            if(this.rule.deliveryOnFridayStart  == null || ( '' + this.rule.deliveryOnFridayStart) == '' || ( <Number> this.rule.deliveryOnFridayStart) > 1800){
                this.errorMessages.push('O horário inicial de entrega é obrigatório');
                this.isDeliveryOnFridayStartInvalid = true;
            }
            else{
                this.isDeliveryOnFridayStartInvalid = false;
            }
        }
    }

    validateDeliveryFridayScheduleEnd(){


        if(this.rule.deliveryOnFriday){

            if(this.rule.deliveryOnFridayEnd  == null || ( '' + this.rule.deliveryOnFridayEnd) == '' || ( <Number> this.rule.deliveryOnFridayEnd) > 2400){
                this.errorMessages.push('O horário final de entrega é obrigatório');
                this.isDeliveryOnFridayEndInvalid = true;
            } 
            else{
                this.isDeliveryOnFridayEndInvalid = false;
            }
        }
    }

    validateDeliverySaturdayScheduleStart(){

        if(this.rule.deliveryOnSaturday){

            if(this.rule.deliveryOnSaturdayStart  == null || ( '' + this.rule.deliveryOnSaturdayStart) == '' || ( <Number> this.rule.deliveryOnSaturdayStart) > 1800){
                this.errorMessages.push('O horário inicial de entrega é obrigatório');
                this.isDeliveryOnSaturdayStartInvalid = true;
            }
            else{
                this.isDeliveryOnSaturdayStartInvalid = false;
            } 
        }
    }

    validateDeliverySaturdayScheduleEnd(){

        if(this.rule.deliveryOnSaturday){

            if(this.rule.deliveryOnSaturdayEnd  == null || ( '' + this.rule.deliveryOnSaturdayEnd) == ''){
                this.errorMessages.push('O horário final de entrega é obrigatório');
                this.isDeliveryOnSaturdayEndInvalid = true;
            }
            else if (  ( <Number> this.rule.deliveryOnSaturdayEnd) > 2400){
                this.errorMessages.push('O horário final de entrega é inválido');
                this.isDeliveryOnSaturdayEndInvalid = true;
            }
            else{
                this.isDeliveryOnSaturdayEndInvalid = false;
            }
        }
    }

    validateDeliverySundayScheduleStart(){

        if(this.rule.deliveryOnSunday){

            if(this.rule.deliveryOnSundayStart  == null || ( '' + this.rule.deliveryOnSundayStart) == '' || ( <Number> this.rule.deliveryOnSundayStart) > 1800){
                this.errorMessages.push('O horário inicial de entrega é obrigatório');
                this.isDeliveryOnSundayStartInvalid = true;
            } 
            else{
                this.isDeliveryOnSundayStartInvalid = false;
            } 
        }
    }

    validateDeliverySundayScheduleEnd(){

        if(this.rule.deliveryOnSunday){

            if(this.rule.deliveryOnSundayEnd  == null || ( '' + this.rule.deliveryOnSundayEnd) == ''){
                this.errorMessages.push('O horário final de entrega é obrigatório');
                this.isDeliveryOnSundayEndInvalid = true;
            }
            else if (  ( <Number> this.rule.deliveryOnSundayEnd) > 2400){
                this.errorMessages.push('O horário final de entrega é inválido');
                this.isDeliveryOnSundayEndInvalid = true;
            }
            else{
                this.isDeliveryOnSundayEndInvalid = false;
            } 
        }
    }
}