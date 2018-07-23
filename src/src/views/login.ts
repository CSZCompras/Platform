import { NotificationService } from '../services/notificationService';
import { ScriptRunner } from '../services/scriptRunner';
import { IdentityService } from "../services/identityService";
import { Identity } from '../domain/identity';
import { Credential } from "../domain/credential";
import { LoginRepository } from '../repositories/loginRepository';
import { ReportOptions } from 'gulp-tslint';
import { autoinject, Aurelia } from 'aurelia-framework';
import { Router, RouterConfiguration, NavigationInstruction } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { Rest, Config } from 'aurelia-api';
import { EventAggregator } from 'aurelia-event-aggregator';

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
export class Login {

    credential: Credential; 
    processing = false;

     
    constructor(
        private router: Router, 
        private aurelia: Aurelia, 
        private loginRepository: LoginRepository, 
        private service : IdentityService, 
        private ea : EventAggregator ,
        private nService : NotificationService ) {
    }

    doLogin() : void {
        this.processing = true;

        this.loginRepository
            .login(this.credential)
            .then( (identity : Identity) =>{ 
                this.service.setIdentity(identity); 
                this.ea.publish('loginDone'); 
                this.router.navigateToRoute('csz');
                
            }).catch( e => 
            {
                this.nService.error(e);
                this.processing = false;
            });
    }

    
	  
   	attached(): void { 
        ScriptRunner.runScript();   

        if (IdentityService.identity) {
            this.ea.publish('loginDone');
            this.router.navigateToRoute('csz');
        }      
	}

}