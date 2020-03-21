import 'jquery-visible';
import 'popper.js';
import 'bootstrap';
import 'velocity-animate';
import { Router  } from 'aurelia-router'; 
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-dependency-injection';  
import { IdentityService } from '../services/identityService';
import { ScriptRunner } from '../services/scriptRunner';
import { NotificationService } from '../services/notificationService';
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
        private validationControllerFactory : ValidationControllerFactory, 
        private userRepository              : UserRepository,
        private notification                : NotificationService ) { 

        this.user = new WelcomeUser(); 
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
                                this.notification.error(e); 
                            });
                    }
                    else {
                        this.isLoading = false;
                        this.notification.error('Erros de validação foram encontrados');
                    }
                })    
    }

}