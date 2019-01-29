import { Router, RouterConfiguration, NavigationInstruction } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-dependency-injection'; 
import { Config, Rest } from 'aurelia-api'; 

import 'jquery-visible';
import 'popper.js';
import 'bootstrap';
import 'velocity-animate';
/* import 'malihu-custom-scrollbar-plugin';*/ 
import { Identity } from '../domain/identity';
import { IdentityService } from '../services/identityService';
import { ScriptRunner } from '../services/scriptRunner';
import { FoodServiceConnectionViewModel } from '../domain/foodServiceViewModel';
import { UserType } from '../domain/userType';
import { Notification } from '../domain/notification';
import { FoodServiceConnectionRepository } from '../repositories/foodServiceConnectionRepository';
import { NotificationService } from '../services/notificationService';
import { NotificationRepository } from '../repositories/notificationRepository';
import { OrderRepository } from '../repositories/orderRepository';
import { MessageService } from '../services/messageService';
import { Aurelia } from 'aurelia-framework';
import { LoginRepository } from '../repositories/loginRepository';
import { UserRepository } from '../repositories/userRepository';
import { ValidationControllerFactory, ValidationController, validateTrigger, ValidationRules, ControllerValidateResult } from 'aurelia-validation';
import { WelcomeUser } from '../domain/welcomeUser';
import { FormValidationRenderer } from './formValidationRenderer';

@autoinject
export class Welcome{

    user                                    : WelcomeUser;
    validationController                    : ValidationController;
    wasCreated                              : boolean;
    isLoading                               : boolean;
    
    constructor(
        private router                      : Router, 
        private aurelia                     : Aurelia, 
        private validationControllerFactory : ValidationControllerFactory,
        private loginRepository             : LoginRepository, 
        private userRepository              : UserRepository,
        private notification                : NotificationService,
        private service                     : IdentityService, 
        private ea                          : EventAggregator ,
        private nService                    : NotificationService ) { 

        this.user = new WelcomeUser();
        this.user.selectedType = "0";
        this.wasCreated = false;
        this.isLoading = false;

         // Validation.
         this.validationController = this.validationControllerFactory.createForCurrentScope();
         this.validationController.addRenderer(new FormValidationRenderer());
         this.validationController.validateTrigger = validateTrigger.blur;
         this.validationController.addObject(this.user);     
    } 

    attached(){
        
        window.setTimeout(() => ScriptRunner.runScript(), 10);
    }

    activate(params){

        
        ValidationRules
            .ensure((user: WelcomeUser) => user.contactName).displayName('Nome').required() 
            .ensure((user: WelcomeUser) => user.email).displayName('E-mail').required() 
            .ensure((user: WelcomeUser) => user.commercialPhone).displayName('Telefone').required() 
            .ensure((user: WelcomeUser) => user.companyName).displayName('Razão Social').required() 
            .ensure((user: WelcomeUser) => user.selectedType).displayName('Tipo').required() 
            .on(this.user);  
    }


    save(){

        this.validationController
            .validate()
            .then((result: ControllerValidateResult) => {
                
                    if (result.valid) {                        

                        this.isLoading = true;
            
                        this.userRepository
                            .createNew(this.user)
                            .then( () => {

                                this.notification.success('Cadastro realizado com sucesso!');
                                this.wasCreated = true;
                            })
                            .catch( e => {
                                this.isLoading = false;
                                this.notification.presentError(e); 
                            });
                    }
                    else {
                        this.isLoading = false;
                        this.notification.error('Erros de validação foram encontrados');
                    }
                });      
    }

}