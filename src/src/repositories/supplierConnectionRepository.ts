import { Supplier } from '../domain/supplier';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Rest, Config } from 'aurelia-api';
import { Identity } from '../domain/identity';
import { Credential } from "../domain/credential";
import { FoodServiceSupplier } from '../domain/foodServiceSupplier';
import { SupplierViewModel } from '../domain/supplierViewModel';

@autoinject
export class SupplierConnectionRepository { 
       
    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('csz');
    }

    getSuggestedSuppliers() : Promise<SupplierViewModel[]>  {

        return this.api
                    .find('suggestedSupplier')
                    .then( (result : Promise<SupplierViewModel[]>) => {                 
                        return result;
                    })
                    .catch( (e) => {
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    }

    

    connect(supplier : Supplier) : Promise<FoodServiceSupplier>  {

        return this.api
                    .post('supplierConnection',supplier)
                    .then( (result : Promise<FoodServiceSupplier>) => {                 
                        return result;
                    })
                    .catch( (e) => {
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    }

    getMySuppliers(): any {

        return this.api
                    .find('mySuppliers')
                    .then( (result : Promise<SupplierViewModel[]>) => {                 
                        return result;
                    })
                    .catch( (e) => {
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    }

    getAllSuppliers() : any {

        return this.api
                    .find('foodServiceSuppliers')
                    .then( (result : Promise<SupplierViewModel[]>) => {                 
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