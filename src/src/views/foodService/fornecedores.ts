import { NotificationService } from '../../services/notificationService';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SupplierConnectionRepository } from '../../repositories/supplierConnectionRepository';
import { ProductRepository } from '../../repositories/productRepository';
import { ProductCategory } from '../../domain/productCategory';
import { FoodServiceSupplier } from '../../domain/foodServiceSupplier';
import { SupplierViewModel } from '../../domain/supplierViewModel';
import { BlockSupplierConnectionViewModel } from '../../domain/blockSupplierConnectionViewModel';
import { ProductClass } from '../../domain/productClass';
import { ConnectionStatus } from '../../domain/connectionStatus';
import { FoodServiceAccountStatusService } from '../../services/foodServiceAccountStatusService';

@autoinject
export class Fornecedores {

	filteredSuppliers: SupplierViewModel[];
	suppliers: SupplierViewModel[];
	categories: ProductCategory[];
	selectedCategory: string;
	title: string;
	type: number;
	filter: string;
	tipoFiltro: string;
	isLoading: boolean;
	showDetails: boolean;
	classes: ProductClass[];
	selectedMarket: ProductClass;

	constructor(
		private repository: SupplierConnectionRepository,
		private productRepository: ProductRepository,
		private nService: NotificationService,
		private ea: EventAggregator,
		private foodServiceAccountStatusService: FoodServiceAccountStatusService
	) {

		this.tipoFiltro = '3';

		this.ea.subscribe('waitingToApprove', (conn) => {

			this.suppliers.forEach(x => {

				if (x.supplier.id == conn.supplierId) {
					x.status = conn.status;
				}
			});
		});

		this.ea.subscribe('registrationApproved', (conn) => {


			this.suppliers.forEach(x => {

				if (x.supplier.id == conn.supplierId) {
					x.status = conn.status;
				}
			});
		});

		this.ea.subscribe('registrationRejected', (conn) => {

			this.suppliers.forEach(x => {

				if (x.supplier.id == conn.supplierId) {
					x.status = conn.status;
				}
			});
		});

		this.ea.subscribe('clientBlocked', (conn) => {

			this.suppliers.forEach(x => {

				if (x.supplier.id == conn.supplierId) {
					x.status = conn.status;
				}
			});
		});

		this.ea.subscribe('waitingToApprove', (conn) => {

			this.suppliers.forEach(x => {

				if (x.supplier.id == conn.supplierId) {
					x.status = conn.status;
				}
			});
		});


		this.ea.subscribe('showSupplierDetailsCanceled', () => {
			this.showDetails = false;
			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
		});

		this.showDetails = false;
	}

	attached() {
		this.ea.publish('loadingData');
		this.loadData();
	}

	loadData(): void {

		this.isLoading = true;

		this.productRepository
			.getAllClasses()
			.then(x => {
				this.classes = x;
				var option = new ProductClass();
				option.id = '0';
				option.name = 'Todos';
				this.classes.unshift(option);
				this.alterView()
					.then(() => {
						this.ea.publish('dataLoaded');
						this.isLoading = false;
					});
			});
	}

	alterView(): Promise<any> {

		this.isLoading = true;

		this.filteredSuppliers = [];
		this.suppliers = [];

		var type = Number.parseInt(this.tipoFiltro);

		if (type == 1) {
			this.title = 'Fornecedores Sugeridos';
			return this.loadSuggestedSuppliers().then(_ => this.search());
		}
		else if (type == 2) {
			this.title = 'Meus fornecedores';
			return this.loadMySuppliers().then(_ => this.search());
		}
		else if (type == 3) {
			this.title = 'Todos fornecedores';
			return this.loadAllSuppliers().then(_ => this.search());
		}
		else if (type == 4) {
			this.title = 'Todos fornecedores';
			return this.loadBlockedSuppliers().then(_ => this.search());
		}
	}

	loadSuggestedSuppliers(): Promise<any> {

		return this.repository
			.getSuggestedSuppliers()
			.then((data: SupplierViewModel[]) => {
				this.suppliers = data;
				this.search();
				this.ea.publish('dataLoaded');
				this.isLoading = false;
			});
	}

	loadMySuppliers(): Promise<any> {

		return this.repository
			.getMySuppliers()
			.then((data: SupplierViewModel[]) => {
				this.suppliers = data;
				this.filteredSuppliers = data;
				this.ea.publish('dataLoaded');
				this.isLoading = false;
			});
	}

	loadBlockedSuppliers(): Promise<any> {

		return this.repository
			.getMyBlockedSuppliers()
			.then((data: SupplierViewModel[]) => {
				this.suppliers = data;
				this.filteredSuppliers = data;
				this.ea.publish('dataLoaded');
				this.isLoading = false;
			});
	}

	loadAllSuppliers(): Promise<any> {

		return this.repository
			.getAllSuppliers()
			.then((data: SupplierViewModel[]) => {
				this.suppliers = data;
				this.filteredSuppliers = data;
				this.ea.publish('dataLoaded');
				this.isLoading = false;
			});
	}

	connect(viewModel: SupplierViewModel) {

		(<any>viewModel).isLoading = true;

		this.repository
			.connect(viewModel.supplier)
			.then((connection: FoodServiceSupplier) => {
				viewModel.status = 1;
				this.nService.presentSuccess('A solicitação de conexão foi realizada com sucesso!');

				this.foodServiceAccountStatusService.refresh()
					.then(() => this.ea.publish('foodServiceAccountStatusChanged'));

				(<any>viewModel).isLoading = false;
			})
			.catch(e => {
				this.nService.presentError(e);
				(<any>viewModel).isLoading = false;
			});
	}

	block(viewModel: SupplierViewModel) {

		(<any>viewModel).isLoading = true;


		var vm = new BlockSupplierConnectionViewModel();
		vm.supplierId = viewModel.supplier.id;

		this.repository
			.block(vm)
			.then((data: any) => {
				(<any>viewModel).isLoading = false;
				viewModel.status = 6;
				this.nService.presentSuccess('Fornecedor bloqueado com sucesso!');
			}).catch(e => {

				this.nService.presentError(e);
				(<any>viewModel).isLoading = false;
			});

	}

	unblock(viewModel: SupplierViewModel) {

		(<any>viewModel).isLoading = true;


		var vm = new BlockSupplierConnectionViewModel();
		vm.supplierId = viewModel.supplier.id;

		this.repository
			.unblock(vm)
			.then((data: any) => {
				(<any>viewModel).isLoading = false;
				viewModel.status = 2;
				this.nService.presentSuccess('Fornecedor desbloqueado com sucesso!');
			}).catch(e => {

				this.nService.presentError(e);
				(<any>viewModel).isLoading = false;
			});

	}

	search() {

		this.filteredSuppliers = this.suppliers.filter((x: SupplierViewModel) => {

			var isFound = true;

			if (this.selectedMarket != null && this.selectedMarket.id != "0") {
				isFound = x.markets.filter(x => x.toUpperCase().includes(this.selectedMarket.name.toUpperCase())).length > 0;
			}

			if (isFound) {

				if ((this.filter != null && this.filter != '')) {

					if (x.supplier.name.toUpperCase().includes(this.filter.toUpperCase())) {
						return true;
					}
					else {
						return false;
					}
				}
				else {
					return isFound;
				}
			}
		});
	}

	showSupplierDetails(x: SupplierViewModel) {

		this.showDetails = true;
		let loadConnectionDetails = x.status == ConnectionStatus.Rejected ? true : false;
		this.ea.publish('showSupplierDetails', { supplierId: x.supplier.id, edit: false, loadConnection: loadConnectionDetails });
	}
}