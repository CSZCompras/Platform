import { IdentityService } from '../services/identityService';
import { autoinject } from 'aurelia-framework';
import { Rest, Config } from 'aurelia-api';  
import { HttpClient } from 'aurelia-fetch-client';
import { Simulation } from '../domain/simulation/simulation';
import { SimulationInput } from '../domain/simulation/simulationInput';

@autoinject
export class SimulationRepository{

	
    api: Rest;

    constructor(private config: Config, private client : HttpClient, private service : IdentityService) {
        this.api = this.config.getEndpoint('apiAddress');
    }

    timeout(ms, promise) : Promise<any> {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            reject(new Error("timeout"))
          }, ms)
          promise.then(resolve, reject)
        })
      }

    simulate(input : SimulationInput) :  Promise<Simulation[]> { 

        return this.api
                    .post('simulation', input)
                    .then( (result : Promise<any>) => {    
                            if(result == null)             
                                return Promise.resolve();
                            return result;
                        })
                        .catch( (e) => {
                            console.log(e);
                            return Promise.resolve(e.json().then( error => {
                                
                                console.log(error);
                                throw error;
                            }))
                        }); 
    }

    getCotacaoFromOrder(orderId: string): Promise<SimulationInput> { 

        return this.api
            .find('cotacaoParcial?orderId=' + orderId)
            .then( (result : Promise<SimulationInput>) => { 
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
