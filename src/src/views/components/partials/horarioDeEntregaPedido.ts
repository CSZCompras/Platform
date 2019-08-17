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
export class HorarioDeEntregaPedido{
 
    controller                              : DialogController;  
    validationController                    : ValidationController; 
    vm                                      : ConfirmScheduleOrderViewModel;
    selectedQuote                           : CotacaoViewModel;
    deliveryRule                            : DeliveryRule;

    constructor(
        pController                         : DialogController,  
        private ea                          : EventAggregator,
        private validationControllerFactory : ValidationControllerFactory,
        private notification                : NotificationService,
        private repository                  : DeliveryRuleRepository){ 
 
        this.controller = pController; 
        this.vm = new ConfirmScheduleOrderViewModel(); 

        // Validation.
        this.validationController = this.validationControllerFactory.createForCurrentScope();
        this.validationController.addRenderer(new FormValidationRenderer());
        this.validationController.validateTrigger = validateTrigger.blur;
        this.validationController.addObject(this.vm);             
    }    

    activate(params){  

        if(params.Quote != null){
            this.selectedQuote = params.Quote;
        }

        this.repository
            .getRule(this.selectedQuote.productClass.id)
            .then( (x : DeliveryRule) => { 
                if(x != null){

                    this.deliveryRule = <DeliveryRule> x;
                    this.vm.deliveryScheduleStart = x.deliveryScheduleInitial;
                    this.vm.deliveryScheduleEnd = x.deliveryScheduleFinal;
                    this.vm.deliveryDate = DeliveryRule.getNextDeliveryDate(this.deliveryRule);
                }
            })
            .catch( e => this.notification.presentError(e)); 

        ValidationRules 
            .ensure((vm: ConfirmScheduleOrderViewModel) => vm.deliveryScheduleStart).displayName('Horário inicial').required() 
            .ensure((vm: ConfirmScheduleOrderViewModel) => vm.deliveryScheduleEnd).displayName('Horário final').required()         
            .ensure((vm: ConfirmScheduleOrderViewModel) => vm.deliveryDate).displayName('Data de entrega').required()         
            .on(this.vm);  

        ValidationRules
            .ensureObject()
            .satisfies(obj => this.vm.deliveryScheduleStart < this.vm.deliveryScheduleEnd)
            .withMessage('O horario inicial deve ser menor que o horário final')
            .on(this.vm);
       
    }

    confirmSchedule(){

        this.validationController
        .validate()
        .then((result: ControllerValidateResult) => { 
            
                if (result.valid) {
                    this.controller.ok(this.vm);
                }
                else {                    
                    this.notification.error('Erros de validação foram encontrados');
                }
            });     
    }
 

    cancel(){
        this.controller.cancel();
    } 
}