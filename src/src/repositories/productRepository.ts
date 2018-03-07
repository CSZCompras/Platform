import { SupplierProductFile } from '../domain/supplierProductFile';
import { IdentityService } from '../services/identityService';
import { SupplierProduct } from '../domain/supplierProduct';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Rest, Config } from 'aurelia-api'; 
import { ProductCategory } from './../domain/productCategory';
import { ProductClass } from './../domain/productClass';
import { Product } from "../domain/product";
import { HttpClient } from 'aurelia-fetch-client';


@autoinject
export class ProductRepository{ 

    api: Rest;

    constructor(private config: Config, private client : HttpClient, private service : IdentityService) {
        this.api = this.config.getEndpoint('csz');
    }

    
    getAllCategories() : Promise<ProductCategory[]> {

        return this.api
                .find('productCategory')
                .then( (result : Promise<ProductCategory[]>) => {                 
                    return result;
                })
                .catch( (e) => {
                    console.log(e);
                    return Promise.resolve(e.json().then( error => { 
                        throw error;
                    })); 
                }); 
    }

    getAllClasses() : Promise<ProductClass[]> {

        return this.api
                .find('productClass')
                .then( (result : Promise<ProductClass[]>) => {                 
                    return result;
                })
                .catch( (e) => {
                    console.log(e);
                    return Promise.resolve(e.json().then( error => { 
                        throw error;
                    })); 
                });
    }

    

    getAllProducts() : Promise<Product[]> {

        return this.api
                .find('product')
                .then( (result : Promise<Product[]>) => {                 
                    return result;
                })
                .catch( (e) => {
                    console.log(e);
                    return Promise.resolve(e.json().then( error => { 
                        throw error;
                    })); 
                });
    }

    addSuplierProduct(supplierProduct : SupplierProduct) : Promise<SupplierProduct> {
        
        return this.api
            .post('SupplierProduct', supplierProduct)
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

    

    getAllSuplierProducts() : Promise<SupplierProduct[]> {
        
        return this.api
            .find('supplierProduct')
            .then( (result : Promise<SupplierProduct[]>) => {                 
                    return result;
                })
                .catch( (e) => {
                    console.log(e);
                    return Promise.resolve(e.json().then( error => { 
                        throw error;
                    })); 
                });
    }

    alterSuplierProduct(supplierProduct : SupplierProduct): Promise<any> { 
        
        var viewModel = {
            id : supplierProduct.id,
            isActive : supplierProduct.isActive,            
            price :  supplierProduct.price
        }; 

        return this.api 
            .post('AlterSuplierProduct', viewModel)
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

    uploadFile(file) : Promise<any>{ 

        /* Usando o http client na mão, pois, não consegui sobreescrever as configs default do API*/
        this.client.configure(config => {
            config.withBaseUrl(this.api.client.baseUrl);
        });

        let headers = new Headers();

        var userId = this.service.getIdentity().id;

        return this.client
            .fetch('uploadSupplierProducts?userId=' + userId, { 
                method: 'POST', 
                body: file
            })
            .then(response => {                 
                return response.json();
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

    getAllSuplierProductFiles() : Promise<SupplierProductFile[]>{
        debugger;
        
        return this.api
                    .find('supplierProductFile')
                    .then( (result : Promise<SupplierProductFile[]>) => {                 
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