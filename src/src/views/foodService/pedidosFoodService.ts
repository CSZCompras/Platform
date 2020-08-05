import { NotificationService } from '../../services/notificationService'; 
import { IdentityService } from '../../services/identityService'; 
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Rest, Config } from 'aurelia-api';
import { OrderRepository } from '../../repositories/orderRepository'; 
import { EventAggregator } from 'aurelia-event-aggregator';
import { DialogService } from 'aurelia-dialog'; 
import { Order } from '../../domain/order';
import { OrderStatus } from '../../domain/orderStatus';
import { BaixaPedido } from '../components/partials/baixaPedido';

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
        private config                  : Config,
		private service                 : IdentityService,
		private nService                : NotificationService,
        private orderRepo               : OrderRepository) { 

    } 

    attached(){

        this.ea.publish('loadingData'); 

        this.ea.subscribe('orderAccepted', (data : Order)=>{

           this.orders.forEach(x => {

                if(x.id == data.id){
                    x = data;
                }
            }); 
            
            this.filteredOrders.forEach(x => {

                if(x.id == data.id){
                    x.status = data.status;
                    x.deliveryDate = data.deliveryDate;
                    x.paymentDate = data.paymentDate;
                }
            });  
        });
         
        this.ea.subscribe('orderRejected', (data : Order)=>{

            var isFound = false; 

            this.orders.forEach(x => {
 
                 if(x.id == data.id){
                     x.status = data.status;
                     x.reasonToReject = data.reasonToReject;
                     isFound = true;
                 }
             }); 

             if(! isFound && (this.selectedStatus == 3 || this.selectedStatus.toString() == "3")){
                this.orders.push(data);                      
            } 
         });

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
                    this.ea.publish('dataLoaded');
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
                    this.ea.publish('dataLoaded');
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
                    this.ea.publish('dataLoaded');
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

    quoteAgain(order : Order){

        this.router.navigate('cotacao?orderId=' + order.id);
    }

    deliverOrder(order : Order){

        var params = { Order : order};

        this.dialogService
            .open({ viewModel: BaixaPedido, model: params, lock: false })
            .whenClosed(response => {
                if (response.wasCancelled) {
                    return;
                } 
                order.status = OrderStatus.Delivered; 
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

    exportOrder(order : Order){ 
        var api = this.config.getEndpoint('apiAddress');
        window.open(api.client.baseUrl + 'ExportOrderToExcel?orderId=' + order.id, '_parent');
    }
} 