import { autoinject } from 'aurelia-framework'; 
import { Rest, Config } from 'aurelia-api'; 
import { ConsultaCepResult } from "../domain/consultaCepResult";

@autoinject
export class ConsultaCEPService {

    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('apiAddress');
    }

    findCEP(cep : string) : Promise<ConsultaCepResult>{
        
        return this.api
                    .find('consultaCEP?cep=' + cep)
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
