import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Rest, Config } from 'aurelia-api';

import { Identity } from '../domain/identity';
import { Credential } from "../domain/credential";

@autoinject
export class LoginRepository {

    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('csz');
    }


    login(login: Credential) : Promise<Identity> {
        
        return this.api
            .post('login', login)
            .then( (result : Promise<Identity>) => { 
                return result;
            })
            .catch( e =>{
                console.log(e);
                return null;
            });

        
    }
}