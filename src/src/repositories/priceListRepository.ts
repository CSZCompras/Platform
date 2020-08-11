import { PriceList } from '../domain/priceList';
import { MarketRule } from '../domain/marketRule';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Rest, Config } from 'aurelia-api';
import { Identity } from '../domain/identity';
import { Credential } from "../domain/credential";

@autoinject
export class PriceListRepository{

    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('apiAddress');
    }

    getAll() : Promise<PriceList[]> {
        
        return this.api
            .find('priceList')
            .then( (result : Promise<PriceList[]>) => result)
            .catch( (e) => {
                console.log(e);
                return Promise.resolve(e.json().then( error => {
                    throw error;
                }));
            });
    }
}