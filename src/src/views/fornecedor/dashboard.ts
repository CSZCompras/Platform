import { ScriptRunner } from '../../services/scriptRunner';
import { autoinject, Aurelia } from 'aurelia-framework';
import { Router, RouterConfiguration, NavigationInstruction } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { Rest, Config } from 'aurelia-api';
import { AnalyticsRepository } from '../../repositories/analytics/analyticsRepository';
import { IdentityService } from '../../services/identityService';
import { NotificationService } from '../../services/notificationService';
import { GenericAnalytics } from '../../domain/analytics/genericAnalytics'; 
import 'jquery';
import 'popper.js';
import 'bootstrap';
import 'mdbootstrap';
import 'velocity-animate';
import 'velocity';
import 'custom-scrollbar';
import 'jquery-visible';
import 'ie10-viewport';
import * as Chart from 'chart.js';
import { AnalyticsSerie } from '../../domain/analytics/analyticsSerie';
import { OrderPeriod } from '../../domain/analytics/orderPeriod';
import { Order } from '../../domain/order';
import { EvaluationRepository } from '../../repositories/evaluationRepository';
import { Evaluation } from '../../domain/evaluation';
import { Identity } from '../../domain/identity';
import { RegisterStatus } from '../../domain/registerStatus';

@autoinject
export class App {
  		
  	$ 							: any;
	api 						: Rest; 
	router 						: Router;
	numberOfCustomers			: GenericAnalytics;
	numberOfOrders				: GenericAnalytics;
	isLoadingNumberOfCustomers	: boolean;
	isLoadingNumberOfOrders		: boolean; 
	period						: OrderPeriod;
	pedidosChart				: Chart;
	clientesChart				: Chart;
	produtosChart				: Chart;
	evaluations                 : Evaluation[];
	identity					: Identity;

	constructor(
			private aurelia			: Aurelia, 
			private config			: Config, 
			private service 		: IdentityService, 
			private repository 		: AnalyticsRepository,
			private evalRepository  : EvaluationRepository,
			private nService 		: NotificationService) {


		this.api = this.config.getEndpoint('csz'); 
		this.isLoadingNumberOfCustomers = true;
		this.isLoadingNumberOfOrders = true;
		this.identity = this.service.getIdentity();
		this.period = OrderPeriod.ThisYear;
    }

	  
   	attached(): void { 

		if(this.identity.registerStatus == RegisterStatus.Valid){
			this.loadData();
		} 
		/* ScriptRunner.runScript();*/  

	}

	drawClientesChart(data : AnalyticsSerie){

		var randomScalingFactor = function() {
			return Math.round(Math.random() * 100);
		}; 

		var values = [];		
		data.items.forEach(x => values.push(x.total));
		
		var colors = {
			blue :  "rgb(54, 162, 235)",
			green : "rgb(75, 192, 192)",
			grey : "rgb(201, 203, 207)",
			orange : "rgb(255, 159, 64)",
			purple : "rgb(153, 102, 255)", 
			red : "rgb(255, 99, 132)",
			yellow : "rgb(255, 205, 86)"
		};
		

		var config = {
			type: 'pie',
			data: {
				datasets: [{
					data: values,
					backgroundColor: [
						colors.red,
						colors.orange,
						colors.yellow,
						colors.green,
						colors.blue,
					],
					label: 'Clientes'
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

		 

		var ctx = ( <any> document.getElementById('principaisClientesChart')).getContext('2d');

		this.clientesChart = new Chart(ctx, config);

	}

	

	drawProductsChart(data : AnalyticsSerie){

		var randomScalingFactor = function() {
			return Math.round(Math.random() * 100);
		}; 

		var values = [];		
		data.items.forEach(x => values.push(x.total));
		
		var colors = {
			blue :  "rgb(54, 162, 235)",
			green : "rgb(75, 192, 192)",
			grey : "rgb(201, 203, 207)",
			orange : "rgb(255, 159, 64)",
			purple : "rgb(153, 102, 255)", 
			red : "rgb(255, 99, 132)",
			yellow : "rgb(255, 205, 86)"
		};
		

		var config = {
			type: 'pie',
			data: {
				datasets: [{
					data: values,
					backgroundColor: [
						colors.green,
						colors.blue,
						colors.red,
						colors.orange,
						colors.yellow
					],
					label: 'Produtos'
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

		 

		var ctx = ( <any> document.getElementById('principaisProdutosChart')).getContext('2d');
		this.produtosChart = new Chart(ctx, config);

	}

	drawPedidosChart(data : AnalyticsSerie[]){  
  
		
		var color = Chart.helpers.color;

		var values0 = [];
		data[0].items.forEach(x => values0.push(x.total));

		var values1 = [];
		data[1].items.forEach(x => values1.push(x.total));

		var chartData = {
			labels: data[0].labels,
			datasets: [{
				label: data[0].name,
				backgroundColor: color("rgb(54, 162, 235)").alpha(0.5).rgbString(),
				borderColor: "rgb(54, 162, 235)",
				borderWidth: 1,
				data: values0
			},{
				label: data[1].name,
				backgroundColor: color("rgb(255, 99, 132)").alpha(0.5).rgbString(),
				borderColor: "rgb(255, 99, 132)",
				borderWidth: 1,
				data: values1
			}]

		};
		
		var ctx = ( <any> document.getElementById('pedidos')).getContext('2d');

		if(this.pedidosChart != null){
			this.pedidosChart.destroy();
		}

		this.pedidosChart = new Chart(ctx, {
			type: 'bar',
			data: chartData,
			options: {
				responsive: true,
				legend: {
					position: 'top',
				} 
			}
		});
	}

	loadData(){ 

		this.loadOrdersValues(OrderPeriod.ThisYear);

		this.loadMainClients(OrderPeriod.ThisYear);

		this.loadMainProdutcs();

		this.repository
			.getNumberOfCustomers()
			.then(x => {
				this.numberOfCustomers = x;
				this.isLoadingNumberOfCustomers = false;
			})
			.catch(e => {
				this.nService.error(e);
				this.isLoadingNumberOfCustomers = false;
			});

		
		this.evalRepository
			.getMyEvaluations()
			.then(x =>{
				this.evaluations = x;
			})
			.catch( e => {             
				this.nService.presentError(e);
			});

		this.repository
			.getNumberOfOrders()
			.then(x => {
				this.numberOfOrders = x;
				this.isLoadingNumberOfOrders = false;
			})
			.catch(e => {
				this.nService.error(e);
				this.isLoadingNumberOfOrders = false;
			});  
	}

	loadOrdersValues(period : OrderPeriod){  

		if(this.pedidosChart != null){
			this.pedidosChart.destroy();
			this.pedidosChart = null;
		}

		this.repository
			.getOrdersValues(period)
			.then(x => this.drawPedidosChart(x))
			.catch(e => {
				this.nService.error(e);
				this.isLoadingNumberOfOrders = false;
			}); 
	}
	
	loadMainClients(period : OrderPeriod){

		if(this.clientesChart != null){
			this.clientesChart.destroy();
			this.clientesChart = null;
		}

		this.repository
			.getMainClients(period)
			.then(x => this.drawClientesChart(x))
			.catch(e => {
				this.nService.error(e);
				this.isLoadingNumberOfOrders = false;
			}); 
	}

	loadMainProdutcs(){
			

		if(this.produtosChart != null){
			this.produtosChart.destroy();
			this.produtosChart = null;
		}

		this.repository
			.getMainProducts()
			.then(x => this.drawProductsChart(x))
			.catch(e => {
				this.nService.error(e);
				this.isLoadingNumberOfOrders = false;
			}); 

	}

	

}
