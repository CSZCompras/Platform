import { FoodService } from '../domain/foodService';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Rest, Config } from 'aurelia-api';
import { Identity } from '../domain/identity';
import { Credential } from "../domain/credential";
import { FoodServiceProduct } from '../domain/foodServiceProduct';
import { BuyList } from '../domain/buyList';
import { AlterBuyListProductViewModel } from '../domain/alterBuyListProductViewModel';
import { FoodServiceStatus } from '../domain/foodServiceStatus';
import { EditFoodServiceStatus } from '../domain/editFoodServiceStatus';
import { CotacaoViewModel } from '../domain/cotacaoViewModel';

@autoinject
export class FoodServiceRepository {
    
    
	
    api: Rest;

    constructor(private config: Config, private client : HttpClient) {
        this.api = this.config.getEndpoint('csz');
    }


    getByUser(userId : string) : Promise<FoodService> {
        
        return this.api
            .find('foodServiceByUser?userId=' + userId)
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


    get(id : string) : Promise<FoodService> {
        
        return this.api
            .find('foodService?supplierId=' + id)
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

    getAll()  : Promise<FoodService[]> {

        return this.api
            .find('allFoodServices')
            .then( (result : Promise<FoodService[]>) => {     
                return result;
            })
            .catch( (e) => {
                console.log(e);
                return Promise.resolve(e.json().then( error => {
                    throw error;
                }));
            });
    }

    save(foodService : FoodService) : Promise<FoodService> {
        
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

    getProductsByMarket(classId : string) : Promise<FoodServiceProduct[]> {

        return this.api
            .find('foodServiceProduct?marketId='+ classId)
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

    getBuyListsParaCotacao(): Promise<CotacaoViewModel[]> {

        return this.api
            .find('cotacao')
            .then( (result : Promise<CotacaoViewModel[]>) => { 
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

        if(buyList.productClass.categories != null){
            buyList.productClass.categories = [];
        }

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

    deleteBuyList(buyList : BuyList) : Promise<any>{
        return this.api
            .destroy('buyList?id=' + buyList.id)
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

    
    updateStatus(foodServiceId : string, status : FoodServiceStatus) : Promise<any>{

        var vm = new EditFoodServiceStatus();
        vm.foodServiceId = foodServiceId;
        vm.status = status;

        return this.api
            .post('foodServiceStatus', vm)
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

    uploadSocialContract(file : any, foodServiceId : string) : Promise<any>{ 

        /* Usando o http client na mão, pois, não consegui sobreescrever as configs default do API*/
        this.client.configure(config => {
            config.withBaseUrl(this.api.client.baseUrl);
        });

        this.client.defaults.headers = {};

        let headers = new Headers();        
        headers.append('Accept', 'application/json'); 

        return this.client
            .fetch('uploadFoodServiceContractSocial?foodServiceId=' + foodServiceId, { 
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
}