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

@autoinject
export class App {
  		
  	$ 							: any;
	api 						: Rest; 
	router 						: Router;
	numberOfCustomers			: GenericAnalytics;
	numberOfOrders				: GenericAnalytics;
	isLoadingNumberOfCustomers	: boolean;
	isLoadingNumberOfOrders		: boolean; 

	constructor(
			private aurelia: Aurelia, 
			private config: Config, 
			private service : IdentityService, 
			private repository : AnalyticsRepository,
			private nService : NotificationService) {

		this.api = this.config.getEndpoint('csz'); 
		this.isLoadingNumberOfCustomers = true;
		this.isLoadingNumberOfOrders = true;
    }

	  
   	attached(): void { 


		this.loadData();
		/* ScriptRunner.runScript();*/ 
		
		var randomScalingFactor = function() {
			return Math.round(Math.random() * 100);
		};

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
					data: [
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
					],
					backgroundColor: [
						colors.red,
						colors.orange,
						colors.yellow,
						colors.green,
						colors.blue,
					],
					label: 'Dataset 1'
				}],
				labels: [
					'Red',
					'Orange',
					'Yellow',
					'Green',
					'Blue'
				]
			},
			options: {
				responsive: true
			}
		};

		var pie : any;

		var ctx = ( <any> document.getElementById('principaisClientesChart')).getContext('2d');
			pie = new Chart(ctx, config);
			 

		var colorNames = Object.keys(colors); 
	}

	drawPedidosChart(data : AnalyticsSerie){  
  
		
		var color = Chart.helpers.color;

		var dataValues = [];

		data.items.forEach(x => dataValues.push(x.total));

		var barChartData = {
			labels: data.labels,
			datasets: [{
				label: data.name,
				backgroundColor: color("rgb(54, 162, 235)").alpha(0.5).rgbString(),
				borderColor: "rgb(54, 162, 235)",
				borderWidth: 1,
				data: dataValues
			}]

		};
		
		var ctx = ( <any> document.getElementById('pedidos')).getContext('2d');

			var chart = new Chart(ctx, {
				type: 'bar',
				data: barChartData,
				options: {
					responsive: true,
					legend: {
						position: 'top',
					} 
				}
			});
	}

	loadData(){ 

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

		this.repository
			.getOrdersValues()
			.then(x => this.drawPedidosChart(x))
			.catch(e => {
				this.nService.error(e);
				this.isLoadingNumberOfOrders = false;
			});
	}

}
