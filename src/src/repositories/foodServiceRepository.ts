import { FoodService } from '../domain/foodService';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Rest, Config } from 'aurelia-api';
import { Identity } from '../domain/identity';
import { Credential } from "../domain/credential";

@autoinject
export class FoodServicerRepository {

    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('csz');
    }


    get(userId : string) : Promise<FoodService> {
        
        return this.api
            .find('foodService?userId=' + userId)
            .then( (result : Promise<FoodService>) => {                 
                return result;
            })
            .catch( (e) => {
                console.log(e);
                return Promise.resolve(e.json().then( error => {
                    throw error;
                }));
            });
    }

    save(foodService : FoodService) : Promise<any> {
        
        return this.api
            .post('foodService', foodService)
            .then( (result : Promise<any>) => {    
                if(result == null)             
                    return Promise.resolve();
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