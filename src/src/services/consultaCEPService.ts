import { Identity } from '../domain/identity';
import { Aurelia, autoinject } from 'aurelia-framework';
import { HttpClient, HttpClientConfiguration } from 'aurelia-fetch-client';
import { Rest, Config } from 'aurelia-api';
import { ConsultaCepResult } from "../domain/consultaCepResult";

@autoinject
export class ConsultaCEPService {

    api: Rest;    
    
     constructor(private httpClient: HttpClient) {
        
    }

    findCEP(cep : string) : Promise<ConsultaCepResult>{
        
         var url = 'https://viacep.com.br/ws/'+ cep +'/json';

         this.httpClient.configure(config => config.withBaseUrl(url));

         
         
         return <any> 
            this.httpClient
                .fetch(url)
                .then( result => {
                    return result.json();
                })
                .catch( (e) => {
                    console.log(e);
                    return Promise.resolve(e.json().then( error => {
                        throw error;
                    }));
                });

                
    }
}
