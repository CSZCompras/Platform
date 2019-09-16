import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog'; 
import { EventAggregator } from 'aurelia-event-aggregator';
import { ValidationControllerFactory, ValidationController, validateTrigger, ValidationRules, ControllerValidateResult } from 'aurelia-validation'; 
import { NotificationService } from '../../../services/notificationService'; 
import { FormValidationRenderer } from '../../formValidationRenderer';
import { ConfirmScheduleOrderViewModel } from '../../../domain/confirmScheduleOrderViewModel';
import { CotacaoViewModel } from '../../../domain/cotacaoViewModel';
import { DeliveryRuleRepository } from '../../../repositories/deliveryRuleRepository';
import { DeliveryRule } from '../../../domain/deliveryRule';

@autoinject
export class ObservacoesPedido{
 
    controller                              : DialogController;  
    validationController                    : ValidationController;  
    selectedQuote                           : CotacaoViewModel;

    constructor(
        pController                         : DialogController,  
        private ea                          : EventAggregator,
        private validationControllerFactory : ValidationControllerFactory,
        private notification                : NotificationService){ 
 
        this.controller = pController;               
    }    

    activate(params){  

        if(params.Quote != null){
            this.selectedQuote = params.Quote;
        } 
       
    }

    confirmOrder(){
        this.controller.ok(this.selectedQuote);
    }
 

    cancel(){
        this.controller.cancel();
    } 
}