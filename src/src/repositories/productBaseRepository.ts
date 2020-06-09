import { IdentityService } from '../services/identityService'; 
import { autoinject } from 'aurelia-framework'; 
import { Rest, Config } from 'aurelia-api'; 
import { ProductBase } from '../domain/productBase';
import { Product } from "../domain/product";
import { HttpClient } from 'aurelia-fetch-client';


@autoinject
export class ProductBaseRepository{
    

    api: Rest;

    constructor(private config: Config, private client : HttpClient, private service : IdentityService) {
        this.api = this.config.getEndpoint('csz');
    }


    getAllProductsByCategory(category : string ) : Promise<ProductBase[]> {

        return this.api
                .find('productSearch?categoryId=' + category)
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