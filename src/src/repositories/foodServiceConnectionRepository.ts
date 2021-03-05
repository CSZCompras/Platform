import { autoinject } from 'aurelia-framework'; 
import { Rest, Config } from 'aurelia-api'; 
import { FoodServiceSupplier } from '../domain/foodServiceSupplier'; 
import { FoodServiceConnectionViewModel } from '../domain/foodServiceConnectionViewModel'; 

@autoinject
export class FoodServiceConnectionRepository { 
       
    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('apiAddress');
    }

    getFoodServiceConnection(supplierId : string) : Promise<FoodServiceSupplier> {
        return this.api
                    .find('foodServiceSupplierConnection?supplierId=' + supplierId)
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

    

    getSupplierConnection(foodServiceId : string) : Promise<FoodServiceSupplier> {
        return this.api
                    .find('foodServiceSupplierConnection?foodServiceId=' + foodServiceId)
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

    getSupplierConnections(queryType : number) : Promise<FoodServiceConnectionViewModel[]>  {

        return this.api
                    .find('foodServiceConnection?queryType=' + queryType)
                    .then( (result : Promise<FoodServiceConnectionViewModel[]>) => {                 
                        return result;
                    })
                    .catch( (e) => {
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    }
    
    updateConnection(connection : FoodServiceConnectionViewModel) : Promise<any>  {

        return this.api
                    .post('foodServiceConnection', connection)
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