import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog'; 
import { EventAggregator } from 'aurelia-event-aggregator';
import { ValidationControllerFactory, ValidationController, validateTrigger, ValidationRules, ControllerValidateResult } from 'aurelia-validation'; 
import { NotificationService } from '../../../services/notificationService'; 
import { OrderRepository } from '../../../repositories/orderRepository'; 
import { Order } from '../../../domain/order';
import { OrderStatus } from '../../../domain/orderStatus';

@autoinject
export class FaturarPedido{

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
         this.processing = false;
    }    

    activate(params){  

        if(params.Order != null){
            this.order = params.Order;
        } 
       
    }

    billOrder(){ 

        this.processing = true;
        
        this.orderRepo
            .billOrder(this.order)
            .then( (x : Order) => {
                this.order = x;
                this.notification.success('Pedido faturado com sucesso!') ;              
                this.ea.publish('orderBilled', x);
                this.controller.ok();    
                this.processing = false;       
            })
            .catch( e => {
                this.notification.presentError(e); 
                this.processing = false;
            });     
    } 

    cancel(){
        this.controller.cancel();
    } 
}