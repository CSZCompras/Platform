import { inject, autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog'; 
import { EventAggregator } from 'aurelia-event-aggregator';
import { ValidationControllerFactory, ValidationController, validateTrigger, ValidationRules, ControllerValidateResult } from 'aurelia-validation'; 
import { NotificationService } from '../../../services/notificationService'; 
import { OrderRepository } from '../../../repositories/orderRepository';
import { FormValidationRenderer } from '../../formValidationRenderer';
import { Order } from '../../../domain/order';
import { OrderStatus } from '../../../domain/orderStatus';
import { RejectOrderViewModel } from '../../../domain/rejectOrderViewModel';
import { ConfirmScheduleOrderViewModel } from '../../../domain/confirmScheduleOrderViewModel';
import { V4MAPPED } from 'dns';

@autoinject
export class HorarioDeEntregaPedido{
 
    controller                              : DialogController;  
    validationController                    : ValidationController; 
    vm                                      : ConfirmScheduleOrderViewModel;

    constructor(
        pController                         : DialogController,  
        private ea                          : EventAggregator,
        private validationControllerFactory : ValidationControllerFactory,
        private notification                : NotificationService){ 
 
        this.controller = pController; 
        this.vm = new ConfirmScheduleOrderViewModel(); 

        // Validation.
        this.validationController = this.validationControllerFactory.createForCurrentScope();
        this.validationController.addRenderer(new FormValidationRenderer());
        this.validationController.validateTrigger = validateTrigger.blur;
        this.validationController.addObject(this.vm);     
    }    

    activate(params){  

        ValidationRules 
            .ensure((vm: ConfirmScheduleOrderViewModel) => vm.deliveryScheduleStart).displayName('Horário inicial').required() 
            .ensure((vm: ConfirmScheduleOrderViewModel) => vm.deliveryScheduleEnd).displayName('Horário final').required()         
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