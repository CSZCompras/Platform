import { FoodService } from '../domain/foodService';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Rest, Config } from 'aurelia-api';
import { Identity } from '../domain/identity';
import { Credential } from "../domain/credential";
import { SimulationResult } from '../domain/simulationResult';
import { SupplierOrder } from '../domain/supplierOrder';


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

    getNyNewOrders(): Promise<any>{

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

    getNyAcceptedOrders(): Promise<any>{

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

    acceptOrder(order : SupplierOrder): Promise<any>{

        return this.api
                    .post('acceptOrder', { id : order.id })
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