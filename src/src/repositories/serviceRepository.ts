import { autoinject } from 'aurelia-framework'; 
import { Rest, Config } from 'aurelia-api'; 
import { ServiceViewModel } from '../domain/serviceViewModel';
import { ServiceTypeViewModel } from '../domain/serviceTypeViewModel';

@autoinject
export class ServiceRepository{

    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('apiAddress');
    } 

    getAllServices() : Promise<ServiceViewModel[]> {
        
        return this.api
            .find('service')
            .then( (result : Promise<ServiceViewModel[]>) => {
                return result;
            })
            .catch( (e) => {
                console.log(e);
                return Promise.resolve(e.json().then( error => {
                    throw error;
                }));
            });
    }
    

    save(service : ServiceViewModel) : Promise<ServiceViewModel> {
        
        return this.api
            .post('service', service)
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

    getAllServiceTypes() : Promise<ServiceTypeViewModel[]> {
        
        return this.api
            .find('serviceType')
            .then( (result : Promise<ServiceTypeViewModel[]>) => {
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