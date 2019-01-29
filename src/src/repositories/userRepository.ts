import { Supplier } from '../domain/supplier';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Rest, Config } from 'aurelia-api';
import { Identity } from '../domain/identity';
import { Credential } from "../domain/credential";
import { SupplierProduct } from '../domain/supplierProduct';
import { UnitOfMeasurement } from '../domain/unitOfMeasurement';
import { User } from '../domain/user';
import { ConfirmInviteViewModel } from '../domain/confirmInviteViewModel';
import { WelcomeUser } from '../domain/welcomeUser';

@autoinject
export class UserRepository{ 
    
    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('csz');
    }



    getUsersFromFoodService(foodServiceId : string) : Promise<User[]> {
        
        return this.api
            .find('foodServiceUsers?foodServiceId=' + foodServiceId)
            .then( (result : Promise<User[]>) => {
                return result;
            })
            .catch( (e) => {
                console.log(e);
                return Promise.resolve(e.json().then( error => {
                    throw error;
                }));
            });
    }

    getUsersFromSupplier(supplierId : string) : Promise<User[]> {
        
        return this.api
            .find('supplierUsers?supplierId=' + supplierId)
            .then( (result : Promise<User[]>) => {
                return result;
            })
            .catch( (e) => {
                console.log(e);
                return Promise.resolve(e.json().then( error => {
                    throw error;
                }));
            });
    }

    getUser(userId : string) :  Promise<User> {
        
        return this.api
                    .find('user?userId=' +  userId)
                    .then( (result : Promise<User>) => {    
                       
                        return result;
                    })
                    .catch( (e) => {
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    }

    save(user: User)  : Promise<any> {

        return this.api
            .post('user', user)
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

    
    
    confirmInvite(invite: ConfirmInviteViewModel): any {

        return this.api
            .post('confirmInvite', invite)
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

    resendInvite(userId : string) :  Promise<any>{
        
         return this.api
                    .find('resendInvite?userId=' +  userId)
                    .then( (result : Promise<any>) => {     
                        return result;
                    })
                    .catch( (e) => {
                        console.log(e);
                        return Promise.resolve(e.json().then( error => {
                            throw error;
                        }));
                    });
    }

    createNew(user : WelcomeUser) : Promise<any> {

        return this.api
            .post('welcome', user)
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

    resetPassword(email : string) : Promise<any> {
        
        return this.api
                    .post('resetPassword', { email })
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