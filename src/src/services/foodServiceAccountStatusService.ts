import { IdentityService } from './identityService';
import { Identity } from '../domain/identity';
import { Aurelia, autoinject } from 'aurelia-framework';
import { HttpClient, HttpClientConfiguration } from 'aurelia-fetch-client';
import { FoodServiceAccountStatus } from '../domain/foodServiceAccountStatus';
import { FoodServiceRepository } from '../repositories/foodServiceRepository';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { UserType } from '../domain/userType';


@autoinject
export class FoodServiceAccountStatusService {

    private subscription: Subscription;

    private foodServiceAccountStatus: FoodServiceAccountStatus = {
        isRegistered: false,
        hasSocialContract: false,
        hasDeliveryRules: false,
        hasApprovedSuppliers: false,
        hasSuppliers: false,
        hasProducts: false,
        isActive: false
    };

    constructor(
        private foodServiceRepository: FoodServiceRepository,
        private ea: EventAggregator,
        private identityService: IdentityService
    ) {
        this.refresh();
    }

    get(): FoodServiceAccountStatus {
        return this.foodServiceAccountStatus;
    }

    refresh(): Promise<any> {
        if (this.identityService.getIdentity().type != UserType.FoodService) {
            return;
        }

        return this.foodServiceRepository.getAccountStatus()
            .then(x => {
                this.foodServiceAccountStatus.isRegistered = x.isRegistered;
                this.foodServiceAccountStatus.hasSocialContract = x.hasSocialContract;
                this.foodServiceAccountStatus.hasDeliveryRules = x.hasDeliveryRules;
                this.foodServiceAccountStatus.hasApprovedSuppliers = x.hasApprovedSuppliers;
                this.foodServiceAccountStatus.hasSuppliers = x.hasSuppliers;
                this.foodServiceAccountStatus.hasProducts = x.hasProducts;
                this.foodServiceAccountStatus.isActive = x.isActive;

                if (this.foodServiceAccountStatus.isActive && !this.foodServiceAccountStatus.hasApprovedSuppliers && !this.subscription) {
                    this.subscription = this.ea.subscribe('router:navigation:success', () => this.refresh());
                }
                else if (this.foodServiceAccountStatus.hasApprovedSuppliers && this.subscription) {
                    this.subscription.dispose();
                    this.subscription = null;
                }
            });
    }
}
