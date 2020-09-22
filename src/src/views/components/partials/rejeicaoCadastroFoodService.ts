import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog'; 
import { EventAggregator } from 'aurelia-event-aggregator';
import { ValidationControllerFactory, ValidationController, validateTrigger, ValidationRules, ControllerValidateResult } from 'aurelia-validation'; 
import { NotificationService } from '../../../services/notificationService';  
import { FormValidationRenderer } from '../../formValidationRenderer'; 
import { ReasonToRejectFoodService } from '../../../domain/reasonToRejectFoodService';
import { ReasonToRejectFoodServiceRepository } from '../../../repositories/reasonToRejectFoodServiceRepository';
import { FoodService } from '../../../domain/foodService';

@autoinject
export class RejeicaoCadastroFoodService{
 
    controller                              : DialogController;  
    validationController                    : ValidationController;  
    isLoading                               : boolean;
    reasonsToReject                         : ReasonToRejectFoodService[];
    selectedReason                          : ReasonToRejectFoodService;
    foodService                             : FoodService;

    constructor(
        private pController                 : DialogController,   
        private validationControllerFactory : ValidationControllerFactory,
        private notification                : NotificationService,
        private repository                  : ReasonToRejectFoodServiceRepository){ 
 
        this.controller = pController;  
        this.isLoading = true;
        this.selectedReason = new ReasonToRejectFoodService();

        // Validation.
        this.validationController = this.validationControllerFactory.createForCurrentScope();
        this.validationController.addRenderer(new FormValidationRenderer());
        this.validationController.validateTrigger = validateTrigger.blur;
        this.validationController.addObject(this.selectedReason);     
    }    

    
    attached(){
        this.loadData();
    }

    activate(params){  

        if(params.FoodService != null){ 
            this.foodService = params.FoodService; 
        } 

        ValidationRules 
        .ensure((r: ReasonToRejectFoodService) => r.id).displayName('Motivo da rejeição')
        .required() 
        .on(this.selectedReason);  
       
    }

    loadData(){
        
        this.repository
            .getAllActiveReasons()
            .then( (result : ReasonToRejectFoodService[]) => {
                this.reasonsToReject = result;
                this.isLoading = false;
            })
            .catch( e => {
                this.isLoading = false;
                this.notification.presentError(e); 
            });
    }

    reject(){

        this.validationController
        .validate()
        .then((result: ControllerValidateResult) => { 
            
                if (result.valid) {   
                    this.controller.ok(this.selectedReason); 
                }
                else {
                    this.isLoading = false;
                    this.notification.error('Erros de validação foram encontrados');
                }
            });     
    }
 

    cancel(){
        this.controller.cancel();
    } 
}