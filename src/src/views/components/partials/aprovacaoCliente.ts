import { autoinject } from 'aurelia-framework';
import { PriceListRepository } from '../../../repositories/priceListRepository';
import { PriceList } from '../../../domain/priceList';
import { FoodService } from '../../../domain/foodService';
import { DialogController } from 'aurelia-dialog';
import { FoodServiceSupplier } from '../../../domain/foodServiceSupplier';
import { ControllerValidateResult, validateTrigger, ValidationController, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { FormValidationRenderer } from '../../formValidationRenderer';
import { NotificationService } from '../../../services/notificationService';
import { MarketRuleItemRepository } from '../../../repositories/marketRuleItemRepository';
import { IdentityService } from '../../../services/identityService';
import { MarketRuleItem } from '../../../domain/marketRuleItem';

@autoinject
export class AprovacaoCliente {

    isLoading: boolean;
    priceLists: PriceList[];
    selectedPriceList: PriceList;
    paymentTerm: number;
    fsSupplier: FoodServiceSupplier;
    validationController: ValidationController;

    ruleItems: MarketRuleItem[] = [];
    selectedRuleItem: MarketRuleItem;

    constructor(
        private controller: DialogController,
        private identityService: IdentityService,
        private validationControllerFactory: ValidationControllerFactory,
        private notification: NotificationService,
        private priceListRepository: PriceListRepository,
        private marketRuleItemRepository: MarketRuleItemRepository
    ) {

        this.isLoading = true;

        // Validation.
        this.validationController = this.validationControllerFactory.createForCurrentScope();
        this.validationController.addRenderer(new FormValidationRenderer());
        this.validationController.validateTrigger = validateTrigger.blur;
    }

    activate(params) {

        if (params.FoodServiceSupplier != null) {

            this.fsSupplier = params.FoodServiceSupplier;
            this.validationController.addObject(this.fsSupplier);
            this.paymentTerm = this.fsSupplier.paymentTerm;
        }

        ValidationRules
            .ensure((fsSupplier: FoodServiceSupplier) => fsSupplier.paymentTerm)
            .displayName('Prazo de pagamento')
            .required()
            .on(this.fsSupplier);
    }

    loadData() {
        var identity = this.identityService.getIdentity();

        var loadPriceListPromise = this.priceListRepository
            .getAll()
            .then(x => {
                this.priceLists = x;

                if (this.fsSupplier.priceListId != null && this.fsSupplier.priceListId != '') {
                    this.selectedPriceList = this.priceLists.filter(p => p.id == this.fsSupplier.priceListId)[0];
                }
                else if (this.priceLists.length > 0) {
                    this.selectedPriceList = this.priceLists[0];
                }
            });

        var loadRuleItemsPromise = this.marketRuleItemRepository
            .getRuleItems(identity.id)
            .then(ruleItems => {
                this.ruleItems = ruleItems;

                if (this.fsSupplier.marketRuleItemId) {
                    this.selectedRuleItem = this.ruleItems.filter(x => x.id === this.fsSupplier.marketRuleItemId)[0];
                }
                else {
                    this.selectedRuleItem = null;
                }
            });

        Promise.all([loadPriceListPromise, loadRuleItemsPromise])
            .then(() => {
                this.isLoading = false;
            })
            .catch(e => {
                this.isLoading = false;
            });
    }

    attached(): void {

        this.loadData();
    }

    save() {
        this.validationController
            .validate()
            .then((result: ControllerValidateResult) => {

                if (result.valid) {
                    if (this.selectedPriceList != null && (<any>this.selectedPriceList) != '' && this.selectedRuleItem) {
                        this.controller.ok({
                            priceList: this.selectedPriceList,
                            paymentTerm: this.fsSupplier.paymentTerm,
                            ruleItem: this.selectedRuleItem
                        });
                    }
                }
                else {
                    this.notification.error('Erros de validação foram encontrados');
                }
            });
    }

    cancel() {
        this.fsSupplier.paymentTerm = this.paymentTerm;
        this.controller.cancel();
    }
}