import { FoodServiceValidator } from '../../validators/foodServiceValidator';
import { ConsultaCepResult } from '../../domain/consultaCepResult';
import { ConsultaCEPService } from '../../services/consultaCEPService';
import { StateRegistrationRepository } from '../../repositories/stateRegistrationRepository';
import { StateRegistration } from '../../domain/stateRegistration';
import { NotificationService } from '../../services/notificationService';
import { FoodServiceRepository } from '../../repositories/foodServiceRepository';
import { IdentityService } from '../../services/identityService';
import { FoodService } from '../../domain/foodService';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Address } from '../../domain/address';
import { ConsultaCNPJResult } from '../../domain/consultaCNPJResult';
import { ConsultaCNPJService } from '../../services/consultaCNPJService';
import { Identity } from '../../domain/identity';
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';
import 'aurelia-validation';
import { RegisterStatus } from '../../domain/registerStatus';
import { Config } from 'aurelia-api';

@autoinject
export class Cadastro {

	$: any;
	foodService: FoodService;
	stateRegistrations: StateRegistration[];
	currentStep: number;
	totalSteps: number;
	validator: FoodServiceValidator;
	isLoading: boolean;
	isCNPJLoading: boolean;
	identity: Identity;

	files: HTMLInputElement;
	isUploading: boolean;
	selectedFiles: any[];
	uploadNewSocialContract: boolean = false;

	constructor(
		private router: Router,
		private repository: FoodServiceRepository,
		private service: IdentityService,
		private ea: EventAggregator,
		private nService: NotificationService,
		private stateRepo: StateRegistrationRepository,
		private consultaCNPJService: ConsultaCNPJService,
		private consultaCepService: ConsultaCEPService,
		private config: Config) {

		this.currentStep = 1;
		this.totalSteps = 3;
		this.isLoading = false;
		this.identity = this.service.getIdentity();
	}

	runScript(): void {

		var thisForm = '#rootwizard-1';

		if ($(thisForm).length) {

			// Prevent page from jumping when +
			$('.pager li a, .pager li span').on('click', function (e) {
				e.preventDefault();
			});

			var wizardStagesTotal = $(thisForm + ' .tab-pane').length;

			(<any>$)(thisForm).bootstrapWizard({
				onNext: function (tab, navigation, index) {

					if (index <= wizardStagesTotal) {
						$(thisForm + ' .tab-pane').eq(index).addClass('active');
						$(thisForm + ' .tab-pane').eq(index - 1).removeClass('active');
					}

				}, onPrevious: function (tab, navigation, index) {
					// Note: index is the previous frame not the current one
					if (index !== -1) {
						$(thisForm + ' .tab-pane').eq(index).addClass('active');
						$(thisForm + ' .tab-pane').eq(index + 1).removeClass('active');
					}
				}, onTabShow: function (tab, navigation, index) {
					// Update Progress Bar
					var total = navigation.find('li').length;
					var current = index + 1;
					var completionPercentage = (current / total) * 100;

					var progressBar = $(thisForm).closest('.card').find(".card-header .progress-bar");

					progressBar.css({ "width": completionPercentage + "%" }).attr("aria-valuenow", completionPercentage);
				}, onTabClick: function (tab, navigation, index) {
					return false;
				}
			});
		}
	}

	attached(): void {

		this.ea.publish('loadingData');

		this.runScript();
		this.loadData();
	}

	loadData(): void {

		var foodServicePromisse = this.repository
			.getByUser(this.identity.id)
			.then((foodService: FoodService) => {

				this.foodService = foodService;

				if (this.foodService.address == null) {

					this.foodService.address = new Address();
				}

				if (this.foodService.stateRegistration == null) {
					this.foodService.stateRegistration = new StateRegistration();
				}

				this.validator = new FoodServiceValidator(this.foodService);
			}).catch(e => {
				this.nService.presentError(e);
			});

		var stateRegistrationsPromisse = this.stateRepo
			.getAll()
			.then((data: StateRegistration[]) => {
				this.stateRegistrations = data;
			}).catch(e => {
				this.nService.presentError(e);
			});

		Promise.all([foodServicePromisse, stateRegistrationsPromisse]).then(() => {

			if (this.identity.registerStatus != RegisterStatus.Valid && this.foodService.cnpj != null && this.foodService.cnpj != '') {
				this.consultaCNPJ();
			}
			this.ea.publish('dataLoaded');
		});
	}

	consultaCNPJ() {

		if (this.foodService.cnpj.length >= 14) {

			this.isCNPJLoading = true;

			this.consultaCNPJService
				.findCNPJ(this.foodService.cnpj)
				.then((result: ConsultaCNPJResult) => {

					if (result != null) {
						this.foodService.name = result.nome;
						this.foodService.fantasyName = result.fantasia;
						this.foodService.address.cep = result.cep.split(".").join("").replace("-", "");
						this.foodService.address.city = result.municipio;
						this.foodService.address.neighborhood = result.bairro;
						this.foodService.address.number = <any>result.numero;
						this.foodService.address.logradouro = result.logradouro;
						this.foodService.address.complement = result.complemento;
						this.foodService.address.state = result.uf;
						this.validator.validate();
					}
					this.isCNPJLoading = false;
				}).catch(e => {
					this.isCNPJLoading = false;
				});
		}
	}

	consultaCEP() {

		this.validator.addressValidator.validateCep();

		if (this.foodService.address.cep.length >= 8) {

			this.consultaCepService
				.findCEP(this.foodService.address.cep)
				.then((result: ConsultaCepResult) => {

					if (result != null) {

						this.foodService.address.city = result.localidade;
						this.foodService.address.neighborhood = result.bairro;
						this.foodService.address.number = null;
						this.foodService.address.logradouro = result.logradouro;
						this.foodService.address.complement = result.complemento;
						this.foodService.address.state = result.uf;
						this.validator.validate();
					}
				}).catch(e => {

				});
		}
	}

	advance() {
		this.currentStep++;
	}

	back() {
		this.currentStep--;
	}

	save() {

		this.isLoading = true;

		var errors = this.validator.validate();

		if (!this.foodService.socialContract && (!this.selectedFiles || !(this.selectedFiles.length > 0))) {
			errors.push('O contrato social é obrigatório');
		}

		if (errors.length == 0) {

			if (this.foodService.stateRegistration.id != null) {
				this.foodService.stateRegistration = this.stateRegistrations.filter((x: StateRegistration) => x.id == this.foodService.stateRegistration.id)[0];
			}

			this.repository
				.save(this.foodService)
				.then((foodService: FoodService) => {

					if (this.foodService.registerStatus != foodService.registerStatus) {
						this.ea.publish('registerStatusModified', foodService.registerStatus);
						this.foodService.registerStatus = foodService.registerStatus;
					}

					if (this.selectedFiles && this.selectedFiles.length > 0) {
						this.uploadSocialContract();
					}

					this.nService.success('Cadastro realizado!')
					this.isLoading = false;

				}).catch(e => {
					this.isLoading = false;
					this.nService.error(e);
				});
		}
		else {

			this.isLoading = false;

			errors.forEach((error: string) => {
				this.nService.error(error);
			});
		}
	}

	uploadSocialContract() {

		this.isUploading = true;

		let formData = new FormData();

		for (let i = 0; i < this.selectedFiles.length; i++) {
			formData.append('file', this.selectedFiles[i]);
		}

		this.repository
			.uploadSocialContract(formData, this.foodService.id)
			.then(() => {
				this.isUploading = false;
				this.uploadNewSocialContract = false;
				this.files.value = "";
				this.nService.presentSuccess('Contrato atualizado com sucesso!');
				this.loadData();
			}).catch(e => {
				this.files.value = "";
				this.nService.error(e);
				this.isUploading = false;
			});
	}

	downloadSocialContract() {
		var api = this.config.getEndpoint('apiAddress');
		window.open(api.client.baseUrl + 'downloadFoodServiceContractSocial?foodServiceId=' + this.foodService.id, '_blank');
	}

	cancelNewUpload() {
		this.uploadNewSocialContract = false;
		this.selectedFiles = [];
		this.files.value = "";
	}
} 