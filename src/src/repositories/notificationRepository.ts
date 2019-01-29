import { PriceList } from '../domain/priceList';
import { MarketRule } from '../domain/marketRule';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Rest, Config } from 'aurelia-api';
import { Identity } from '../domain/identity';
import { Credential } from "../domain/credential";
import { Notification } from "../domain/notification";

@autoinject
export class NotificationRepository{
    
    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('csz');
    }

    getAll() : Promise<Notification[]> {
        
        return this.api
            .find('notification')
            .then( (result : Promise<Notification[]>) => {                 
                return result;
            })
            .catch( (e) => {
                console.log(e);
                return Promise.resolve(e.json().then( error => {
                    throw error;
                }));
            });
    }

    updateUnseen(notificationIds : Array<string>) : Promise<Notification[]> {
        
        return this.api
                    .post('seenNotification', notificationIds)
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