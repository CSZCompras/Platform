import { autoinject } from 'aurelia-framework';
import { Rest, Config } from 'aurelia-api'; 
import { Order } from '../domain/order';
import { SimulationResult } from '../domain/simulation/simulationResult';
import { RejectOrderViewModel } from '../domain/rejectOrderViewModel';


@autoinject
export class OrderRepository{

    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('csz');
    }

    createOrder(results : SimulationResult[]) : Promise<any>{

        return this.api
                    .post('Order', results)
                    .then( (result : any) => {                 
                        return result;
                    })
                    .catch( (e) => {
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    }

    getMyNewOrders(): Promise<any>{

        return this.api
                    .find('MyNewOrders')
                    .then( (result : any) => {                 
                        return result;
                    })
                    .catch( (e) => {
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    }

    getMyAcceptedOrders(): Promise<any>{

        return this.api
                    .find('MyAcceptedOrders')
                    .then( (result : any) => {                 
                        return result;
                    })
                    .catch( (e) => {
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    }

    getMyRejectedOrders(): Promise<any>{

        return this.api
                    .find('MyRejectedOrders')
                    .then( (result : any) => {                 
                        return result;
                    })
                    .catch( (e) => {
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    }

    getMyDeliveredOrders(): Promise<any>{

        return this.api
                    .find('MyDeliveredOrders')
                    .then( (result : any) => {                 
                        return result;
                    })
                    .catch( (e) => {
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    }

    billOrder(order: Order) : Promise<Order> {

        return this.api
                    .post('billOrder', order)
                    .then( (result : Order) => {                 
                        return result;
                    })
                    .catch( (e) => {
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    } 

    acceptOrder(order : Order): Promise<any>{

        return this.api
                    .post('acceptOrder', { id : order.id, deliveryDate : order.deliveryDate, paymentDate : order.paymentDate })
                    .then( (result : any) => {                 
                        return result;
                    })
                    .catch( (e) => {
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });

    }
    
    rejectOrder(vm : RejectOrderViewModel) : Promise<any> {

         return this.api
                    .post('rejectOrder', vm)
                    .then( (result : any) => {                 
                        return result;
                    })
                    .catch( (e) => {
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    }

}