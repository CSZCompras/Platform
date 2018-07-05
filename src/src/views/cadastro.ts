import { SupplierValidator } from '../validators/supplierValidator';
import { CustomValidationRenderer } from '../services/customValidationRenderer';
import { inject, NewInstance} from 'aurelia-framework';
import { ConsultaCepResult } from '../domain/consultaCepResult';
import { ConsultaCEPService } from '../services/consultaCEPService';
import { StateRegistrationRepository } from '../repositories/stateRegistrationRepository';
import { StateRegistration } from '../domain/stateRegistration';
import { NotificationService } from '../services/notificationService';
import { Supplier } from '../domain/supplier';
import { Identity } from '../domain/identity';
import { IdentityService } from '../services/identityService';
import { SupplierRepository } from '../repositories/supplierRepository';
import { Aurelia, autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { Rest, Config } from 'aurelia-api';
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';
import 'aurelia-validation';
import { EventAggregator } from 'aurelia-event-aggregator';

@autoinject
export class Cadastro{

	$ : any;
	supplier : Supplier;
	stateRegistrations : StateRegistration[];
	currentStep : number;
	totalSteps : number;
	validator : SupplierValidator
	

    constructor(		
		private router: Router, 
		private repository : SupplierRepository, 
		private ea: EventAggregator,
		private service : IdentityService,
		private nService : NotificationService,
		private stateRepo: StateRegistrationRepository, 
		private consultaCepService : ConsultaCEPService) {

		this.currentStep = 1;
		this.totalSteps = 3;	 
    } 
 

	runScript() : void{

		var thisForm = '#rootwizard-1';

		var outher = this;

		if( $(thisForm).length) {

			// Prevent page from jumping when +
			$('.pager li a, .pager li span').on('click', function(e){
				e.preventDefault();
			});

			var wizardStagesTotal = $(thisForm + ' .tab-pane').length;
			
			( <any> $)(thisForm).bootstrapWizard({onNext: function(tab, navigation, index) { 

				if(index <= wizardStagesTotal){
					$(thisForm + ' .tab-pane').eq(index).addClass('active');
					$(thisForm + ' .tab-pane').eq(index - 1).removeClass('active');
				}

			}, onPrevious: function(tab, navigation, index) {
				// Note: index is the previous frame not the current one
				if(index !== -1){
					$(thisForm + ' .tab-pane').eq(index).addClass('active');
					$(thisForm + ' .tab-pane').eq(index + 1).removeClass('active');
				}
			}, onTabShow: function(tab, navigation, index) {
				// Update Progress Bar
				var total = navigation.find('li').length;
				var current = index + 1;
				var completionPercentage = (current / total) * 100;

				var progressBar = $(thisForm).closest('.card').find(".card-header .progress-bar");

				progressBar.css({"width": completionPercentage + "%"}).attr("aria-valuenow", completionPercentage);
			}, onTabClick: function(tab, navigation, index){
				return false;
			}});
		}
	}

    attached() : void {		

		this.ea.publish('loadingData');       
		this.runScript();
		this.loadData(); 
    } 

	loadData() : void { 
		var identity = this.service.getIdentity();

		var promisse1 = this.repository
							.getSupplier()
							.then( (supplier : Supplier) => { 
								this.supplier = supplier;				
								this.validator = new SupplierValidator(this.supplier);						
							}).catch( e =>  {
								this.nService.presentError(e);
							});

		var promisse2 = this.stateRepo
							.getAll()
							.then( (data : StateRegistration[]) => { 
								this.stateRegistrations = data;
							}).catch( e => {
								this.nService.presentError(e);
							}); 

		Promise.all([promisse1, promisse2]).then( () => this.ea.publish('dataLoaded'));
	}

	consultaCEP(){

		this.validator.addressValidator.validateCep();

		if(this.supplier.address.cep.length >= 8){

			this.consultaCepService
				.findCEP(this.supplier.address.cep)
				.then( (result : ConsultaCepResult) => {

					if(result != null){
						
						this.supplier.address.city = result.localidade;
						this.supplier.address.neighborhood = result.bairro;
						this.supplier.address.number = null;
						this.supplier.address.logradouro = result.logradouro;
						this.supplier.address.complement = result.complemento;
						this.supplier.address.state = result.uf;
						this.validator.validate();
					}
				}).catch( e => 
				{
					this.nService.presentError(e);
				});
		}
	}

	advance(){
		this.currentStep++;
	}

	back(){
		this.currentStep--;
	}

	save(){
		
		var errors = this.validator.validate();

		if(errors.length == 0){

			this.supplier.stateRegistration = this.stateRegistrations.filter( (x : StateRegistration) => x.id == this.supplier.stateRegistration.id)[0];

			this.repository
				.save(this.supplier)
				.then( (identity : Identity) =>{         
					this.nService.success('Cadastro realizado!')       
					this.router.navigate('/#/cadastro');                
				}).catch( e => {
					this.nService.error(e);
				});
		}
		else{
			errors.forEach( (error : string) => {
				this.nService.error(error);
			});
		}
	}
} 