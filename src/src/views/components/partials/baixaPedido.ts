import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog'; 
import { EventAggregator } from 'aurelia-event-aggregator';
import { NotificationService } from '../../../services/notificationService'; 
import { OrderRepository } from '../../../repositories/orderRepository'; 
import { Order } from '../../../domain/order';
import { OrderStatus } from '../../../domain/orderStatus';
import { Evaluation } from '../../../domain/evaluation';
import { EvaluationRepository } from '../../../repositories/evaluationRepository';

@autoinject
export class BaixaPedido{

    order                                   : Order;
    controller                              : DialogController;  
    notaAvaliacao                           : number;
    evaluation                              : Evaluation;
    processing                              : boolean;

    constructor(
        pController                         : DialogController, 
        private ea                          : EventAggregator,
        private evalRepository              : EvaluationRepository,
        private notification                : NotificationService,
        private orderRepo                   : OrderRepository){ 

        this.processing = false;
 
        this.controller = pController;   
        this.order = new Order();
        this.evaluation = new Evaluation();
    }    

    activate(params){  

        if(params.Order != null){

            this.order = params.Order;
            this.evaluation.order = this.order;
        }
    }

    acceptOrder(){

        this.processing = true;
  
        this.evalRepository
            .finishOrder(this.evaluation)
            .then( (x : Order[]) => {

                this.notification.success('Pedido baixado com sucesso!');   
                this.order.status = OrderStatus.Accepted;
                this.controller.ok();                           
                this.processing = false;
            })
            .catch( e => {
                this.notification.presentError(e); 
                this.processing = false;
            }); 

    }

    setAvaliacao(nota : number){
        this.notaAvaliacao = nota;
        this.evaluation.rating = nota;
    }
 

    cancel(){
        this.controller.cancel();
    } 
}