import { NotificationService } from '../../services/notificationService';
import { IdentityService } from '../../services/identityService';
import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ProductRepository } from '../../repositories/productRepository';
import { ProductClass } from '../../domain/productClass';
import { DeliveryRule } from '../../domain/deliveryRule';
import 'jquery-mask-plugin';
import { DeliveryRuleRepository } from '../../repositories/deliveryRuleRepository';
import { FoodServiceAccountStatusService } from '../../services/foodServiceAccountStatusService';

@autoinject
export class RegraDeEntrega {

    rule: DeliveryRule;
    isLoading: boolean;
    canEdit: boolean;
    foodServiceId: string;
    productClasses: ProductClass[];
    selectedClass: ProductClass;
    rules: DeliveryRule[];

    constructor(
        private service: IdentityService,
        private ea: EventAggregator,
        private nService: NotificationService,
        private productRepository: ProductRepository,
        private deliveryRepository: DeliveryRuleRepository,
        private foodServiceAccountStatusService: FoodServiceAccountStatusService
    ) {

        this.isLoading = false;
        this.canEdit = true;
    }


    attached(): void {

        if (this.canEdit) {
            this.ea.publish('loadingData');
        }
        this.loadData();
    }


    activate(params) {

        if (params.CanEdit != null) {
            this.canEdit = params.CanEdit;
        }
        if (params.FoodServiceId) {
            this.foodServiceId = params.FoodServiceId;
        }
    }

    loadData(): void {

        if (this.canEdit) {

            this.productRepository
                .getAllClasses()
                .then((classes: ProductClass[]) => {
                    this.productClasses = classes;
                    if (classes.length > 0) {
                        this.selectedClass = classes[0];
                        this.loadRule();
                    }
                })
                .then(() => this.ea.publish('dataLoaded'))
                .catch(e => {
                    this.nService.presentError(e);
                });

        }
        else {

            this.deliveryRepository
                .getRules(this.foodServiceId)
                .then((rules: DeliveryRule[]) => {
                    this.rules = rules;
                    this.productClasses = [];
                    this.rules.forEach(x => this.productClasses.push(x.productClass));
                    if (this.rules.length > 0) {
                        this.rule = this.rules[0];
                    }
                    this.ea.publish('dataLoaded');
                })
                .catch(e => {
                    this.nService.presentError(e);
                });

        }
    }

    loadRule(): void {

        if (this.canEdit) {

            this.deliveryRepository
                .getRule(this.selectedClass.id)
                .then((x: DeliveryRule) => {

                    if (x == null) {
                        this.rule = new DeliveryRule();
                        delete this.rule.id;
                        this.rule.productClass = this.selectedClass;
                    }
                    else {
                        this.rule = x;
                    }

                })
                .catch(e => this.nService.presentError(e));

        }
        else {
            let rules = this.rules.filter(x => x.productClass.id == this.selectedClass.id);
            if (rules.length > 0) {
                this.rule = rules[0];
            }
        }
    }

    save() {

        if (this.canEdit) {
            this.isLoading = true;

            this.deliveryRepository
                .save(this.rule)
                .then((result: any) => {
                    this.rule = result;
                    this.nService.success('Regra salva com sucesso!');

                    this.foodServiceAccountStatusService.refresh()
                        .then(() => this.ea.publish('foodServiceAccountStatusChanged'));

                    this.isLoading = false;

                }).catch(e => {
                    this.nService.error(e);
                    this.isLoading = false;
                });

        }
    }
}