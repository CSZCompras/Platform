import { NotificationService } from '../../services/notificationService'; 
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router'; 
import { FoodServiceRepository } from '../../repositories/foodServiceRepository'; 
import { SimulationRepository } from '../../repositories/simulationRepository';
import { OrderRepository } from '../../repositories/orderRepository';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SupplierViewModel } from '../../domain/supplierViewModel'; 
import { ValidationControllerFactory, ValidationController, validateTrigger } from 'aurelia-validation';
import { FormValidationRenderer } from '../formValidationRenderer';
import { DeliveryRuleRepository } from '../../repositories/deliveryRuleRepository';
import { DeliveryRule } from '../../domain/deliveryRule';
import { CheckDeliveryViewModel } from '../../domain/checkDeliveryViewModel';
import { CheckDeliveryResult } from '../../domain/checkDeliveryResult';
import { CheckDeliveryResultItem } from '../../domain/CheckDeliveryResultItem';
import { SimulationInput } from '../../domain/simulation/simulationInput'; 
import { SimulationResult } from '../../domain/simulation/simulationResult';
import { SimulationSummaryItem } from '../../domain/simulation/simulationSummaryItem'; 
import { Simulation } from '../../domain/simulation/simulation';
import { SimulationMarketInputViewModel } from '../../domain/simulation/simulationMarketInputViewModel';
import { DetalhesProduto } from '../components/partials/detalhesProduto';
import { SimulationInputBaseItem } from '../../domain/simulation/simulationInputBaseItem';
import { DialogService } from 'aurelia-dialog';
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';
import 'aurelia-validation';

@autoinject
export class Cotacao{

	$               				: any;
	orderId							: string;
	currentStep     				: number;
	totalSteps      				: number;
    quotes          				: SimulationInput[];
    selectedQuote   				: SimulationInput ;
    isProcessing    				: boolean;
	simulations      				: Simulation[];	
	orderWasGenerated				: boolean;
	validationController            : ValidationController;
	deliveryWasChecked				: boolean;
	isOrderValid					: boolean; 
	isLoadingQuotes					: boolean; 
	results 						: SimulationResult[]; 
	
    constructor(		
        private router                  	: Router, 	 
        private dialogService           	: DialogService,
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
		this.isLoadingQuotes = true;

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
	
	showHideMarket(market : SimulationMarketInputViewModel){
		this.selectedQuote.markets.forEach( x => ( <any> x).show = false );
		(<any> market).show = true;
	}

	showHideSimulationResultMarket(result : Simulation){
		this.results.forEach( x => ( <any> x).show = false );
		(<any> result).show = true;

	}

	renderSimulationResults(){

		window.setTimeout(()=>{
			$('#tabSimulationResult-' + this.simulations[0].market.id).addClass('active show');
			$('#simulationResult-' + this.simulations[0].market.id).removeClass('fade');
			$('#simulationResult-' + this.simulations[0].market.id).addClass('active');
		}, 500);					
	} 
	
	
	

    search(market : SimulationMarketInputViewModel){  

		if(market.filter == null || market.filter == ''){
			market.filteredItems =  market.items;
		}
		else{
			market.filteredItems = market.items.filter( (item : SimulationInputBaseItem) => {
				
				let isFound = true;

				if(		 item.name.toUpperCase().includes(market.filter.toUpperCase()) 
					||	(item.items.length == 1 && item.items[0].description != null && item.items[0].description.toUpperCase().includes(market.filter.toUpperCase()))
					||	(item.items.length == 1 && item.items[0].brand != null && item.items[0].brand.name.toUpperCase().includes(market.filter.toUpperCase()))
				){

					isFound = true;
				}
				else {
					isFound= false;
				}

				if(isFound){
					return item;
				} 
			});  
		}
    }

    simulate(){

		this.ea.publish('loadingData');  
		this.isProcessing = true;  

		this.simulations 	= [];
		this.results 		= [];

        this.simulationRepository
            .simulate(this.selectedQuote)
            .then(  x => { 
                
				this.simulations = x;
				
				this.simulations.forEach( y => { 
					if(y.bestResult != null){
						this.results.push(y.bestResult);
					}
				});
				this.isProcessing = false;
				this.runScript();
				this.ea.publish('dataLoaded'); 

				if(this.simulations.length > 0){

					this.showHideSimulationResultMarket(this.simulations[0]);
					this.renderSimulationResults();
				}
            })
            .catch( e => {
				this.simulations = [];
                this.nService.presentError(e);
				this.isProcessing = false;
				this.ea.publish('dataLoaded');
            });
	}
	
	showDetails(simulationInputItem : SimulationInputBaseItem){
		

        var params = { SimulationInputBaseItem : simulationInputItem};

        this.dialogService
            .open({ viewModel: DetalhesProduto, model: params, lock: false })
            .whenClosed(response => {
                if (response.wasCancelled) {
                    return;
				}

				if(response.output != null){
					simulationInputItem = response.output;
				}
            });
	}

	back(){
		this.currentStep--;

		if(this.currentStep == 1){
			var market = this.selectedQuote.markets[0];
			this.showHideMarket(market); 
			this.selectedQuote.markets.forEach( market => { 
				market.filteredItems = market.items;
				market.filter = '';
			});
			window.setTimeout(()=>{
				$('#' + market.id).removeClass('fade');
				$('#' + market.id).addClass('active');
			}, 500);
		}
		else if(this.currentStep == 2){
			this.renderSimulationResults();
		}
	}

    attached() : void {		 

		this.ea.publish('loadingData'); 
		this.runScript();
		this.loadData(); 
	}  

	addRemoveSupplier (market : SimulationMarketInputViewModel, supplier : SupplierViewModel){ 

		if(( <any> supplier).wasRemoved && ! (<any> supplier).isInvalid){

			market.suppliers.forEach(x => {
				
				if( x.id  == supplier.id){
					( <any> x).isInvalid = false;
					( <any> x).wasRemoved = false;
				}
			});

			market.items.forEach(x => {

				x.suppliers.forEach(y =>{

					if( y.id  == supplier.id){
						( <any> y).isInvalid = false; 
						( <any> y).wasRemoved = false;
					}
				});
			});

			market.supplierBlackList = market.supplierBlackList.filter(x => x.id != supplier.id);
		}
		else if( ! (<any> supplier).isInvalid){ 

			market.suppliers.forEach(x => {
				
				if( x.id  == supplier.id){

					( <any> x).isInvalid = false; 
					( <any> x).wasRemoved = true;
				}
			});

			market.supplierBlackList.push(supplier);
		}
		this.verifyAvailableProducts(market);
		this.checkIfOrderIsvalid(market);
	}

	verifyAvailableProducts(market : SimulationMarketInputViewModel){

		market.items.forEach( (item : SimulationInputBaseItem) => {
			var countInvalidSuppliers = 0;
			var suppliersProduct = item.suppliers;
			
			suppliersProduct.forEach( supplierProduct =>{

				var supplierBlackList = market.supplierBlackList.filter(x => x.id == supplierProduct.id);
				if(supplierBlackList != null && supplierBlackList.length > 0){
					countInvalidSuppliers++;
				}
			});

			if(countInvalidSuppliers == suppliersProduct.length){
				item.noSuppliers = true;
				if(item.quantity > 0){
					( <any> item).oldQuantity = item.quantity;
					item.quantity = 0;
				}
			}
			else{
				if(item.noSuppliers && ( <any> item).oldQuantity != null){

					item.quantity = ( <any> item).oldQuantity;
					( <any> item).oldQuantity = null;
				}
				item.noSuppliers = false;
			}
		});
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
					this.ea.publish('dataLoaded');
					this.isLoadingQuotes = false;
				}) 
				.catch( e => {
					this.nService.presentError(e);
					this.isLoadingQuotes = false;
				}); 
		} 
	}

	loadDeliveryRule(){

		if(this.selectedQuote != null){ 
			( <any> this.selectedQuote.markets[0]).show = true;  
			this.selectedQuote.markets.forEach( market => { 
				market.filteredItems = market.items;
				market.filter = '';
			});
		}
	
		this.selectedQuote
			.markets
			.forEach(market  => {

				if(market.id != null){

					this.deliveryRepository
						.getRule(market.id)
						.then( (deliveryRule : DeliveryRule) => { 

							if(deliveryRule != null){

								market.deliveryRule = <DeliveryRule> deliveryRule;

								if(market.checkDeliveryViewModel == null){
									market.checkDeliveryViewModel = new CheckDeliveryViewModel();
								}
								market.checkDeliveryViewModel.deliveryScheduleStart = deliveryRule.deliveryScheduleInitial;
								market.checkDeliveryViewModel.deliveryScheduleEnd = deliveryRule.deliveryScheduleFinal;
								market.checkDeliveryViewModel.deliveryDate = DeliveryRule.getNextDeliveryDate(market.deliveryRule);
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

	checkDeliveryDate(market : SimulationMarketInputViewModel){

		this.deliveryWasChecked = false;
		market.checkDeliveryViewModel.suppliers = [];
		
		if(market.checkDeliveryViewModel.deliveryDate != null && market.checkDeliveryViewModel.deliveryScheduleStart != null && market.checkDeliveryViewModel.deliveryScheduleEnd != null){
		
			market.suppliers.forEach(x => {
				market.checkDeliveryViewModel.suppliers.push(x.id);
			});		

			this.deliveryRepository
				.checkDeliveryRule(market.checkDeliveryViewModel)
				.then( (deliveryResult : CheckDeliveryResult) => {
					
					market.checkDeliveryResult = deliveryResult;
					( <any> market).suppliersInvalid = 0;

					deliveryResult.items.forEach( (item : CheckDeliveryResultItem) => {
						
							market.suppliers.forEach(y => {

								if(y.id == item.supplierId){
									
									if(( <any> y).wasRemoved){
										if(! item.isValid){
											( <any> y).isInvalid = true;
										}
									}
									else if(! item.isValid){
										( <any> y).isInvalid = true; 
										market.supplierBlackList.push(y);
										( <any> market).suppliersInvalid++;
									}
									else{
										( <any> y).isInvalid = false;
										market.supplierBlackList = market.supplierBlackList.filter(x => x.id != y.id);
									} 
								}
							});
					});

					this.deliveryWasChecked = true;
					this.verifyAvailableProducts(market);
					this.checkIfOrderIsvalid(market);
			}).catch( e => this.nService.presentError(e));   
		}
	}


	checkIfOrderIsvalid(market : SimulationMarketInputViewModel){
		
		market.isValid = true;

		if(market.checkDeliveryViewModel.deliveryDate < new Date()){
			market.isValid = false;
		}

		if(market.checkDeliveryViewModel.deliveryScheduleStart >= market.checkDeliveryViewModel.deliveryScheduleEnd){
			market.isValid = false;
		}

		if(market.supplierBlackList.length == market.suppliers.length){
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
						if(Array.isArray(e)){
							
							this.back();
							this.back();

							for (let i = 0; i < e.length; i++) {
								this.nService.error(e[i].items); 
							}
							this.loadDeliveryRule();
						}else{
							this.nService.error(e);
						}
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