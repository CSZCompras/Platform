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
import { UserRepository } from '../repositories/userRepository';
import { User } from '../domain/user';
import { UserStatus } from '../domain/userStatus';
import { ConfirmInviteViewModel } from '../domain/confirmInviteViewModel';



@autoinject
export class Login {

    credential  : Credential; 
    userId      : string;    
    processing = false;
    user        : User;
    isLoading   : boolean;
    invite      : ConfirmInviteViewModel;
     
    constructor(
        private router          : Router, 
        private aurelia         : Aurelia, 
        private loginRepository : LoginRepository, 
        private userRepository  : UserRepository,
        private service         : IdentityService, 
        private ea              : EventAggregator ,
        private nService        : NotificationService ) {

        this.isLoading = true;
        this.invite = new ConfirmInviteViewModel();
    } 


    activate(params){  

        if(params != null && params.userId){  
            this.userId = params.userId;
        } 
        else{
          this.router.navigateToRoute('login');
        }
    }

    
	  
    attached(): void { 
 

        if (IdentityService.identity) { 
            this.router.navigateToRoute('login');
        }  
        else{
            this.loadData();
        }    
    }

    loadData(){

        this.userRepository
            .getUser(this.userId)
            .then( (user : User) => {

                if(user.status == UserStatus.WaitingToConfirmInvite || user.status == UserStatus.WaitingToConfirmPassword){
                
                    this.user = user;
                    this.isLoading = false;
                    ScriptRunner.runScript();  
                }
                else{
                    this.router.navigateToRoute('login');
                }
            })
            .catch( e => {
                this.nService.error(e);
                this.processing = false;
            });

    }

    save() : void {

        this.invite.userId = this.userId;

        if(this.invite.password != this.invite.confirmPassword){
            this.nService.presentError('A senha e a confirmação de senha são diferentes');
        }
        else{

            this.processing = true;

            this.userRepository
                .confirmInvite(this.invite)
                .then( (identity : Identity) =>{ 
                    
                    
                    this.processing = false;   
                    this.nService.presentSuccess('Seu cadastro foi criado com sucesso!')
                    this.router.navigateToRoute('login');
                    
                }).catch( e => {
                    this.nService.error(e);
                    this.processing = false;
                });
        }
    }

}
