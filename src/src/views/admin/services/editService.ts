import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router'; 
import { EventAggregator } from 'aurelia-event-aggregator'; 
import { NotificationService } from '../../../services/notificationService';
import { ServiceViewModel } from '../../../domain/serviceViewModel';
import { ServiceTypeViewModel } from '../../../domain/serviceTypeViewModel';
import { ServiceRepository } from '../../../repositories/serviceRepository';
import { ValidationControllerFactory, ValidationController, validateTrigger, ValidationRules, ControllerValidateResult } from 'aurelia-validation';
import { FormValidationRenderer } from '../../formValidationRenderer';
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';
import 'aurelia-validation';   
import { IdentityService } from '../../../services/identityService';
import { UserType } from '../../../domain/userType';

@autoinject
export class EditService{

    service                     : ServiceViewModel;
    types                       : ServiceTypeViewModel[];
    supplierId                  : string;
    edit                        : boolean; 
	validationController        : ValidationController;


    constructor(
        private router              : Router, 
        private ea                  : EventAggregator,
        private nService            : NotificationService,
        private repository          : ServiceRepository, 
        private identityService     : IdentityService,
        private validationControllerFactory : ValidationControllerFactory){

            this.edit = true; 
            // Validation.
            this.service = new ServiceViewModel();
            this.validationController = this.validationControllerFactory.createForCurrentScope();
            this.validationController.addRenderer(new FormValidationRenderer());
            this.validationController.validateTrigger = validateTrigger.blur;
            this.validationController.addObject(this.service);

            if(this.identityService.getIdentity().type == UserType.Admin){
                this.edit = true;
            }
            else{
                this.edit = false;
            }
    }

    attached(){

        this.ea.publish('loadingData'); 
        this.loadData();
    } 
    

    applyRules(){

        ValidationRules 
            .ensure((s : ServiceViewModel) => s.title).displayName('Título').required()
            .ensure((s : ServiceViewModel) => s.description).displayName('Descrição').required()  
            .ensure((s : ServiceViewModel) => s.phone).displayName('Telefone').required()
            .ensure((s : ServiceViewModel) => s.typeId).displayName('Tipo').required()
            .on(this.service);

    }

    
    activate(params){ 

        if(params != null && params.service){ 
            this.service = params.service; 
        } 
        this.applyRules();
    }


    loadData(){

        this.repository
            .getAllServiceTypes()
            .then(x => {
                this.types = x;
                this.ea.publish('dataLoaded');
            })
            .catch( e => this.nService.presentError(e)); 
         
    } 

    save(){ 

        this.validationController
            .validate()
            .then((result: ControllerValidateResult) => { 
            
                if (result.valid) {   

                    this.repository
                        .save(this.service)
                        .then( () =>{     
                            this.nService.presentSuccess('Serviço atualizado com sucesso!');

                        }).catch( e => {
                            this.nService.error(e);                
                        });
                    }
                    else { 
                        this.nService.error('Erros de validação foram encontrados');
                    }
                });     
    }

    cancel(){
        this.router.navigateToRoute('servicosAdmin');
    } 
}
