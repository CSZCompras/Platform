import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Rest, Config } from 'aurelia-api';
import { GenericAnalytics } from '../../domain/analytics/genericAnalytics';
import { AnalyticsSerie } from '../../domain/analytics/analyticsSerie';

@autoinject
export class AnalyticsRepository{

    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('csz');
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

    getOrdersValues()  : Promise<AnalyticsSerie>  {

        return this.api
            .find('analytics/supplier/ordersValues')
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