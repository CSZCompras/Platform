import { autoinject } from 'aurelia-framework'; 
import { Rest, Config } from 'aurelia-api'; 
import { ConsultaCNPJResult } from '../domain/consultaCNPJResult';

@autoinject
export class ConsultaCNPJService {

    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('apiAddress');
    }

    findCNPJ(cnpj : string) : Promise<ConsultaCNPJResult>{
        
        return this.api
                    .find('consultaCNPJ?cnpj=' + cnpj)
                    .then( (result : any) => {                 
                        return JSON.parse(result);
                    })
                    .catch( (e) => {
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });        
    }
}
