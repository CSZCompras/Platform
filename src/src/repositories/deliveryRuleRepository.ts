import { autoinject } from 'aurelia-framework'; 
import { Rest, Config } from 'aurelia-api'; ; 
import { DeliveryRule } from '../domain/deliveryRule';
import { CheckDeliveryViewModel } from '../domain/checkDeliveryViewModel';
import { CheckDeliveryResult } from '../domain/checkDeliveryResult';

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

    checkDeliveryRule(rule : CheckDeliveryViewModel) : Promise<CheckDeliveryResult>{

        return this.api
            .post('checkDelivery', rule)
            .then( (result : Promise<CheckDeliveryResult>) => {                 
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