import { IdentityService } from '../services/identityService';
import { autoinject } from 'aurelia-framework'; 
import { Rest, Config } from 'aurelia-api'; 
import { ProductClass } from './../domain/productClass';
import { HttpClient } from 'aurelia-fetch-client';
import { Brand } from '../domain/brand';


@autoinject
export class BrandRepository{
    
    api: Rest;

    constructor(private config: Config, private service : IdentityService) {
        this.api = this.config.getEndpoint('csz');
    }

    addOrUpdateBrand(brand: Brand) : Promise<Brand>{

        return this.api
                    .post('brand', brand)
                    .then( (result : Promise<Brand>) => {                 
                        return result;
                    })
                    .catch( (e) => {
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    } 

    getAllBrands() : Promise<Brand[]> {

        return this.api
                .find('brand')
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
}