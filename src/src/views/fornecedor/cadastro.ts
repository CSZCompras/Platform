import { SupplierValidator } from '../../validators/supplierValidator'; 
import { ConsultaCepResult } from '../../domain/consultaCepResult';
import { ConsultaCEPService } from '../../services/consultaCEPService';
import { StateRegistrationRepository } from '../../repositories/stateRegistrationRepository';
import { StateRegistration } from '../../domain/stateRegistration';
import { NotificationService } from '../../services/notificationService';
import { Supplier } from '../../domain/supplier'; 
import { IdentityService } from '../../services/identityService';
import { SupplierRepository } from '../../repositories/supplierRepository';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router'; 
import { EventAggregator } from 'aurelia-event-aggregator';
import { Address } from '../../domain/address';
import { ConsultaCNPJResult } from '../../domain/consultaCNPJResult';
import { ConsultaCNPJService } from '../../services/consultaCNPJService';
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';
import 'aurelia-validation';

@autoinject
export class Cadastro{

	$ 						: any;
	supplier 				: Supplier;
	stateRegistrations 		: StateRegistration[];
	currentStep 			: number;
	totalSteps 				: number;
	validator 				: SupplierValidator;
	isLoading				: boolean;
	isCNPJLoading			: boolean;
 
    constructor(		
		private router				: Router, 
		private repository 			: SupplierRepository, 
		private ea					: EventAggregator,
		private service 			: IdentityService,
		private nService 			: NotificationService,
		private stateRepo			: StateRegistrationRepository, 
		private consultaCNPJService	: ConsultaCNPJService,
		private consultaCepService 	: ConsultaCEPService) {

		this.currentStep = 1;
		this.totalSteps = 3;		
		this.isLoading = false; 
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

		var promisse1 = this.repository
							.getSupplier()
							.then( (supplier : Supplier) => { 
								this.supplier = supplier;	 

								if(this.supplier.address == null){

									this.supplier.address = new Address();
								}

								if(this.supplier.stateRegistration == null){

									this.supplier.stateRegistration = new StateRegistration();
								}		
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

	consultaCNPJ(){

		if(this.supplier.cnpj.length >= 14){

			this.isCNPJLoading = true;

			debugger;

			this.consultaCNPJService
					.findCNPJ(this.supplier.cnpj)
					.then( (result : ConsultaCNPJResult) => {

						if(result != null){
							
							this.supplier.name = result.nome;
							this.supplier.fantasyName = result.fantasia;
							this.supplier.address.cep = result.cep.split(".").join("").replace("-","");
							this.supplier.address.city = result.municipio;
							this.supplier.address.neighborhood = result.bairro;
							this.supplier.address.number = <any> result.numero;
							this.supplier.address.logradouro = result.logradouro;
							this.supplier.address.complement = result.complemento;
							this.supplier.address.state = result.uf;
							this.validator.validate();
						}
						this.isCNPJLoading = false;
					}).catch( e => { 
						this.isCNPJLoading = false;
					});
		}
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
				}).catch( e => {

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

		this.isLoading = true;
		
		var errors = this.validator.validate();

		if(errors.length == 0){

			if(this.supplier.stateRegistration.id != null){
				this.supplier.stateRegistration = this.stateRegistrations.filter( (x : StateRegistration) => x.id == this.supplier.stateRegistration.id)[0];
			}

			this.repository
				.save(this.supplier)
				.then( (supplier : Supplier) =>{

					if(this.supplier.registerStatus != supplier.registerStatus){
						this.ea.publish('registerStatusModified', supplier.registerStatus);
						this.supplier.registerStatus = supplier.registerStatus;
					}
					this.nService.success('Cadastro realizado!')       
					this.router.navigate('/#/cadastro');                
					this.isLoading = false;            

				}).catch( e => {
					this.nService.error(e);             
					this.isLoading = false;
				});
		}
		else{

			this.isLoading = false;
			
			errors.forEach( (error : string) => {
				this.nService.error(error);
			});
		}
	}
} 