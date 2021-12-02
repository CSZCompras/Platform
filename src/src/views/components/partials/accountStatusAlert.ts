import { Router } from 'aurelia-router';
import { FoodServiceAccountStatus } from './../../../domain/foodServiceAccountStatus';
import { autoinject } from 'aurelia-dependency-injection';
import { EventAggregator } from 'aurelia-event-aggregator';
import { FoodServiceRepository } from './../../../repositories/foodServiceRepository';
import { FoodServiceAccountStatusService } from '../../../services/foodServiceAccountStatusService';
import { IdentityService } from '../../../services/identityService';
import { UserType } from '../../../domain/userType';

@autoinject
export class AccountStatusAlert {

    foodServiceAccountStatus: FoodServiceAccountStatus;
    visible = false;
    detailsVisible = false;

    constructor(
        private foodServiceRepository: FoodServiceRepository,
        private foodServiceAccountStatusService: FoodServiceAccountStatusService,
        private ea: EventAggregator,
        private router: Router,
        private identityService: IdentityService
    ) {
    }

    attached() {
        if (this.identityService.getIdentity().type != UserType.FoodService) {
            return;
        }

        this.foodServiceAccountStatus = this.foodServiceAccountStatusService.get();
        this.ea.subscribe('router:navigation:success', () => this.refreshAlert());
        this.ea.subscribe('foodServiceAccountStatusChanged', () => this.refreshAlert());
    }

    refreshAlert() {
        this.detailsVisible = false;

        if (this.foodServiceAccountStatus.isActive && this.foodServiceAccountStatus.hasProducts) {
            this.visible = false;
            return;
        }

        if (this.router.currentInstruction.config.name == 'dashboard') {
            this.visible = false;
            return;
        }

        if (this.router.currentInstruction.config.name == 'dashboardFoodService') {
            this.visible = false;
            return;
        }

        if (!this.foodServiceAccountStatus.isRegistered && this.router.currentInstruction.config.name == 'cadastroFoodService') {
            this.visible = false;
            return;
        }

        if (!this.foodServiceAccountStatus.hasDeliveryRules && this.router.currentInstruction.config.name == 'regraDeEntrega') {
            this.visible = false;
            return;
        }

        if (!this.foodServiceAccountStatus.hasSuppliers && this.router.currentInstruction.config.name == 'fornecedores') {
            this.visible = false;
            return;
        }

        if (!this.foodServiceAccountStatus.hasProducts && this.router.currentInstruction.config.name == 'meusProdutos') {
            this.visible = false;
            return;
        }

        setTimeout(() => this.visible = true, 1000);
    }
}