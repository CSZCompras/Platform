import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Rest, Config } from 'aurelia-api';
import { GenericAnalytics } from '../../domain/analytics/genericAnalytics';
import { AnalyticsSerie } from '../../domain/analytics/analyticsSerie';
import { OrderPeriod } from '../../domain/analytics/orderPeriod';
import { Order } from '../../domain/order';
import { AnalyticsPeriod } from '../../domain/analytics/analyticsPeriod';
import { FoodServiceOrdersOverview } from '../../domain/analytics/foodServiceOrdersOverview';
import {  SupplierOrdersOverview } from '../../domain/analytics/supplierOrdersOverview';

@autoinject
export class AnalyticsRepository{
	
    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('apiAddress');
    } 

    getOrders(start : string, end : string) : Promise<Order[]>{
        
        return this.api 
                    .find('analytics/admin/orders?dateStart=' + start + '&dateEnd=' + end)                    
                    .then( (result : Order[]) =>  { return result; })
                    .catch( (e) => {
                        debugger;
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    } 

    getNewSuppliers(start : string, end : string) : Promise<SupplierOrdersOverview[]>{
        
        return this.api 
                    .find('analytics/admin/supplierCreated?dateStart=' + start + '&dateEnd=' + end)                    
                    .then( (result : SupplierOrdersOverview[]) =>  { return result; })
                    .catch( (e) => {
                        debugger;
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    } 

    getNewFoodServices(start : string, end : string) : Promise<FoodServiceOrdersOverview[]>{
        
        return this.api 
                    .find('analytics/admin/foodServiceCreated?dateStart=' + start + '&dateEnd=' + end)                    
                    .then( (result : FoodServiceOrdersOverview[]) =>  { return result; })
                    .catch( (e) => {
                        debugger;
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    } 

    getFoodServiceOrders(start : string, end : string) : Promise<FoodServiceOrdersOverview[]>{
        
        return this.api 
                    .find('analytics/admin/foodServiceThatBuy?dateStart=' + start + '&dateEnd=' + end)                    
                    .then( (result : FoodServiceOrdersOverview[]) =>  { return result; })
                    .catch( (e) => {
                        debugger;
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    } 

    getSupplierOrders(start : string, end : string) : Promise<SupplierOrdersOverview[]>{
        
        return this.api 
                    .find('analytics/admin/supplierThatBuy?dateStart=' + start + '&dateEnd=' + end)                    
                    .then( (result : SupplierOrdersOverview[]) =>  { return result; })
                    .catch( (e) => {
                        debugger;
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    } 

    getOrdersAnalytics(start : string, end : string, period : AnalyticsPeriod) : Promise<AnalyticsSerie>{

        return this.api
                    .find('analytics/admin/numberOfOrders?dateStart=' + start + '&dateEnd=' + end + '&period=' + period) 
                        .then( (result : Promise<AnalyticsSerie>) => {                 
                            return result;
                        })
                        .catch( (e) => {
                            console.log(e);
                            return Promise.resolve(e.json().then( error => {
                                throw error;
                            }));
                        });
    }

    getNumberOfCustomers()  : Promise<GenericAnalytics>  {

        return this.api
            .find('analytics/supplier/numberOfCustomers')
            .then( (result : Promise<GenericAnalytics>) => {                 
                return result;
            })
            .catch( (e) => {
                console.log(e);
                return Promise.resolve(e.json().then( error => {
                    throw error;
                }));
            });
    }

    getNumberOfOrders()  : Promise<GenericAnalytics>  {

        return this.api
            .find('analytics/supplier/numberOfOrders')
            .then( (result : Promise<GenericAnalytics>) => {                 
                return result;
            })
            .catch( (e) => {
                console.log(e);
                return Promise.resolve(e.json().then( error => {
                    throw error;
                }));
            });
    } 

    getOrdersValues(period : OrderPeriod)  : Promise<AnalyticsSerie[]>  {

        return this.api
            .find('analytics/supplier/ordersValues?period=' + period)
            .then( (result : Promise<AnalyticsSerie[]>) => {                 
                return result;
            })
            .catch( (e) => {
                console.log(e);
                return Promise.resolve(e.json().then( error => {
                    throw error;
                }));
            });
    }
    
    getMainClients(period : OrderPeriod)  : Promise<AnalyticsSerie>  {

        return this.api
            .find('analytics/supplier/clients?period=' + period)
            .then( (result : Promise<AnalyticsSerie>) => {                 
                return result;
            })
            .catch( (e) => {
                console.log(e);
                return Promise.resolve(e.json().then( error => {
                    throw error;
                }));
            });
    }

    getMainProducts()  : Promise<AnalyticsSerie>  {

        return this.api
            .find('analytics/supplier/products')
            .then( (result : Promise<AnalyticsSerie>) => {                 
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