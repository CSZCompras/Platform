import { MarketRuleItem } from '../domain/marketRuleItem';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Rest, Config } from 'aurelia-api';
import { Identity } from '../domain/identity';
import { Credential } from "../domain/credential";

@autoinject
export class MarketRuleItemRepository {

    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('apiAddress');
    }

    getRuleItems(userId: string): Promise<MarketRuleItem[]> {

        return this.api
            .find('marketRuleItem?userId=' + userId)
            .then((result: Promise<MarketRuleItem[]>) => {
                return result;
            })
            .catch((e) => {
                console.log(e);
                return Promise.resolve(e.json().then(error => {
                    throw error;
                }));
            });
    }

    save(rule: MarketRuleItem): Promise<MarketRuleItem> {

        return this.api
            .post('MarketRuleItem', rule)
            .then((result: Promise<MarketRuleItem>) => {
                return result;
            })
            .catch((e) => {
                console.log(e);
                return Promise.resolve(e.json().then(error => {
                    throw error;
                }));
            });
    }
}