import { Identity } from '../domain/identity';
import { Aurelia, autoinject } from 'aurelia-framework';
import { HttpClient, HttpClientConfiguration } from 'aurelia-fetch-client';


@autoinject
export class IdentityService {

    static isLoggingOut = false;

    private static _identity: Identity;

    constructor( private aurelia: Aurelia, private httpClient: HttpClient ) {
    }

    static get identity(): Identity { 

        if (!this._identity) {
            this._identity = JSON.parse(localStorage.getItem('identity'));
        }
        return this._identity;
    }

    getIdentity(): Identity {
        return IdentityService.identity;
    }

     

    setIdentity(identity: Identity): void {

        if (!identity) {
            return;
        }

        IdentityService._identity = identity;
        localStorage.setItem('identity', JSON.stringify(identity)); 
      //  this.activateAuthorization();
    }
 
    isLogged() : boolean {
        
        return this.getIdentity() != null;
    }

    resetIdentity(): void {
        localStorage.removeItem('identity');
        localStorage.removeItem('password'); 
        IdentityService._identity = null;
    }  

    activateAuthorization(): void {
        this.configureHttpClient(this.httpClient);
    }

    configureHttpClient(client: HttpClient): void {

        if (client.interceptors && client.interceptors.length > 0) {
            return;
        }

        client.configure((config: HttpClientConfiguration) => {
            config.withDefaults({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            config.withInterceptor({
                request: (request) => {
                    if (IdentityService._identity) {
                        request.headers.set('authtoken', IdentityService._identity.token);
                    }

                    return request;
                },
                response: (response: Response) => {

                    if (response.status === 401) {
                        if (IdentityService.isLoggingOut) {
                            return response;
                        }

                        IdentityService.isLoggingOut = true;
                        this.aurelia.setRoot('App_Auth/app');
                        location.hash = '#/logout';
                        return response;
                    }

                    let identityChanged = false;

                    let newToken = response.headers.get('authtoken-refresh');

                    if (newToken) {
                        if (IdentityService._identity) {
                            IdentityService._identity.token = newToken;
                            identityChanged = true;
                        }
                    }

                    return response;
                }
            });
        });
    }

    changePassword(): void {
        
    } 
}
