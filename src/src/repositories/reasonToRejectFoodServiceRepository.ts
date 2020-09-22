import { IdentityService } from '../services/identityService';
import { autoinject } from 'aurelia-framework'; 
import { Rest, Config } from 'aurelia-api';  
import { HttpClient } from 'aurelia-fetch-client';

@autoinject
export class ReasonToRejectFoodServiceRepository{

    api: Rest;

    constructor(private config: Config, private client : HttpClient, private service : IdentityService) {
        this.api = this.config.getEndpoint('apiAddress');
    }


    getAllActiveReasons() : Promise<ReasonToRejectFoodService[]> {

        return this.api
                .find('reasonsToRejectFoodService?showAll=false')
                .then( (result : Promise<any>) => {                 
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