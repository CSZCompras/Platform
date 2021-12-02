import { FoodServiceAccountStatus } from './../../../domain/foodServiceAccountStatus';
import { autoinject } from 'aurelia-dependency-injection';
import { EventAggregator } from 'aurelia-event-aggregator';
import { FoodServiceRepository } from './../../../repositories/foodServiceRepository';
import { FoodServiceAccountStatusService } from '../../../services/foodServiceAccountStatusService';
import { IdentityService } from '../../../services/identityService';
import { UserType } from '../../../domain/userType';

@autoinject
export class AccountStatusCard {

    foodServiceAccountStatus: FoodServiceAccountStatus;
    visible: boolean = false;

    constructor(
        private foodServiceRepository: FoodServiceRepository,
        private foodServiceAccountStatusService: FoodServiceAccountStatusService,
        private ea: EventAggregator,
        private identityService: IdentityService
    ) {

        if (this.identityService.getIdentity().type != UserType.FoodService) {
            return;
        }

        this.foodServiceAccountStatus = this.foodServiceAccountStatusService.get();
        this.visible = !this.foodServiceAccountStatus.isActive || !this.foodServiceAccountStatus.hasProducts;
    }
}