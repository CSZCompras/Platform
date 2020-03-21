import { Aurelia, autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Rest } from 'aurelia-api'; 
import { ConsultaCNPJResult } from '../domain/consultaCNPJResult';

@autoinject
export class ConsultaCNPJService {

    api: Rest;    
    
     constructor(private httpClient: HttpClient) {
        
    }

    findCNPJ(cnpj : string) : Promise<ConsultaCNPJResult>{
        
         var url = 'https://cors-anywhere.herokuapp.com/https://www.receitaws.com.br/v1/cnpj/'+ cnpj ;

         this.httpClient.configure(config => 
            config
                .withBaseUrl(url)
        );
         
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
