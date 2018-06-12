import { FoodService } from '../domain/foodService';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Rest, Config } from 'aurelia-api';
import { Identity } from '../domain/identity';
import { Credential } from "../domain/credential";
import { FoodServiceProduct } from '../domain/foodServiceProduct';
import { BuyList } from '../domain/buyList';
import { AlterBuyListProductViewModel } from '../domain/alterBuyListProductViewModel';

@autoinject
export class FoodServiceRepository {
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

    getProducts() : Promise<FoodServiceProduct[]> {

        return this.api
            .find('foodServiceProduct')
            .then( (result : Promise<FoodServiceProduct[]>) => {                 
                return result;
            })
            .catch( (e) => {
                console.log(e);
                return Promise.resolve(e.json().then( error => {
                    throw error;
                }));
            });
    }

    getLists() : Promise<BuyList[]> {

        return this.api
            .find('buyList')
            .then( (result : Promise<BuyList[]>) => { 
                return result;
            })
            .catch( (e) => {
                console.log(e);
                return Promise.resolve(e.json().then( error => {
                    throw error;
                }));
            });
    }

    addProduct(product : FoodServiceProduct) : Promise<any> {

        return this.api
            .post('foodServiceProduct', product)
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
    

    inativateProduct(product : FoodServiceProduct) : Promise<any>  {
        
        return this.api
                .post('inativateFoodServiceProduct', product)
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

    addBuyList(buyList : BuyList) : Promise<BuyList>{
        return this.api
            .post('buyList', buyList)
            .then( (result : Promise<BuyList>) => {                 
                return result;
            })
            .catch( (e) => {
                console.log(e);
                return Promise.resolve(e.json().then( error => {
                    throw error;
                }));
            });
    }

    alterBuyList(viewModel : AlterBuyListProductViewModel) : Promise<any> {
        return this.api
            .post('alterBuyListProduct', viewModel)
            .then( (result : Promise<BuyList>) => {                 
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