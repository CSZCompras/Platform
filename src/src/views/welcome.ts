import 'jquery-visible';
import 'popper.js';
import 'bootstrap';
import 'velocity-animate';
import { autoinject } from 'aurelia-dependency-injection';  
import { ScriptRunner } from '../services/scriptRunner';
import { NotificationService } from '../services/notificationService';
import { UserRepository } from '../repositories/userRepository';
import { ValidationControllerFactory, ValidationController, validateTrigger, ValidationRules, ControllerValidateResult } from 'aurelia-validation';
import { WelcomeUser } from '../domain/welcomeUser';
import { FormValidationRenderer } from './formValidationRenderer';
import { ConsultaCNPJService } from '../services/consultaCNPJService';

@autoinject
export class Welcome{

    user                                    : WelcomeUser;
    validationController                    : ValidationController;
    wasCreated                              : boolean;
    isLoading                               : boolean;
    isCNPJLoading                           : boolean;
    
    constructor( 
        private validationControllerFactory : ValidationControllerFactory, 
        private CNPJService                 : ConsultaCNPJService,
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
            .ensure((user: WelcomeUser) => user.cnpj).displayName('CNPJ').required()  
            .ensure((user: WelcomeUser) => user.commercialPhone).displayName('Telefone').required() 
            .ensure((user: WelcomeUser) => user.companyName).displayName('Razão Social').required() 
            .ensure((user: WelcomeUser) => user.selectedType).displayName('Tipo').required() 
            .on(this.user);  
    }

    queryCNPJ(){
        
        if(this.user.cnpj != null && this.user.cnpj != ''){

            this.isCNPJLoading = true;

            this.CNPJService
                .findCNPJ(this.user.cnpj)
                .then( x => {
                    this.user.companyName = x.nome;
                    this.isCNPJLoading = false;
                })
                .catch( e => {
                    this.isCNPJLoading = false;
                    this.notification.error(e); 
                });
        }
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