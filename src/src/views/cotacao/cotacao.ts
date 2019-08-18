import { NotificationService } from '../../services/notificationService'; 
import { Aurelia, autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router'; 
import { FoodServiceRepository } from '../../repositories/foodServiceRepository'; 
import { SimulationRepository } from '../../repositories/simulationRepository';
import { Simulation } from '../../domain/simulation';
import { SimulationInput } from '../../domain/simulationInput'; 
import { SimulationInputItem } from '../../domain/simulationInputItem';
import { SimulationResult } from '../../domain/simulationResult';
import { OrderRepository } from '../../repositories/orderRepository';
import { EventAggregator } from 'aurelia-event-aggregator';
import { CotacaoViewModel } from '../../domain/cotacaoViewModel';
import { SupplierViewModel } from '../../domain/supplierViewModel';
import { DialogService } from 'aurelia-dialog';
import { ValidationControllerFactory, ValidationController, validateTrigger } from 'aurelia-validation';
import { FormValidationRenderer } from '../formValidationRenderer';
import { DeliveryRuleRepository } from '../../repositories/deliveryRuleRepository';
import { DeliveryRule } from '../../domain/deliveryRule';
import { CheckDeliveryViewModel } from '../../domain/checkDeliveryViewModel';
import { CheckDeliveryResult } from '../../domain/checkDeliveryResult';
import { CheckDeliveryResultItem } from '../../domain/CheckDeliveryResultItem';
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
	simulation      				: Simulation;
	input 							: SimulationInput;
	selectedResult 					: SimulationResult;	
	supplierBlackList				: SupplierViewModel[];	
	orderWasGenerated				: boolean;
	validationController            : ValidationController;
	viewModel 						: CheckDeliveryViewModel;
	checkDeliveryResult				: CheckDeliveryResult;
	deliveryRule					: DeliveryRule;
	deliveryWasChecked				: boolean;
	isOrderValid					: boolean;

	
    constructor(		
        private router                  	: Router, 	
		private repository              	: FoodServiceRepository,	
		private ea 							: EventAggregator,
		private dialogService				: DialogService,
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
		this.supplierBlackList = [];

		// Validation.
		this.validationController = this.validationControllerFactory.createForCurrentScope();
		this.validationController.addRenderer(new FormValidationRenderer());
		this.validationController.validateTrigger = validateTrigger.blur;
		this.deliveryWasChecked  = false;   
		this.viewModel = new CheckDeliveryViewModel();
		this.isOrderValid = true;
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

		this.input.items = [];

		this.selectedQuote.products.forEach( (x) =>{
			
			if(x.quantity != null && x.quantity != 0){

				var item = new SimulationInputItem();
				item.productId = x.id;
				item.quantity = x.quantity;
				this.input.items.push(item);
			}
		});		

		this.input.supplierBlackList = this.supplierBlackList;

        this.simulationRepository
            .simulate(this.input)
            .then(  x => { 
                
                this.simulation = x;
				this.isProcessing = false;
				this.runScript();
				this.ea.publish('dataLoaded');
            })
            .catch( e => {
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

	addRemoveSupplier (supplier : SupplierViewModel){ 

		if(( <any> supplier).wasRemoved && ! (<any> supplier).isInvalid){

			this.selectedQuote.suppliers.forEach(x => {
				
				if( x.id  == supplier.id){
					( <any> x).isInvalid = false;
					( <any> x).wasRemoved = false;
				}
			});

			this.selectedQuote.products.forEach(x => {

				x.suppliers.forEach(y =>{

					if( y.id  == supplier.id){
						( <any> y).isInvalid = false; 
						( <any> y).wasRemoved = false;
					}
				});
			});

			this.supplierBlackList = this.supplierBlackList.filter(x => x.id != supplier.id);
		}
		else if( ! (<any> supplier).isInvalid){ 

			this.selectedQuote.suppliers.forEach(x => {
				
				if( x.id  == supplier.id){

					( <any> x).isInvalid = false; 
					( <any> x).wasRemoved = true;
				}
			});


			this.selectedQuote.products.forEach(x => {

				x.suppliers.forEach(y =>{

					if( y.id  == supplier.id){
						( <any> y).isInvalid = false;
						( <any> y).wasRemoved = true;
					}
				});
			});

			this.supplierBlackList.push(supplier);
		}
		this.checkIfOrderIsvalid();
	}

    loadData(){

		if(this.orderId != null && this.orderId != ''){

			this.simulationRepository
				.getCotacaoFromOrder(this.orderId)
				.then(x =>  {

					this.selectedQuote = x;

					if(x.blackListSupplier != null){

						this.addRemoveSupplier(x.blackListSupplier);
					}					
				}) 
				.then( () => this.ea.publish('dataLoaded'))
				.catch( e =>  this.nService.presentError(e));
				this.loadDeliveryRule();
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

		this.deliveryRepository
			.getRule(this.selectedQuote.productClass.id)
			.then( (x : DeliveryRule) => { 
				if(x != null){
					this.deliveryRule = <DeliveryRule> x;
					this.viewModel.deliveryScheduleStart = x.deliveryScheduleInitial;
					this.viewModel.deliveryScheduleEnd = x.deliveryScheduleFinal;
					this.viewModel.deliveryDate = DeliveryRule.getNextDeliveryDate(this.deliveryRule);
					this.checkDeliveryDate();
				}
			}) 
			.catch( e => this.nService.presentError(e)); 
	}

	checkDeliveryDate(){

		this.deliveryWasChecked = false;
		this.viewModel.suppliers = [];
		this.selectedQuote.suppliers.forEach(x => {
			this.viewModel.suppliers.push(x.id);
		});

		if(this.viewModel.deliveryDate < new Date()){
			
			this.nService.presentError('A data de entrega deve ser maior ou igual a hoje');		
			this.isOrderValid = false;
		}

		if(this.viewModel.deliveryScheduleStart >= this.viewModel.deliveryScheduleEnd){
			this.nService.presentError('O horário inicial deve ser maior que o horário final');		
			this.isOrderValid = false;
		}

		this.deliveryRepository
			.checkDeliveryRule(this.viewModel)
			.then( (x : CheckDeliveryResult) => {
				
				this.checkDeliveryResult = x;

				x.items.forEach( (item : CheckDeliveryResultItem) =>{
					
						this.selectedQuote.suppliers.forEach(y =>{
							if(y.id == item.supplierId){

								if(! item.isValid){
									( <any> y).isInvalid = true; 
									this.supplierBlackList.push(y);
								}
								else{
									( <any> y).isInvalid = false;
									this.supplierBlackList = this.supplierBlackList.filter(x => x.id != y.id);
								} 
							}
						});

						this.selectedQuote.products.forEach(x => {

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
				this.checkIfOrderIsvalid();
			})
			.catch( e => this.nService.presentError(e));  
	}

	checkIfOrderIsvalid(){
		
		var isValid = true;

		if(this.viewModel.deliveryDate < new Date()){
			isValid = false;
		}

		if(this.viewModel.deliveryScheduleStart >= this.viewModel.deliveryScheduleEnd){
			isValid = false;
		}

		if(this.supplierBlackList.length == this.selectedQuote.suppliers.length){
			isValid = false;
		}

		if(isValid){
			this.isOrderValid = true;
		}
		else{
			this.isOrderValid = false;
		}
	}
	
	generateOrder(){

		this.isProcessing = true;
				
	
		this.selectedResult.deliveryScheduleStart = this.viewModel.deliveryScheduleStart;
		this.selectedResult.deliveryScheduleEnd = this.viewModel.deliveryScheduleEnd;
		this.selectedResult.deliveryDate =  this.viewModel.deliveryDate;
				
		this.orderRepository
			.createOrder(this.selectedResult)
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
		
		this.simulation.betterResults.forEach(x => x != result ? x.isSelected = false : x.isSelected = true );
		this.selectedResult = result;

	}
}