import { Supplier } from '../domain/supplier';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Rest, Config } from 'aurelia-api';

import { Identity } from '../domain/identity';
import { Credential } from "../domain/credential";
import { SupplierProduct } from '../domain/supplierProduct';
import { IdentityService } from '../services/identityService';
import { SupplierStatus } from '../domain/supplierStatus';
import { EditSupplierStatus } from '../domain/editSupplierStatus';

@autoinject
export class SupplierRepository {
 
    api: Rest;

    constructor(private config: Config, private client : HttpClient, private service : IdentityService) {
        this.api = this.config.getEndpoint('csz');
    }

    uploadSocialContract(file : any, supplierId : string) : Promise<any>{ 

        /* Usando o http client na mão, pois, não consegui sobreescrever as configs default do API*/
        this.client.configure(config => {
            config.withBaseUrl(this.api.client.baseUrl);
        });

        this.client.defaults.headers = {};

        let headers = new Headers();        
        headers.append('Accept', 'application/json'); 

        return this.client
            .fetch('uploadSupplierContractSocial?supplierId=' + supplierId, { 
                method: 'POST', 
                body: file,    
                headers   :  headers
            })
            .then(response => {      
                if(response.status != 200){
                    throw "Erro";
                }           
                return response;
            })
            .then(data => {         
                return data;
            })
            .catch( (e) => {
                console.log(e);
                return Promise.resolve(e.json().then( error => { 
                    throw error;
                })); 
            });
    }

    updateStatus(supplierId : string, status : SupplierStatus) : Promise<any>{

        var vm = new EditSupplierStatus();
        vm.supplierId = supplierId;
        vm.status = status;

        return this.api
            .post('supplierStatus', vm)
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