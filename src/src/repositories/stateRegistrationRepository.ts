import { StateRegistration } from '../domain/stateRegistration';
import { Supplier } from '../domain/supplier';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Rest, Config } from 'aurelia-api';

@autoinject
export class StateRegistrationRepository {

    api: Rest;
    stateRegistrations: StateRegistration[];

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('apiAddress');
    }

    getAll(): Promise<StateRegistration[]> {

        if (this.stateRegistrations) {
            return Promise.resolve(this.stateRegistrations);
        }

        return this.api
            .find('stateRegistration')
            .then((result: StateRegistration[]) => {
                this.stateRegistrations = result;
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