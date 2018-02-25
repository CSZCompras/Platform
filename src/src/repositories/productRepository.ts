import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Rest, Config } from 'aurelia-api'; 
import { ProductCategory } from './../domain/productCategory';
import { ProductClass } from './../domain/productClass';
import { Product } from "../domain/product";


@autoinject
export class ProductRepository{ 

    api: Rest;

    constructor(private config: Config) {
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
}