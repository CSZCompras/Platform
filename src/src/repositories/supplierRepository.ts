import { Supplier } from '../domain/supplier';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Rest, Config } from 'aurelia-api';

import { Identity } from '../domain/identity';
import { Credential } from "../domain/credential";
import { SupplierProduct } from '../domain/supplierProduct';

@autoinject
export class SupplierRepository {

    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('csz');
    }


    get(id : string){
        
        return this.api
            .find('supplier?supplierId=' + id)
            .then( (result : Promise<Supplier>) => {                 
                return result;
            })
            .catch( (e) => {
                console.log(e);
                return Promise.resolve(e.json().then( error => {
                    throw error;
                }));
            });

    }

    getSupplier() : Promise<Supplier> {
        
        return this.api
            .find('supplier')
            .then( (result : Promise<Supplier>) => {                 
                return result;
            })
            .catch( (e) => {
                console.log(e);
                return Promise.resolve(e.json().then( error => {
                    throw error;
                }));
            });
    }


    getAllSuppliers() : Promise<Supplier[]> {
        
        return this.api
            .find('allSuppliers')
            .then( (result : Promise<Supplier[]>) => {                 
                return result;
            })
            .catch( (e) => {
                console.log(e);
                return Promise.resolve(e.json().then( error => {
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
                    throw error;
                }));
            });
    } 

    addProduct(product : SupplierProduct) : Promise<any> {

        return this.api
            .post('supplierProduct', product)
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