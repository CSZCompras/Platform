import { Supplier } from '../domain/supplier';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Rest, Config } from 'aurelia-api';

import { Identity } from '../domain/identity';
import { Credential } from "../domain/credential";

@autoinject
export class SupplierRepository {

    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('csz');
    }


    getSupplier(userId : string) : Promise<Supplier> {
        
        return this.api
            .find('supplier?userId=' + userId)
            .then( (result : Promise<Supplier>) => {                 
                return result;
            })
            .catch( (e) => {
                console.log(e);
                return Promise.resolve(e.json().then( error => {
                    debugger;
                    throw error;
                }));
            });
    }

    save(supplier : Supplier) : Promise<any> {
        
        return this.api
            .post('supplier', supplier)
            .then( (result : Promise<any>) => {    
                if(result == null)             
                    return Promise.resolve();
                return result;
            })
            .catch( (e) => {
                console.log(e);
                return Promise.resolve(e.json().then( error => {
                    debugger;
                    throw error;
                }));
            });
    }
}