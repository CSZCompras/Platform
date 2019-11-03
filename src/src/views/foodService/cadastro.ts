import { FoodServiceValidator } from '../../validators/foodServiceValidator';
import { ConsultaCepResult } from '../../domain/consultaCepResult';
import { ConsultaCEPService } from '../../services/consultaCEPService';
import { StateRegistrationRepository } from '../../repositories/stateRegistrationRepository';
import { StateRegistration } from '../../domain/stateRegistration';
import { NotificationService } from '../../services/notificationService';
import { FoodServiceRepository } from '../../repositories/foodServiceRepository';
import { Identity } from '../../domain/identity';
import { IdentityService } from '../../services/identityService'; 
import { FoodService } from '../../domain/foodService';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router'; 
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';
import 'aurelia-validation';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Address } from '../../domain/address';	 
import { ConsultaCNPJResult } from '../../domain/consultaCNPJResult';
import { ConsultaCNPJService } from '../../services/consultaCNPJService';

@autoinject
export class Cadastro{

	$ 						: any;
	foodService 			: FoodService;
	stateRegistrations 		: StateRegistration[];
	currentStep 			: number;
	totalSteps 				: number;
	validator 				: FoodServiceValidator;
	isLoading				: boolean; 
	isCNPJLoading			: boolean;
 
    constructor(		
		private router				: Router, 
		private repository 			: FoodServiceRepository, 
		private service 			: IdentityService,
		private ea 					: EventAggregator, 
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

		var promisse0 = this.repository
							.getByUser(identity.id)
							.then( (foodService : FoodService) => { 

								this.foodService = foodService;				

								if(this.foodService.address == null){

									this.foodService.address = new Address();
								}

								if(this.foodService.stateRegistration == null){

									this.foodService.stateRegistration = new StateRegistration();
								}
								this.validator = new FoodServiceValidator(this.foodService);						
							}).catch( e =>  {
								this.nService.presentError(e);
							});

		var promisse1 = this.stateRepo
							.getAll()
							.then( (data : StateRegistration[]) => { 
								this.stateRegistrations = data;
							}).catch( e => {
								this.nService.presentError(e);
							});

		Promise.all([promisse0, promisse1]).then( () => this.ea.publish('dataLoaded') );
	}

	consultaCNPJ(){

		if(this.foodService.cnpj.length >= 14){

			this.isCNPJLoading = true;

			debugger;

			this.consultaCNPJService
					.findCNPJ(this.foodService.cnpj)
					.then( (result : ConsultaCNPJResult) => {

						if(result != null){

							this.foodService.fantasyName = result.fantasia;
							this.foodService.address.cep = result.cep;
							this.foodService.address.city = result.municipio;
							this.foodService.address.neighborhood = result.bairro;
							this.foodService.address.number = <any> result.numero;
							this.foodService.address.logradouro = result.logradouro;
							this.foodService.address.complement = result.complemento;
							this.foodService.address.state = result.uf;
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

		if(this.foodService.address.cep.length >= 8){

			this.consultaCepService
				.findCEP(this.foodService.address.cep)
				.then( (result : ConsultaCepResult) => {

					if(result != null){
						
						this.foodService.address.city = result.localidade;
						this.foodService.address.neighborhood = result.bairro;
						this.foodService.address.number = null;
						this.foodService.address.logradouro = result.logradouro;
						this.foodService.address.complement = result.complemento;
						this.foodService.address.state = result.uf;
						this.validator.validate();
					}
				}).catch( e =>{
					
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

			if(this.foodService.stateRegistration.id != null){
				this.foodService.stateRegistration = this.stateRegistrations.filter( (x : StateRegistration) => x.id == this.foodService.stateRegistration.id)[0];
			}
			
			this.repository
				.save(this.foodService)
				.then( (foodService : FoodService) =>{
					
					if(this.foodService.registerStatus != foodService.registerStatus){
						this.ea.publish('registerStatusModified', foodService.registerStatus);
						this.foodService.registerStatus = foodService.registerStatus;
					}
					
					this.nService.success('Cadastro realizado!')       
					this.router.navigate('/#/cadastroFoodService');                
					this.isLoading = false;

				}).catch( e => {
					this.isLoading = false;
					this.nService.error(e);
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