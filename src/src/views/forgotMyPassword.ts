import { NotificationService } from '../services/notificationService';
import { ScriptRunner } from '../services/scriptRunner';
import { IdentityService } from "../services/identityService"; 
import { LoginRepository } from '../repositories/loginRepository'; 
import { autoinject, Aurelia } from 'aurelia-framework';
import { Router } from 'aurelia-router'; 
import { EventAggregator } from 'aurelia-event-aggregator';
import { UserRepository } from '../repositories/userRepository'; 
import 'jquery';
import 'popper.js';
import 'bootstrap';
import 'mdbootstrap';
import 'velocity-animate';
import 'velocity';
import 'custom-scrollbar';
import 'jquery-visible';
import 'ie10-viewport';



@autoinject
export class ForgotMyPassword {
 
    isLoading   : boolean;  
    email       : string;
    wasReseted  : boolean;
     
    constructor(
        private router          : Router, 
        private aurelia         : Aurelia, 
        private loginRepository : LoginRepository, 
        private userRepository  : UserRepository,
        private service         : IdentityService, 
        private ea              : EventAggregator ,
        private nService        : NotificationService ) {

        this.isLoading = false; 
        this.wasReseted = false;
    } 


    activate(params){  
        
    } 

    attached(): void {  

        if (IdentityService.identity) { 
            this.router.navigateToRoute('login');
        }   
        else{
            window.setTimeout(() => ScriptRunner.runScript(), 10);
        }
    } 

    resetPassword() : void { 



        if(this.email == null || this.email == ''){
            this.nService.presentError('O e-mail é obrigatório');
        }
        else{

            this.isLoading = true;

            this.userRepository
                .resetPassword(this.email)
                .then( () =>{ 
                     
                    
                    this.isLoading = false;  
                    this.wasReseted = true;
                    
                }).catch( e => {

                    this.nService.error(e);
                    this.isLoading = false;
                    this.wasReseted = false;
                });
        }
    }

}