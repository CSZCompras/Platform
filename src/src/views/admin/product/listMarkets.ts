import { Aurelia, autoinject } from 'aurelia-framework';
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';
import 'aurelia-validation';
import { EventAggregator } from 'aurelia-event-aggregator';
import { NotificationService } from '../../../services/notificationService';
import { ProductRepository } from '../../../repositories/productRepository'; 
import { ProductCategory } from '../../../domain/productCategory';
import { UnitOfMeasurementRepository } from '../../../repositories/unitOfMeasurementRepository'; 
import { ProductClass } from '../../../domain/productClass';
import { ValidationControllerFactory, ValidationController, validateTrigger, ValidationRules, ControllerValidateResult } from 'aurelia-validation';
import { FormValidationRenderer } from '../../formValidationRenderer';

@autoinject
export class ListMarkets{
 
    classes                     : ProductClass[]; 
    categories                  : ProductCategory[]; 
    selectedCategory            : ProductCategory;
    selectedClass               : ProductClass; 
    filter                      : string;
    isEditing                   : boolean;
    market                      : ProductClass; 
    isLoading                   : boolean;
	validationController        : ValidationController;

    constructor(		 
		private ea                          : EventAggregator, 
        private nService                    : NotificationService,
        private repository                  : ProductRepository ,
        private unitRepository              : UnitOfMeasurementRepository,
        private productRepository           : ProductRepository, 
        private validationControllerFactory : ValidationControllerFactory){
            
            
            this.market = new ProductClass(); 

            this.validationController = this.validationControllerFactory.createForCurrentScope();
            this.validationController.addRenderer(new FormValidationRenderer());
            this.validationController.validateTrigger = validateTrigger.blur;
    } 

    attached(){
        this.ea.publish('loadingData'); 
        this.loadData();
    }

    activate(){ 


        ValidationRules 
            .ensure((m : ProductClass) => m.name).displayName('Nome do mercado').required()  
            .on(this.market);  
    }

    loadData(){
         

        this.productRepository
               .getAllClasses()
               .then( (data : ProductClass[]) => { 
                   this.classes = data;  
                   this.ea.publish('dataLoaded');
               }).catch( e => {
                   this.nService.presentError(e);
               }); 
    }  

    edit(market : ProductClass){

        this.isEditing = true;
        this.market = market;
    }

    create(){

        this.market = new ProductClass();
        this.market.isActive = true;
        this.isEditing = true;
    }

    cancel(){

        this.isEditing = false; 
    }

    editMarketStatus(){
        this.market.isActive = ! this.market.isActive; 
    }

    editCategoryStatus(x : ProductCategory){
        x.isActive = ! x.isActive; 
    }

    createCategory(){
        var x = new ProductCategory();
        x.isActive = true;
        if(this.market.categories == null){
            this.market.categories = [];
        }
        this.market.categories.unshift(x);
    }

    addOrUpdate(){

        this.validationController
            .validate()
            .then((result: ControllerValidateResult) => { 
            
                if (result.valid) {   

                    this.isLoading = true;

                    this.repository
                        .addOrUpdateClass(this.market)
                        .then(x => {               
                            this.loadData();
                            this.market = null; 
                            this.isEditing = false;
                            this.isLoading = false;
                            this.nService.success('Mercado cadastrado com sucesso!');
                        })
                        .catch( e => {
                            this.nService.error(e);
                            this.isLoading = false;
                        }); 
                    }
                    else { 
                        this.nService.error('Erros de validação foram encontrados');
                    }
                });     
    }

}