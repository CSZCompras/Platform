import { StateRegistration } from '../domain/stateRegistration';
import { Supplier } from '../domain/supplier';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Rest, Config } from 'aurelia-api'; 

@autoinject
export class StateRegistrationRepository {

    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('csz');
    }


    getAll() : Promise<StateRegistration[]> {
        
        return this.api
            .find('stateRegistration')
            .then( (result : Promise<StateRegistration[]>) => {                 
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