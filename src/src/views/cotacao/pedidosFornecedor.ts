import { inject, NewInstance} from 'aurelia-framework';
import { NotificationService } from '../../services/notificationService';
import { Identity } from '../../domain/identity';
import { IdentityService } from '../../services/identityService';
import { FoodService } from '../../domain/foodService';
import { Aurelia, autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { Rest, Config } from 'aurelia-api';
import { OrderRepository } from '../../repositories/orderRepository';
import { SupplierOrder } from '../../domain/supplierOrder';

@autoinject
export class PedidosFornecedor{

    orders                      : SupplierOrder[];
    selectedOrder               : SupplierOrder;
    showdDetails                : boolean;
    foodService                 : FoodService;

    constructor(		
        private router                  : Router, 	 
		private service                 : IdentityService,
		private nService                : NotificationService,
        private orderRepo               : OrderRepository) { 

    } 

    attached(){

        this.loadData();
    }

    loadData(){

        this.orderRepo
            .myOrders()
            .then( (x : SupplierOrder[]) =>{
                this.orders = x;
            })
            .catch( e => {
                this.nService.presentError(e); 
            });
    }

    selectOrder(order : SupplierOrder){
        this.selectedOrder = order;
        this.foodService = order.foodService;
        this.showdDetails = true;
    }

    showOrders(){
        this.showdDetails = false;
    }
}