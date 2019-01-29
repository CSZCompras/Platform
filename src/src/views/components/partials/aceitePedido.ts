import { inject, autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog'; 
import { EventAggregator } from 'aurelia-event-aggregator';
import { ValidationControllerFactory, ValidationController, validateTrigger, ValidationRules, ControllerValidateResult } from 'aurelia-validation'; 
import { NotificationService } from '../../../services/notificationService'; 
import { OrderRepository } from '../../../repositories/orderRepository';
import { FormValidationRenderer } from '../../formValidationRenderer';
import { Order } from '../../../domain/order';
import { OrderStatus } from '../../../domain/orderStatus';

@autoinject
export class AceitePedido{

    order                                   : Order;
    controller                              : DialogController;  
    validationController                    : ValidationController;
    processing                              : boolean;

    constructor(
        pController                         : DialogController, 
        private validationControllerFactory : ValidationControllerFactory,
        private ea                          : EventAggregator,
        private notification                : NotificationService,
        private orderRepo                   : OrderRepository){ 
 
        this.controller = pController;   
        this.order = new Order();

         // Validation.
         this.validationController = this.validationControllerFactory.createForCurrentScope();
         this.validationController.addRenderer(new FormValidationRenderer());
         this.validationController.validateTrigger = validateTrigger.blur;
         this.validationController.addObject(this.order);     

         this.processing = false;
    }    

    activate(params){  

        if(params.Order != null){

            this.order = params.Order;
        }

        ValidationRules
            .ensure((order: Order) => order.deliveryDate).displayName('Data de entrega').required() 
            .ensure((order: Order) => order.paymentDate).displayName('Data de pagamento').required() 
            .on(this.order);
       
    }

    acceptOrder(){

        this.validationController
        .validate()
        .then((result: ControllerValidateResult) => {
            
                if (result.valid) {

                    this.processing = true;
        
                    this.orderRepo
                        .acceptOrder(this.order)
                        .then( (x : Order[]) => {

                            this.notification.success('Pedido atualizado com sucesso!') ;              
                            this.ea.publish('orderAccepted', this.order);     
                            this.order.status = OrderStatus.Accepted;
                            this.controller.ok();    
                            this.processing = false;       
                        })
                        .catch( e => {
                            this.notification.presentError(e); 
                            this.processing = false;
                        });
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