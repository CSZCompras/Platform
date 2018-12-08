import { FoodService } from '../domain/foodService';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Rest, Config } from 'aurelia-api';
import { Identity } from '../domain/identity';
import { Credential } from "../domain/credential";
import { SimulationResult } from '../domain/simulationResult'; 
import { Order } from '../domain/order';
import { RejectOrderViewModel } from '../domain/rejectOrderViewModel';
import { Evaluation } from '../domain/evaluation';


@autoinject
export class OrderRepository{ 

    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('csz');
    }

    createOrder(result : SimulationResult) : Promise<any>{

        return this.api
                    .post('Order', result)
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