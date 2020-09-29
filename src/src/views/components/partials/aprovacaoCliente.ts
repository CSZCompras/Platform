import { autoinject } from 'aurelia-framework';
import { PriceListRepository } from '../../../repositories/priceListRepository';
import { PriceList } from '../../../domain/priceList';
import { FoodService } from '../../../domain/foodService';
import { DialogController } from 'aurelia-dialog';
import { FoodServiceSupplier } from '../../../domain/foodServiceSupplier';
import { ControllerValidateResult, validateTrigger, ValidationController, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { FormValidationRenderer } from '../../formValidationRenderer';
import { NotificationService } from '../../../services/notificationService';

@autoinject
export class AprovacaoCliente{

    isLoading                       : boolean;
    priceLists                      : PriceList[];
    selectedPriceList               : PriceList;
    paymentTerm                     : number;
    fsSupplier                      : FoodServiceSupplier;
    validationController            : ValidationController;

    constructor(		
		private controller                  : DialogController, 
        private validationControllerFactory : ValidationControllerFactory,
        private notification                : NotificationService,
        private priceListRepository         : PriceListRepository) { 

            this.isLoading = true; 

             // Validation.
            this.validationController = this.validationControllerFactory.createForCurrentScope();
            this.validationController.addRenderer(new FormValidationRenderer());
            this.validationController.validateTrigger = validateTrigger.blur;
    } 

    activate(params){  

        if(params.FoodServiceSupplier != null){

            this.fsSupplier = params.FoodServiceSupplier; 
            this.validationController.addObject(this.fsSupplier);
            this.paymentTerm = this.fsSupplier.paymentTerm;
        }

        ValidationRules
            .ensure((fsSupplier: FoodServiceSupplier) => fsSupplier.paymentTerm)
            .displayName('Prazo de pagamento')
            .required()  
            .on(this.fsSupplier);
    }

    loadData(){

        this.priceListRepository
            .getAll()
            .then(x => {
                this.priceLists = x;
                this.isLoading = false;

                if(this.fsSupplier.priceListId != null && this.fsSupplier.priceListId != ''){
                    this.selectedPriceList = this.priceLists.filter( p => p.id == this.fsSupplier.priceListId)[0];
                }
                else if(this.priceLists.length > 0){
                    this.selectedPriceList = this.priceLists[0];
                }
            })
            .catch(e => {
                this.isLoading = false;
            })
    }
    
    attached() : void{ 
        
		this.loadData();  
    } 

    save(){
        this.validationController
        .validate()
        .then((result: ControllerValidateResult) => {
        
            if (result.valid) {


                if(this.selectedPriceList != null && ( <any> this.selectedPriceList) != ''){
                    this.controller.ok({ 
                        priceList : this.selectedPriceList,
                        paymentTerm : this.fsSupplier.paymentTerm
                    });
                }
            }
            else {
                this.notification.error('Erros de validação foram encontrados');
            }
        });
    }

    cancel(){
        this.fsSupplier.paymentTerm = this.paymentTerm;
        this.controller.cancel();
    }
}