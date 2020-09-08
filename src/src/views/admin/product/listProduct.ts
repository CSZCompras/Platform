import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { NotificationService } from '../../../services/notificationService';
import { ProductRepository } from '../../../repositories/productRepository';
import { Product } from '../../../domain/product';
import { ProductCategory } from '../../../domain/productCategory';
import { UnitOfMeasurementRepository } from '../../../repositories/unitOfMeasurementRepository';
import { UnitOfMeasurement } from '../../../domain/unitOfMeasurement';
import { ProductClass } from '../../../domain/productClass';
import { ValidationControllerFactory, ValidationController, validateTrigger, ValidationRules, ControllerValidateResult } from 'aurelia-validation';
import { ProductBaseRepository } from '../../../repositories/productBaseRepository';
import { ProductBase } from '../../../domain/productBase';
import { FormValidationRenderer } from '../../formValidationRenderer';
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';
import 'aurelia-validation';
import { Brand } from '../../../domain/brand';
import { BrandRepository } from '../../../repositories/brandRepository';

@autoinject
export class ListProduct{

    products                    : ProductBase[];
    filteredProducts            : ProductBase[];
    classes                     : ProductClass[];
    categories                  : ProductCategory[];
    brands                      : Brand[];
    units                       : UnitOfMeasurement[];
    selectedCategory            : ProductCategory;
    selectedClass               : ProductClass;
    selectedClassProduct        : ProductClass;
    selectedCategoryProduct     : ProductCategory;
    filter                      : string;
    isEditing                   : boolean;
    product                     : ProductBase;
    selectedUnit                : UnitOfMeasurement;
    isLoading                   : boolean;
	validationController        : ValidationController;


    constructor(		 
		private ea                          : EventAggregator, 
        private nService                    : NotificationService,
        private repository                  : ProductBaseRepository ,
        private unitRepository              : UnitOfMeasurementRepository,
        private productRepository           : ProductRepository, 
        private brandRepository             : BrandRepository,
        private validationControllerFactory : ValidationControllerFactory){
            
            
            this.product = new ProductBase();

            this.units = [];
            this.brands = [];
            // Validation.
            this.validationController = this.validationControllerFactory.createForCurrentScope();
            this.validationController.addRenderer(new FormValidationRenderer());
            this.validationController.validateTrigger = validateTrigger.blur;
            this.validationController.addObject(this.product);     
    } 

    attached(){
        this.ea.publish('loadingData'); 
        this.loadData();
    }

    activate(params){ 
        this.product = new ProductBase();
        this.applyRules();
    }

    applyRules(){
        
        ValidationRules 
            .ensure((p : ProductBase) => p.name).displayName('Nome').required() 
            .ensure((p : ProductBase) => p.category).displayName('Categoria do produto').required() 
            .on(this.product);   

        this.product.products.forEach( (x : Product) => {


            if(x.unit == null){
                x.unit = new UnitOfMeasurement();
            }
            
            ValidationRules 
                .ensure((x : UnitOfMeasurement) => x.id).displayName('Unidade de medida').required()  
                .on(x.unit);
        });   
    }

    loadData(){ 

        this.productRepository
               .getAllClasses()
               .then( (data : ProductClass[]) => { 
                   
                    this.classes = data.filter(x => x.isActive);
                    this.classes.forEach( x=> x.categories = x.categories.filter(y => y.isActive));
                    this.selectedClass = this.classes[0];
                    this.categories = this.selectedClass.categories; 
                    this.searchProducts();
                    this.ea.publish('dataLoaded');
               }).catch( e => {
                   this.nService.presentError(e);
               });


            this.brandRepository
               .getAllBrands()
               .then( (data : Brand[]) =>  this.brands = data)
               .catch( e => this.nService.presentError(e));               

        this.unitRepository
            .getAll()
            .then( (data : UnitOfMeasurement[]) => this.units = data)
            .catch( e => this.nService.presentError(e));
    }

    changeProductBaseStatus(){
        this.product.isActive = ! this.product.isActive;
    }

    changeProductStatus(p : Product){
        p.isActive = ! p.isActive;
    }

    updateCategories(){

        this.categories = this.selectedClass.categories; 
        this.searchProducts();
        this.products = [];
        this.filteredProducts = [];
    }

    searchProducts() {  

        if(this.selectedClass != null){
        
            this.isLoading = true;

            this.repository
                .getAllProductsByClass(this.selectedClass.id)
                .then(x => {
                    this.products = x;
                    this.filteredProducts = x;
                    this.isLoading = false;
                    this.search(); 
                })
                .catch( e => {
                    this.nService.presentError(e);
                    this.isLoading = false;
                }); 
        }
        else{
            this.products = [];
            this.filteredProducts = [];
        }

    }

    search(){

        this.filteredProducts = this.products.filter( (x :ProductBase) =>{

            var isFound = true; 

                if( ( (<any> this.selectedCategory != '-1' ) && this.selectedCategory != null && this.selectedCategory.id != '')){ 
                    if(x.category.id == this.selectedCategory.id){
                        isFound = true;
                    }
                    else {
                        isFound= false;
                    }
                }
           

                if(isFound){

                    if( (this.filter != null && this.filter != '')){ 
                        if(x.name.toUpperCase().includes(this.filter.toUpperCase())){
                            isFound = true;
                        }
                        else {
                            isFound= false;
                        }
                    } 
                }

                if(isFound){
                    return x;
                }
        });
    }
 
    edit(product : ProductBase){

        this.isEditing = true;    
        this.product = product;

        this.selectedClassProduct = this.classes.filter(x => x.id == product.category.productClass.id)[0];
        this.categories = this.selectedClassProduct.categories;
        this.product.category = this.categories.filter( x => x.id == this.product.category.id)[0];
        
        this.product.products.forEach(x => {  
            
            if(x.unit != null && x.unit.id != null){
                x.unit = this.units.filter( y => y.id == x.unit.id)[0];
            }
            
            if(x.unitInternal != null && x.unitInternal.id != null){
                x.unitInternal = this.units.filter( y => y.id == x.unitInternal.id)[0];
            }
        });
        
        this.applyRules();
    }

    updateUnit(p : Product){
        
        if(p.unit == null || (<any> p.unit)  == '' || p.unit.id  == null || p.unit.id  == '' || ! p.unit.mustInformQuantity){
            p.unitInternal = null;
            p.multiplier = null;
        }
    }

    updateUnitInternal(p : Product){
        
        if(p.unitInternal == null || (<any> p.unitInternal)  == '' || p.unitInternal.id  == null || p.unitInternal.id  == ''){
            p.multiplier = null;
        }
    }

    create(){

        this.product = new ProductBase();
        this.isEditing = true;
        this.product.isActive = true;        
        this.applyRules();
    }

    cancel(){

        this.isEditing = false;
        this.product = null;
        this.searchProducts();
    }

    addOrUpdate(){

        this.validationController
            .validate()
            .then((result: ControllerValidateResult) => { 

                this.product.products.forEach(x =>{
                    
                    if(x.brand != null && x.brand.id == ''){
                        x.brand = null;
                    }
                    
                });
            
                if (result.valid) {   

                    this.isLoading = true;

                    this.repository
                        .addOrUpdate(this.product)
                        .then(x => {               

                            this.product = null;
                            this.searchProducts();
                            this.isEditing = false;
                            this.isLoading = false;
                            this.nService.success('Produto cadastrado com sucesso!');
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

    addProduct(){
        var p = new Product();
        p.isActive = true;
        ( <any> p).isNew = true;
        this.product.products.push(p);
        this.applyRules();
    }

    removeProduct(p : Product){
        this.product.products = this.product.products.filter(x => x != p);
    }
}