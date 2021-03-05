import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog'; 
import { EventAggregator } from 'aurelia-event-aggregator';
import { ValidationControllerFactory, ValidationController, validateTrigger, ValidationRules, ControllerValidateResult } from 'aurelia-validation'; 
import { NotificationService } from '../../../services/notificationService'; 
import { OrderRepository } from '../../../repositories/orderRepository';
import { FormValidationRenderer } from '../../formValidationRenderer';
import { Order } from '../../../domain/order';
import { OrderStatus } from '../../../domain/orderStatus';
import { FoodServiceConnectionRepository } from '../../../repositories/foodServiceConnectionRepository';
import { FoodServiceSupplier } from '../../../domain/foodServiceSupplier';
import { FoodServiceConnectionViewModel } from '../../../domain/foodServiceConnectionViewModel';
import { FoodService } from '../../../domain/foodService';

@autoinject
export class AceitePedido{

    order                                   : Order;
    controller                              : DialogController;  
    validationController                    : ValidationController;
    processing                              : boolean;
    connection                              : FoodServiceSupplier;

    constructor(
        pController                         : DialogController, 
        private validationControllerFactory : ValidationControllerFactory,
        private ea                          : EventAggregator,
        private notification                : NotificationService,
        private connectionRepository        : FoodServiceConnectionRepository,
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

    attached(){
        this.loadData();
    }

    loadData(){
        
        this.connectionRepository
            .getSupplierConnection(this.order.foodService.id)
            .then( (x  : FoodServiceSupplier) => {
                this.connection = x;

                if(this.connection != null && this.connection.paymentTerm != null && this.connection.paymentTerm > 0){
                    this.setPaymentDate();
                }
            })
            .catch( e => {
                this.notification.presentError(e); 
                this.processing = false;
            });
    }

    setPaymentDate(){
        let deliveryDate = new Date(this.order.deliveryDate);
        var numberOfDaysToAdd = Number.parseInt(this.connection.paymentTerm.toString());
        deliveryDate.setDate(deliveryDate.getDate() + numberOfDaysToAdd);        
        this.order.paymentDate = new Date(deliveryDate.getFullYear(), deliveryDate.getMonth(), deliveryDate.getDate()); 
    }

    updatePaymentDate(){

        if(this.order.paymentDate != null && <any> this.order.paymentDate != ''){

            if(this.order.paymentDate < this.order.deliveryDate){
                this.setPaymentDate();
                this.notification.error('A data de pagamento deve ser posterior a data de entrega');
            }
            else{                
            
                const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                let deliveryDate = new Date(this.order.deliveryDate);
                let paymentDate = new Date(this.order.paymentDate);
                const diffDays = Math.round(Math.abs(( (<any> deliveryDate - <any> paymentDate) / oneDay)));
                this.connection.paymentTerm = diffDays;
            }
        }
    }

    savePaymentTerm(){
        var vm = new FoodServiceConnectionViewModel();
        vm.foodService = new FoodService();
        vm.foodService.id = this.connection.foodServiceId;
        vm.paymentTerm = this.connection.paymentTerm;
        vm.priceListId = this.connection.priceListId;
        vm.status = this.connection.status;

        this.connectionRepository
            .updateConnection(vm)
            .then( _ => this.notification.success('Prazo alterado com sucesso!'))
            .catch( e => {
                this.notification.presentError(e); 
                this.processing = false;
            });
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