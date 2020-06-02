import { NotificationService } from '../../services/notificationService'; 
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router'; 
import { FoodServiceRepository } from '../../repositories/foodServiceRepository'; 
import { SimulationRepository } from '../../repositories/simulationRepository';
import { OrderRepository } from '../../repositories/orderRepository';
import { EventAggregator } from 'aurelia-event-aggregator';
import { CotacaoViewModel } from '../../domain/cotacaoViewModel';
import { SupplierViewModel } from '../../domain/supplierViewModel'; 
import { ValidationControllerFactory, ValidationController, validateTrigger } from 'aurelia-validation';
import { FormValidationRenderer } from '../formValidationRenderer';
import { DeliveryRuleRepository } from '../../repositories/deliveryRuleRepository';
import { DeliveryRule } from '../../domain/deliveryRule';
import { CheckDeliveryViewModel } from '../../domain/checkDeliveryViewModel';
import { CheckDeliveryResult } from '../../domain/checkDeliveryResult';
import { CheckDeliveryResultItem } from '../../domain/CheckDeliveryResultItem';
import { SimulationInput } from '../../domain/simulation/simulationInput';
import { MarketInputViewModel } from '../../domain/simulation/marketInputViewModel';
import { SimulationInputItem } from '../../domain/simulation/simulationInputItem';
import { SimulationResult } from '../../domain/simulation/simulationResult';
import { SimulationSummaryItem } from '../../domain/simulation/simulationSummaryItem';
import { MarketViewModel } from '../../domain/marketViewModel';
import { Simulation } from '../../domain/simulation/simulation';
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';
import 'aurelia-validation';

@autoinject
export class Pedido{

	$               				: any;
	orderId							: string;
	currentStep     				: number;
	totalSteps      				: number;
    quotes          				: CotacaoViewModel[];
    selectedQuote   				: CotacaoViewModel ;
    isProcessing    				: boolean;
	simulations      				: Simulation[];
	input 							: SimulationInput; 
	orderWasGenerated				: boolean;
	validationController            : ValidationController;
	deliveryWasChecked				: boolean;
	isOrderValid					: boolean; 
	results 						: SimulationResult[]; 

	
    constructor(		
        private router                  	: Router, 	
		private repository              	: FoodServiceRepository,	
		private ea 							: EventAggregator, 
		private simulationRepository    	: SimulationRepository,
		private orderRepository    			: OrderRepository, 
		private nService                	: NotificationService,
        private deliveryRepository      	: DeliveryRuleRepository, 
        private validationControllerFactory : ValidationControllerFactory) {

		this.currentStep = 1;
        this.totalSteps = 3;		
		this.isProcessing = false;
		this.orderWasGenerated = false;
		this.input = new SimulationInput(); 

		// Validation.
		this.validationController = this.validationControllerFactory.createForCurrentScope();
		this.validationController.addRenderer(new FormValidationRenderer());
		this.validationController.validateTrigger = validateTrigger.blur;
		this.deliveryWasChecked  = false;   
		this.isOrderValid = true;
		this.results = []; 
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


    activate(params){  

        if(params.orderId != null && params.orderId != ''){

			this.orderId = params.orderId;	
        }
    }

	advance(){   

        this.currentStep++;

        if(this.currentStep == 2){
            this.simulate();
		}

		if(this.currentStep == 3){
			window.scrollTo(0, 0);
		}
    }
    
    simulate(){

		this.ea.publish('loadingData');  
		this.isProcessing = true; 
		
		this.input.buyListId = this.selectedQuote.id;

		this.input.markets = [];

		this.selectedQuote.markets.forEach( market =>{

			var vm = new MarketInputViewModel();
			vm.market = market;
			vm.viewModel = market.viewModel;
			
			market.products.forEach( (x) =>{
			
				if(x.quantity != null && x.quantity != 0){
	
					var item = new SimulationInputItem();
					item.productId = x.id;
					item.quantity = x.quantity;
					vm.items.push(item);
				}
			});

			vm.supplierBlackList = market.blackListSupplier; 
			this.input.markets.push(vm);
		});		

		this.simulations = [];

        this.simulationRepository
            .simulate(this.input)
            .then(  x => { 
                
				this.simulations = x;
				
				this.simulations.forEach( y => { 
					if(y.bestResult != null && (y.bestResult.validationMessages == null || y.bestResult.validationMessages.length == 0)){
						this.results.push(y.bestResult);
					}
				});
				this.isProcessing = false;
				this.runScript();
				this.ea.publish('dataLoaded');
            })
            .catch( e => {
				this.simulations = [];
                this.nService.presentError(e);
				this.isProcessing = false;
				this.ea.publish('dataLoaded');
            });
    }

	back(){
		this.currentStep--;
	}

    attached() : void {		 

		this.ea.publish('loadingData'); 
		this.runScript();
		this.loadData(); 
	}  

	addRemoveSupplier (market : MarketViewModel,supplier : SupplierViewModel){ 

		if(( <any> supplier).wasRemoved && ! (<any> supplier).isInvalid){

			market.suppliers.forEach(x => {
				
				if( x.id  == supplier.id){
					( <any> x).isInvalid = false;
					( <any> x).wasRemoved = false;
				}
			});

			market.products.forEach(x => {

				x.suppliers.forEach(y =>{

					if( y.id  == supplier.id){
						( <any> y).isInvalid = false; 
						( <any> y).wasRemoved = false;
					}
				});
			});

			market.blackListSupplier = market.blackListSupplier.filter(x => x.id != supplier.id);
		}
		else if( ! (<any> supplier).isInvalid){ 

			market.suppliers.forEach(x => {
				
				if( x.id  == supplier.id){

					( <any> x).isInvalid = false; 
					( <any> x).wasRemoved = true;
				}
			});


			market.products.forEach(x => {

				x.suppliers.forEach(y =>{

					if( y.id  == supplier.id){
						( <any> y).isInvalid = false;
						( <any> y).wasRemoved = true;
					}
				});
			});

			market.blackListSupplier.push(supplier);
		}
		this.checkIfOrderIsvalid(market);
	}

    loadData(){

		if(this.orderId != null && this.orderId != ''){

		/*	this.simulationRepository
				.getCotacaoFromOrder(this.orderId)
				.then(x =>  {

					this.selectedQuote = x;

					if(x.blackListSupplier != null){

						this.addRemoveSupplier(x.blackListSupplier);
					}					
				}) 
				.then( () => this.ea.publish('dataLoaded'))
				.catch( e =>  this.nService.presentError(e));
				this.loadDeliveryRule(); */
		}
		else{
 
			this.repository
				.getBuyListsParaCotacao()
				.then(x =>  {
					this.quotes = x;
				}) 
				.then( () => this.ea.publish('dataLoaded'))
				.catch( e =>  this.nService.presentError(e));

		} 
	}

	loadDeliveryRule(){
	
		this.selectedQuote.markets.forEach(market  =>{

			if(market.id != null){

				this.deliveryRepository
					.getRule(market.id)
					.then( (x : DeliveryRule) => { 
						if(x != null){
							market.deliveryRule = <DeliveryRule> x;

							if(market.viewModel == null){
								market.viewModel = new CheckDeliveryViewModel();
							}
							market.viewModel.deliveryScheduleStart = x.deliveryScheduleInitial;
							market.viewModel.deliveryScheduleEnd = x.deliveryScheduleFinal;
							market.viewModel.deliveryDate = DeliveryRule.getNextDeliveryDate(market.deliveryRule);
							this.checkDeliveryDate(market);
						}
					}) 
					.catch( e => this.nService.presentError(e)); 
			}
			else{
				market.deliveryRule = null;
				this.checkDeliveryDate(market);
	
			} 
		}); 
	}

	checkDeliveryDate(market : MarketViewModel){

		this.deliveryWasChecked = false;
		market.viewModel.suppliers = [];

		market.suppliers.forEach(x => {
			market.viewModel.suppliers.push(x.id);
		});

		if(market.viewModel.deliveryDate < new Date()){
			
			this.nService.presentError('A data de entrega deve ser maior ou igual a hoje');		
			market.isValid = false;
		}

		if(market.viewModel.deliveryScheduleStart >= market.viewModel.deliveryScheduleEnd){
			this.nService.presentError('O horário inicial deve ser maior que o horário final');		
			market.isValid = false;
		}

		this.deliveryRepository
			.checkDeliveryRule(market.viewModel)
			.then( (x : CheckDeliveryResult) => {
				
				market.checkDeliveryResult = x;

				x.items.forEach( (item : CheckDeliveryResultItem) =>{
					
						market.suppliers.forEach(y =>{
							if(y.id == item.supplierId){

								if(! item.isValid){
									( <any> y).isInvalid = true; 
									market.blackListSupplier.push(y);
								}
								else{
									( <any> y).isInvalid = false;
									market.blackListSupplier = market.blackListSupplier.filter(x => x.id != y.id);
								} 
							}
						});

						market.products.forEach(x => {

							x.suppliers.forEach(y =>{
			
								if( y.id  == item.supplierId){

									if(! item.isValid){
										( <any> y).isInvalid = true;
									}
									else{
										( <any> y).isInvalid = false;
									}
								}
							});
						}); 
				});

				this.deliveryWasChecked = true;
				this.checkIfOrderIsvalid(market);
			})
			.catch( e => this.nService.presentError(e));  
	}


	checkIfOrderIsvalid(market : MarketViewModel){
		
		market.isValid = true;

		if(market.viewModel.deliveryDate < new Date()){
			market.isValid = false;
		}

		if(market.viewModel.deliveryScheduleStart >= market.viewModel.deliveryScheduleEnd){
			market.isValid = false;
		}

		if(market.blackListSupplier.length == market.suppliers.length){
			market.isValid = false;
		}
	}
	
	generateOrder(){
 
		this.isProcessing = true;
						
		this.orderRepository
					.createOrder(this.results)
					.then( (result : any) =>{   
						this.nService.success('Pedido realizado!');
						this.router.navigateToRoute('pedidosFoodService');
						this.isProcessing = false;
						this.orderWasGenerated = true;
					}).catch( e => {
								
						this.isProcessing = false;
						this.nService.error(e);
			});   

	}

	changeSelectedCotacao(result : SimulationResult){
		this.simulations = [];

	}

	validateLengthObs(summary : SimulationSummaryItem){

		if(summary.observation != null && summary.observation.length >= 250){
			summary.observation = summary.observation.substr(0, 249);
		}
		return true;
	}
}