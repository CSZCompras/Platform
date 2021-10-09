import { FoodServiceAccountStatusService } from './../../services/foodServiceAccountStatusService';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { FoodServiceAccountStatus } from '../../domain/foodServiceAccountStatus';

@autoinject
export class MeusProdutos {

	foodServiceAccountStatus: FoodServiceAccountStatus;

	constructor(
		private router: Router,
		private ea: EventAggregator,
		private foodServiceAccountStatusService: FoodServiceAccountStatusService
	) {
	}

	attached() {
		this.ea.publish('loadingData');
		this.loadData();
	}

	loadData(): void {
		this.foodServiceAccountStatus = this.foodServiceAccountStatusService.get();

		if (!this.foodServiceAccountStatus.hasApprovedSuppliers) {
			this.ea.publish('dataLoaded');
		}
	}
}