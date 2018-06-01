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
import { BuyList } from '../domain/buyList';
import { Simulation } from '../domain/simulation';
import { SimulationInput } from '../domain/simulationInput';

@autoinject
export class SimulationRepository{

    api: Rest;

    constructor(private config: Config, private client : HttpClient, private service : IdentityService) {
        this.api = this.config.getEndpoint('csz');
    }


    simulate(input : SimulationInput) :  Promise<Simulation> {
        
        return this.api
            .post('simulation', input)
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

}
