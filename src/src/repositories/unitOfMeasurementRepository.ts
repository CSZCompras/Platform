import { Supplier } from '../domain/supplier';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Rest, Config } from 'aurelia-api';
import { Identity } from '../domain/identity';
import { Credential } from "../domain/credential";
import { SupplierProduct } from '../domain/supplierProduct';
import { UnitOfMeasurement } from '../domain/unitOfMeasurement';

@autoinject
export class UnitOfMeasurementRepository {

    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('apiAddress');
    }


    getAll() : Promise<UnitOfMeasurement[]> {
        
        return this.api
            .find('unitOfMeasurement')
            .then( (result : Promise<UnitOfMeasurement[]>) => {                 
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