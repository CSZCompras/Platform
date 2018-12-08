import { inject, NewInstance} from 'aurelia-framework';
import { NotificationService } from '../../services/notificationService';
import { Identity } from '../../domain/identity';
import { IdentityService } from '../../services/identityService';
import { FoodService } from '../../domain/foodService';
import { Aurelia, autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { Rest, Config } from 'aurelia-api';
import { OrderRepository } from '../../repositories/orderRepository';  
import { EventAggregator } from 'aurelia-event-aggregator';
import { DialogService } from 'aurelia-dialog';
import { AceitePedido } from '../components/partials/aceitePedido'; 
import { Order } from '../../domain/order';
import { OrderStatus } from '../../domain/orderStatus';
import { RejeicaoPedido } from '../components/partials/rejeicaoPedido';

@autoinject
export class PedidosFornecedor{

    filteredOrders              : Order[];
    orders                      : Order[];
    selectedOrder               : Order;
    showdDetails                : boolean;
    foodService                 : FoodService;
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

            this.selectedStatus = 0;

    } 

    attached(){

        this.ea.publish('loadingData'); 

        this.ea.subscribe('newOrder', (data : Order)=>{

            if(  this.selectedStatus == 0 ||  this.selectedStatus.toString() == "0"){
                this.orders.push(data);
            }
        });

        

        this.ea.subscribe('orderFinished', (data : Order)=>{

            debugger;

            this.orders.forEach(x => {

                if(x.id == data.id){
                    x = data;
                }
            }); 
            
            this.filteredOrders.forEach(x => {

                if(x.id == data.id){
                    x.status = data.status; 
                }
            });  
        });

        this.loadData();
    } 

    loadData(){

        this.load();
     }

    load(){

        if(this.selectedStatus == OrderStatus.Created || this.selectedStatus == null){

            this.orderRepo
                .getMyNewOrders()
                .then( (x : Order[]) =>{
                    this.orders = x;
                    this.filteredOrders = this.orders;
                    this.filter = '';
                })
                .then( () => this.ea.publish('dataLoaded'))
                .catch( e => {
                    this.nService.presentError(e); 
                });

        }
        else if(this.selectedStatus == OrderStatus.Accepted){

            this.orderRepo
                .getMyAcceptedOrders()
                .then( (x : Order[]) =>{
                    this.orders = x;
                    this.filteredOrders = this.orders;
                    this.filter = '';
                })
                .then( () => this.ea.publish('dataLoaded'))
                .catch( e => {
                    this.nService.presentError(e); 
                });
        }
        else if(this.selectedStatus == OrderStatus.Rejected){

            this.orderRepo
                .getMyRejectedOrders()
                .then( (x : Order[]) =>{
                    this.orders = x;
                    this.filteredOrders = this.orders;
                    this.filter = '';
                })
                .then( () => this.ea.publish('dataLoaded'))
                .catch( e => {
                    this.nService.presentError(e); 
                });
        }
        else if(this.selectedStatus == OrderStatus.Delivered){

            this.orderRepo
                .getMyDeliveredOrders()
                .then( (x : Order[]) =>{
                    this.orders = x;
                    this.filteredOrders = this.orders;
                    this.filter = '';
                })
                .then( () => this.ea.publish('dataLoaded'))
                .catch( e => {
                    this.nService.presentError(e); 
                });
        }
    }

    selectOrder(order : Order){
        this.selectedOrder = order;
        this.foodService = order.foodService;
        this.showdDetails = true;
    }

    showOrders(){
        this.showdDetails = false;
    }

    acceptOrder(order : Order){

        var params = { Order : order};

        this.dialogService
            .open({ viewModel: AceitePedido, model: params, lock: false })
            .whenClosed(response => {
                if (response.wasCancelled) {
                    return;
                } 
               order.status = OrderStatus.Accepted; 
            });
    }  

    rejectOrder(order : Order){

        var params = { Order : order};

        this.dialogService
            .open({ viewModel: RejeicaoPedido, model: params, lock: false })
            .whenClosed(response => {
                if (response.wasCancelled) {
                    return;
                } 
               order.status = OrderStatus.Rejected; 
            });
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