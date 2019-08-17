import { PriceList } from '../domain/priceList';
import { MarketRule } from '../domain/marketRule';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Rest, Config } from 'aurelia-api';
import { Identity } from '../domain/identity';
import { Credential } from "../domain/credential"; 
import { DeliveryRule } from '../domain/deliveryRule';

@autoinject
export class DeliveryRuleRepository{

    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('csz');
    }

    getRule(classId : string) : Promise<DeliveryRule> {
        
        return this.api
            .find('deliveryRule?productClassId=' + classId)
            .then( (result : Promise<DeliveryRule>) => {                 
                return result;
            })
            .catch( (e) => {
                console.log(e);
                return Promise.resolve(e.json().then( error => {
                    throw error;
                }));
            });
    }

    save(rule : DeliveryRule) : Promise<DeliveryRule>{
        
        return this.api
            .post('deliveryRule', rule)
            .then( (result : Promise<DeliveryRule>) => {                 
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