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

@autoinject
export class RejeicaoPedido{

    order                                   : Order;
    controller                              : DialogController;  
    validationController                    : ValidationController; 
    vm                                      : RejectOrderViewModel;
    processing                               : boolean;

    constructor(
        pController                         : DialogController,  
        private ea                          : EventAggregator,
        private validationControllerFactory : ValidationControllerFactory,
        private notification                : NotificationService,
        private orderRepo                   : OrderRepository){ 
 
        this.controller = pController;   
        this.order = new Order(); 
        this.vm = new RejectOrderViewModel();

        this.processing = false;

        // Validation.
        this.validationController = this.validationControllerFactory.createForCurrentScope();
        this.validationController.addRenderer(new FormValidationRenderer());
        this.validationController.validateTrigger = validateTrigger.blur;
        this.validationController.addObject(this.vm);     
    }    

    activate(params){  

        if(params.Order != null){ 
            this.order = params.Order;
            this.vm.orderId = this.order.id;
        } 

        ValidationRules 
        .ensure((vm: RejectOrderViewModel) => vm.orderId).displayName('Código do pedido').required() 
        .ensure((vm: RejectOrderViewModel) => vm.reason).displayName('Motivo da Rejeição').required() 
        .on(this.vm);  
       
    }

    rejectOrder(){

        this.validationController
        .validate()
        .then((result: ControllerValidateResult) => { 
            
                if (result.valid) {   

                    this.processing = true;

                    this.orderRepo
                        .rejectOrder(this.vm)
                        .then( (x : Order[]) => {
                            this.processing = false;
                            this.notification.success('Pedido rejeitado com sucesso!') ;                              
                            this.order.status = OrderStatus.Rejected;
                            this.controller.ok();           
                        })
                        .catch( e => {
                            this.processing = false;
                            this.notification.presentError(e); 
                        });

                }
                else {
                    this.processing = false;
                    this.notification.error('Erros de validação foram encontrados');
                }
            });     
    }
 

    cancel(){
        this.controller.cancel();
    } 
}