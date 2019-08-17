import { SupplierProductFile } from '../domain/supplierProductFile';
import { IdentityService } from '../services/identityService';
import { SupplierProduct } from '../domain/supplierProduct';
import { autoinject } from 'aurelia-framework'; 
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


    addOrUpdate(product : Product) : Promise<any> {

        return this.api
                .post('product', product)
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

    

    getAllProductsByCategory(category : string ) : Promise<Product[]> {

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

    getOfferedProducts(categoryId : string): Promise<Product[]> {

        return this.api
                .find('productByCategory?categoryId=' + categoryId)
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

    

    getAllSuplierProducts(categoryId : string) : Promise<SupplierProduct[]> {
        
        return this.api
            .find('supplierProduct?categoryId=' + categoryId)
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

    alterSuplierProduct(supplierProduct : Array<SupplierProduct>): Promise<any> { 
        
        var list = [];

        supplierProduct.forEach(x =>{

            var viewModel = {
                id : x.id,
                status : x.status,            
                price :  x.price
            }; 

            list.push(viewModel);
        })

        return this.api 
            .post('AlterSuplierProduct', list)
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

        this.client.defaults.headers = {};

        let headers = new Headers();        
        headers.append('Accept', 'application/json'); 

        var userId = this.service.getIdentity().id;

        return this.client
            .fetch('uploadSupplierProducts?userId=' + userId, { 
                method: 'POST', 
                body: file,
                headers : headers    
            })
            .then(response => {      
                if(response.status != 200){
                    throw "Erro";
                }           
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