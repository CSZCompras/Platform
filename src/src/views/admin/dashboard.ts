import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router'; 
import { Rest, Config } from 'aurelia-api'; 
import { Order } from '../../domain/order'; 
import { NotificationService } from '../../services/notificationService';
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
import { AnalyticsRepository } from '../../repositories/analytics/analyticsRepository';
import { AnalyticsSerie } from '../../domain/analytics/analyticsSerie';

@autoinject
export class App {
  		
  	$ 						: any;
	api 					: Rest; 
	router 					: Router;
	startDate 				: Date;
	endDate 				: Date;
	orders					: Order[];
	ordersAnalytics 		: AnalyticsSerie;
	isLoading				: boolean;
	pedidosChart			: Chart;


	constructor(
		private config		: Config, 
		private repository 	: AnalyticsRepository, 
		private nService 	: NotificationService) { 

		this.api = this.config.getEndpoint('csz'); 		
    }

	
   	attached(): void {   
	} 
	
    exportOrders(){ 
        var api = this.config.getEndpoint('csz');
        window.open(api.client.baseUrl + 'ExportOrders?startDate=' + this.startDate + '&endDate=' + this.endDate, '_parent');
    }

	updateDashboards(){			

		this.isLoading = true;		

		this.repository
			.getOrders(this.startDate, this.endDate)
			.then( x => { 
				this.orders = x;
				this.isLoading = false;
			})
			.catch( e => { 				
				this.isLoading = false;
				this.nService.error(e);
			});

		this.repository
			.getOrdersAnalytics(this.startDate, this.endDate)
			.then( x => { 
				this.ordersAnalytics = x;
				this.drawOrdersChart(x);
				this.isLoading = false;
			})
			.catch( e => { 				
				this.isLoading = false;
				this.nService.error(e);
			});
	}

	drawOrdersChart(data : AnalyticsSerie){ 

		
		if(this.pedidosChart != null){
			this.pedidosChart.destroy();
		}

		var values = [];		
		data.items.forEach(x => values.push(x.count));
		
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
			type: 'bar',
			data: {
				datasets: [{
					backgroundColor : colors.red,
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

		var ctx = ( <any> document.getElementById('pedidosChart')).getContext('2d'); 
		this.pedidosChart = new Chart(ctx, config);

	}
}
