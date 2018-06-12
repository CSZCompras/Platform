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
import { EventAggregator } from 'aurelia-event-aggregator';
import { DialogService } from 'aurelia-dialog';
import { AceitePedido } from '../components/partials/aceitePedido';
import { SupplierOrderStatus } from '../../domain/supplierOrderStatus';
import { Order } from '../../domain/order';

@autoinject
export class PedidosFoodService{

    filteredOrders              : Order[];
    orders                      : Order[];
    selectedOrder               : Order;
    showdDetails                : boolean;
    filter                      : string;
    selectedStatus              : number;
    isFiltered                  : boolean;

    constructor(		
        private router                  : Router, 	 
        private dialogService           : DialogService,
        private ea                      : EventAggregator,
		private service                 : IdentityService,
		private nService                : NotificationService,
        private orderRepo               : OrderRepository) { 

    } 

    attached(){

        this.loadData();
    }

    loadData(){

       this.load();
    }

    selectOrder(order : Order){
        this.selectedOrder = order;
        this.showdDetails = true;
    }

    showOrders(){
        this.showdDetails = false;
    }

    load(){ 
        
        if(this.selectedStatus == SupplierOrderStatus.Created || this.selectedStatus == null){

            this.orderRepo
                .getNyNewOrders()
                .then( (x : Order[]) =>{
                    this.orders = x;
                    this.filteredOrders = this.orders;
                    this.filter = '';
                })
                .catch( e => {
                    this.nService.presentError(e); 
                });

        }
        else if(this.selectedStatus == SupplierOrderStatus.Accepted){

            this.orderRepo
                .getNyAcceptedOrders()
                .then( (x : Order[]) =>{

                    this.orders = x;
                    this.filteredOrders = this.orders;
                    this.filter = '';
                })
                .catch( e => {
                    this.nService.presentError(e); 
                });
        }

        
    } 

    search(){ 
            
        this.isFiltered = true;
 

            this.filteredOrders = this.orders.filter( (x : Order) =>{

                var isFound = true;

                if( (this.filter != null && this.filter != '')){ 

                    if( 
                            (x.code.toString().toUpperCase().includes(this.filter.toUpperCase()))
                        ||  (x.foodService.name.toString().toUpperCase().includes(this.filter.toUpperCase()))
                        ||  (x.createdBy.name.toString().toUpperCase().includes(this.filter.toUpperCase()))
                        ||  (x.total.toString().toUpperCase().includes(this.filter.toUpperCase()))
                    ){
                        isFound = true;
                    }
                    else {
                        isFound= false;
                    }
                }

                if(isFound){
                    return x;
                } 

            });
        }
} 