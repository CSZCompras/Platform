import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router'; 
import { Rest, Config } from 'aurelia-api'; 
import { Order } from '../../domain/order'; 
import { NotificationService } from '../../services/notificationService';
import * as Chart from 'chart.js';
import { AnalyticsRepository } from '../../repositories/analytics/analyticsRepository';
import { AnalyticsSerie } from '../../domain/analytics/analyticsSerie';
import { AnalyticsPeriod } from '../../domain/analytics/analyticsPeriod';
import { FoodServiceOrdersOverview } from '../../domain/analytics/foodServiceOrdersOverview';
import { SupplierOrdersOverview } from '../../domain/analytics/supplierOrdersOverview';
import 'jquery';
import 'popper.js';
import 'bootstrap';
import 'mdbootstrap';
import 'velocity-animate';
import 'velocity';
import 'custom-scrollbar';
import 'jquery-visible';
import 'ie10-viewport'; 

@autoinject
export class App {
  		
  	$ 								: any;
	api 							: Rest; 
	router 							: Router;
	startDate 						: string;
	endDate							: string;
	orders							: Order[];
	fsCreated						: FoodServiceOrdersOverview[];
	suppliersCreated				: SupplierOrdersOverview[];
	fsOrders						: FoodServiceOrdersOverview[];
	supplierOrders					: SupplierOrdersOverview[];
	ordersAnalytics 				: AnalyticsSerie;
	isLoading						: boolean;
	isLoadingNewFoodServices		: boolean;
	isLoadingNewSuppliers			: boolean;
	isLoadingFoodServiceOrders		: boolean;
	isLoadingSupplierOrders			: boolean;
	qtdePedidosChart				: Chart;
	financeiroPedidosChart			: Chart;
	period							: AnalyticsPeriod;


	constructor(
		private config		: Config, 
		private repository 	: AnalyticsRepository, 
		private nService 	: NotificationService) { 

		this.api = this.config.getEndpoint('apiAddress'); 		
    }

	
   	attached(): void {  
		this.setCurrentDate();
		this.period = AnalyticsPeriod.DAILY;
	} 

	updatePeriod(periodString : any){
		this.period =  <AnalyticsPeriod> Number.parseInt(periodString);
	}

	setCurrentDate(){
		var today = new Date();
		var dd = ( <any> String(today.getDate())).padStart(2, '0');  
		var mm = ( <any> String(today.getMonth() + 1)).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		this.startDate =  yyyy + '-' + mm + '-01';
		this.endDate =  yyyy + '-' + mm + '-' + dd;
	}
	
    exportOrders(){ 
        var api = this.config.getEndpoint('apiAddress');
        window.open(api.client.baseUrl + 'ExportOrders?startDate=' + this.startDate + '&endDate=' + this.endDate, '_parent');
    }

	updateDashboards(){		
		
		if(this.startDate != null && this.startDate != '' && this.endDate != null && this.endDate != ''){

			this.isLoading = true;		
			
			if(this.qtdePedidosChart != null){
				this.qtdePedidosChart.destroy();
			}	 
			if(this.financeiroPedidosChart != null){
				this.financeiroPedidosChart.destroy();
			}	

			this.loadFoodServicesCreated();		
			this.loadSuppliersCreated();
			this.loadFoodServicesOverview();
			this.loadSuppliersOverview();

			var p1 = this.repository
							.getOrders(this.startDate, this.endDate)
							.then( x =>  this.orders = x)
							.catch( e => this.nService.error(e));

			var p2 = this.repository
						.getOrdersAnalytics(this.startDate, this.endDate, this.period)
						.then( x => { 
							this.ordersAnalytics = x;
							this.drawOrdersChart(x);
							this.drawFinanceiroOrdersChart(x); 
						}).catch( e => this.nService.error(e));

			Promise.all([p1, p2]).then(x => this.isLoading = false);

		}
		else{
			this.nService.presentError('A data inicial e final são obrigatóras');
		}
	}

	loadSuppliersCreated(){ 

		if(this.period == AnalyticsPeriod.DAILY){

			this.isLoadingNewSuppliers = true;

			this.repository
				.getNewSuppliers(this.startDate, this.endDate)
				.then( x => { 
					this.suppliersCreated = x;
					this.isLoadingNewSuppliers = false;
				})
				.catch( e => {
					this.nService.error(e);
					this.isLoadingNewFoodServices = false;
				});
		}
		else{
			this.suppliersCreated = [];
		}
	}

	loadFoodServicesCreated(){ 

		if(this.period == AnalyticsPeriod.DAILY){

			this.isLoadingNewFoodServices = true;

			this.repository
				.getNewFoodServices(this.startDate, this.endDate)
				.then( x => { 
					this.fsCreated = x;
					this.isLoadingNewFoodServices = false;
				})
				.catch( e => {
					this.nService.error(e);
					this.isLoadingNewFoodServices = false;
				});
		}
		else{
			this.fsCreated = [];
		}
	}

	loadSuppliersOverview(){ 
 

			this.isLoadingSupplierOrders = true;
			this.supplierOrders = [];

			this.repository
				.getSupplierOrders(this.startDate, this.endDate)
				.then( x => { 
					this.supplierOrders = x;
					this.isLoadingSupplierOrders = false;
				})
				.catch( e => {
					this.nService.error(e);
					this.isLoadingSupplierOrders = false;
				}); 
	}

	loadFoodServicesOverview(){  

			this.isLoadingFoodServiceOrders = true;
			this.fsOrders = [];

			this.repository
				.getFoodServiceOrders(this.startDate, this.endDate)
				.then( x => { 
					this.fsOrders = x;
					this.isLoadingFoodServiceOrders = false;
				})
				.catch( e => {
					this.nService.error(e);
					this.isLoadingFoodServiceOrders = false;
				}); 
	}

	drawOrdersChart(data : AnalyticsSerie){ 

		var values = [];		
		data.items.forEach(x => values.push(x.count)); 

		var config = {
			type: 'bar',
			data: {
				datasets: [{
					backgroundColor : "rgb(255, 99, 132)",
					data: values,
					label: 'Pedidos'
				}],
				labels: data.labels
			},
			options: {
				responsive: true,
				legend: {
					display: false
				 }
			}
		}; 

		var ctx = ( <any> document.getElementById('qtdePedidosChart')).getContext('2d'); 
		this.qtdePedidosChart = new Chart(ctx, config);

	}

	drawFinanceiroOrdersChart(data : AnalyticsSerie){ 

		var values = [];		
		data.items.forEach(x => values.push(x.total.toFixed(2))); 

		var config = {
			type: 'bar',
			data: {
				datasets: [{
					backgroundColor : "rgb(255, 99, 132)",
					data: values,
					label: 'Pedidos'
				}],
				labels: data.labels
			},
			options: {
				responsive: true,
				legend: {
					display: false
				 }
			}
		}; 

		var ctx = ( <any> document.getElementById('financeiroPedidosChart')).getContext('2d'); 
		this.financeiroPedidosChart = new Chart(ctx, config);

	}
}
