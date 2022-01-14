import { MarketRuleValidator } from '../../validators/marketRuleValidator';
import { MarketRuleItemValidator } from './../../validators/marketRuleItemValidator';
import { MarketRule } from '../../domain/marketRule';
import { MarketRuleItem } from '../../domain/marketRuleItem';
import { MarketRuleRepository } from '../../repositories/marketRuleRepository';
import { MarketRuleItemRepository } from '../../repositories/marketRuleItemRepository';
import { NotificationService } from '../../services/notificationService';
import { IdentityService } from '../../services/identityService';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import 'jquery-mask-plugin';
import 'twitter-bootstrap-wizard';

@autoinject
export class RegrasDeMercado {

    isLoading: boolean = false;

    rule: MarketRule;
    validator: MarketRuleValidator;
    emailNewClient: string;
    emailsNewClient: string[] = [];
    emailNewOrder: string;
    emailsNewOrder: string[] = [];

    isNewRuleItem: boolean = false;
    ruleItem: MarketRuleItem;
    ruleItemValidator: MarketRuleItemValidator;
    ruleItems: MarketRuleItem[] = [];

    constructor(
        private router: Router,
        private service: IdentityService,
        private ea: EventAggregator,
        private nService: NotificationService,
        private repository: MarketRuleRepository,
        private marketRuleItemRepository: MarketRuleItemRepository
    ) {
    }

    attached(): void {
        this.ea.publish('loadingData');
        this.loadData();
    }

    addEmailNewClient(): void {
        if (this.emailsNewClient.find(x => x === this.emailNewClient)) {
            this.nService.error('Este e-mail já foi adicionado');
            return;
        }

        if (this.emailNewClient != null && this.emailNewClient != '') {
            this.emailsNewClient.push(this.emailNewClient);
            this.emailNewClient = '';
        }
    }

    removeEmailNewClient(email) {
        this.emailsNewClient.splice(this.emailsNewClient.findIndex(e => e === email), 1);
    }

    addEmailNewOrder() {
        if (this.emailsNewOrder.find(x => x === this.emailNewOrder)) {
            this.nService.error('Este e-mail já foi adicionado');
            return;
        }

        if (this.emailNewOrder != null && this.emailNewOrder != '') {
            this.emailsNewOrder.push(this.emailNewOrder);
            this.emailNewOrder = '';
        }
    }

    removeEmailNewOrder(email) {
        this.emailsNewOrder.splice(this.emailsNewOrder.findIndex(e => e === email), 1);
    }

    receiverNewClientChanged(email) {
        if (email == null || email == '') {
            this.removeEmailNewClient(email);
        }
    }


    sendNotificationToNewClientChanged() {
        if (!this.rule.sendNotificationToNewClient) {
            this.emailNewClient = '';
        }
    };

    loadData(): void {
        var identity = this.service.getIdentity();

        var loadRulePromise = this.repository
            .getRule(identity.id)
            .then((rule: MarketRule) => {
                if (rule == null) {
                    this.rule = new MarketRule();
                }
                else {
                    this.rule = rule;
                    if (this.rule.sendNotificationToNewClient && this.rule.receiverNewClient != null && this.rule.receiverNewClient != '') {

                        this.rule
                            .receiverNewClient
                            .split(';')
                            .filter(r => r != null && r != '')
                            .forEach(r => this.emailsNewClient.push(r));
                    }
                    if (this.rule.sendNotificationToNewOrder && this.rule.receiverNewOrder != null && this.rule.receiverNewOrder != '') {

                        this.rule
                            .receiverNewOrder
                            .split(';')
                            .filter(r => r != null && r != '')
                            .forEach(r => this.emailsNewOrder.push(r));
                    }
                }
                this.validator = new MarketRuleValidator(this.rule);
            })
            .catch(e => {
                this.nService.presentError(e);
            });

        var loadRuleItemsPromise = this.marketRuleItemRepository
            .getRuleItems(identity.id)
            .then(ruleItems => {
                this.ruleItems = ruleItems;
            })
            .catch(e => {
                this.nService.presentError(e);
            });


        Promise.all([loadRulePromise, loadRuleItemsPromise])
            .then(() => {
                this.ea.publish('dataLoaded');
            });
    }


    onRuleItemChange(): void {
        if (!this.ruleItem) {
            this.ruleItemValidator = null;
            return;
        }

        this.ruleItemValidator = new MarketRuleItemValidator(this.ruleItem);
    }

    onNewRuleItemStart(): void {
        var identity = this.service.getIdentity();
        this.ruleItem = new MarketRuleItem();
        this.ruleItem.supplierId = identity.companyId;
        this.ruleItemValidator = new MarketRuleItemValidator(this.ruleItem);
        this.isNewRuleItem = true;
    }

    onNewRuleItemCancel(): void {
        this.ruleItem = null;
        this.ruleItemValidator = null;
        this.isNewRuleItem = false;
    }

    acceptOrderOnMondayChanged() {
        if (!this.ruleItem.acceptOrderOnMonday) {
            this.ruleItem.acceptOrderOnMondayStart = null;
            this.ruleItem.acceptOrderOnMondayEnd = null;
            this.ruleItemValidator.isAcceptOrderOnMondayStartInvalid = null;
            this.ruleItemValidator.isAcceptOrderOnMondayEndInvalid = null;
        }
    }

    acceptOrderOnTuesdayChanged() {
        if (!this.ruleItem.acceptOrderOnTuesday) {
            this.ruleItem.acceptOrderOnTuesdayStart = null;
            this.ruleItem.acceptOrderOnTuesdayEnd = null;
            this.ruleItemValidator.isAcceptOrderOnTuesdayStartInvalid = null;
            this.ruleItemValidator.isAcceptOrderOnTuesdayEndInvalid = null;
        }
    }

    acceptOrderOnWednesdayChanged() {
        if (!this.ruleItem.acceptOrderOnWednesday) {
            this.ruleItem.acceptOrderOnWednesdayStart = null;
            this.ruleItem.acceptOrderOnWednesdayEnd = null;
            this.ruleItemValidator.isAcceptOrderOnWednesdayStartInvalid = null;
            this.ruleItemValidator.isAcceptOrderOnWednesdayEndInvalid = null;
        }
    }

    acceptOrderOnThursdayChanged() {
        if (!this.ruleItem.acceptOrderOnThursday) {
            this.ruleItem.acceptOrderOnThursdayStart = null;
            this.ruleItem.acceptOrderOnThursdayEnd = null;
            this.ruleItemValidator.isAcceptOrderOnThursdayStartInvalid = null;
            this.ruleItemValidator.isAcceptOrderOnThursdayEndInvalid = null;
        }
    }

    acceptOrderOnFridayChanged() {
        if (!this.ruleItem.acceptOrderOnFriday) {
            this.ruleItem.acceptOrderOnFridayStart = null;
            this.ruleItem.acceptOrderOnFridayEnd = null;
            this.ruleItemValidator.isAcceptOrderOnFridayStartInvalid = null;
            this.ruleItemValidator.isAcceptOrderOnFridayEndInvalid = null;
        }
    }

    acceptOrderOnSaturdayChanged() {
        if (!this.ruleItem.acceptOrderOnSaturday) {
            this.ruleItem.acceptOrderOnSaturdayStart = null;
            this.ruleItem.acceptOrderOnSaturdayEnd = null;
            this.ruleItemValidator.isAcceptOrderOnSaturdayStartInvalid = null;
            this.ruleItemValidator.isAcceptOrderOnSaturdayEndInvalid = null;
        }
    }

    acceptOrderOnSundayChanged() {
        if (!this.ruleItem.acceptOrderOnSunday) {
            this.ruleItem.acceptOrderOnSundayStart = null;
            this.ruleItem.acceptOrderOnSundayEnd = null;
            this.ruleItemValidator.isAcceptOrderOnSundayStartInvalid = null;
            this.ruleItemValidator.isAcceptOrderOnSundayEndInvalid = null;
        }
    }

    deliveryOnMondayChanged() {
        if (!this.ruleItem.deliveryOnMonday) {
            this.ruleItem.deliveryOnMondayStart = null;
            this.ruleItem.deliveryOnMondayEnd = null;
            this.ruleItemValidator.isDeliveryOnMondayStartInvalid = null;
            this.ruleItemValidator.isDeliveryOnMondayEndInvalid = null;
        }
    }

    deliveryOnTuesdayChanged() {
        if (!this.ruleItem.deliveryOnTuesday) {
            this.ruleItem.deliveryOnTuesdayStart = null;
            this.ruleItem.deliveryOnTuesdayEnd = null;
            this.ruleItemValidator.isDeliveryOnTuesdayStartInvalid = null;
            this.ruleItemValidator.isDeliveryOnTuesdayEndInvalid = null;
        }
    }

    deliveryOnWednesdayChanged() {
        if (!this.ruleItem.deliveryOnWednesday) {
            this.ruleItem.deliveryOnWednesdayStart = null;
            this.ruleItem.deliveryOnWednesdayEnd = null;
            this.ruleItemValidator.isDeliveryOnWednesdayStartInvalid = null;
            this.ruleItemValidator.isDeliveryOnWednesdayEndInvalid = null;
        }
    }

    deliveryOnThursdayChanged() {
        if (!this.ruleItem.deliveryOnThursday) {
            this.ruleItem.deliveryOnThursdayStart = null;
            this.ruleItem.deliveryOnThursdayEnd = null;
            this.ruleItemValidator.isDeliveryOnThursdayStartInvalid = null;
            this.ruleItemValidator.isDeliveryOnThursdayEndInvalid = null;
        }
    }

    deliveryOnFridayChanged() {
        if (!this.ruleItem.deliveryOnFriday) {
            this.ruleItem.deliveryOnFridayStart = null;
            this.ruleItem.deliveryOnFridayEnd = null;
            this.ruleItemValidator.isDeliveryOnFridayStartInvalid = null;
            this.ruleItemValidator.isDeliveryOnFridayEndInvalid = null;
        }
    }

    deliveryOnSaturdayChanged() {
        if (!this.ruleItem.deliveryOnSaturday) {
            this.ruleItem.deliveryOnSaturdayStart = null;
            this.ruleItem.deliveryOnSaturdayEnd = null;
            this.ruleItemValidator.isDeliveryOnSaturdayStartInvalid = null;
            this.ruleItemValidator.isDeliveryOnSaturdayEndInvalid = null;
        }
    }

    deliveryOnSundayChanged() {
        if (!this.ruleItem.deliveryOnSunday) {
            this.ruleItem.deliveryOnSundayStart = null;
            this.ruleItem.deliveryOnSundayEnd = null;
            this.ruleItemValidator.isDeliveryOnSundayStartInvalid = null;
            this.ruleItemValidator.isDeliveryOnSundayEndInvalid = null;
        }
    }


    saveRuleItem() {
        var errors = this.ruleItemValidator.validate();

        if (errors.length > 0) {
            errors.forEach((error: string) => {
                this.nService.error(error);
            });
            return;
        }

        this.isLoading = true;

        this.marketRuleItemRepository
            .save(this.ruleItem)
            .then((marketRuleItem: MarketRuleItem) => {
                this.nService.success('Cadastro realizado')
                this.isLoading = false;

                debugger;
                if (this.isNewRuleItem) {
                    this.ruleItem.id = marketRuleItem.id;
                    this.ruleItems.push(this.ruleItem);
                    this.isNewRuleItem = false;
                }
            })
            .catch(e => {
                this.nService.error(e);
                this.isLoading = false;
            });
    }

    saveAlertas() {
        if (this.rule.sendNotificationToNewClient) {
            this.rule.receiverNewClient = '';
            this.emailsNewClient.forEach(e => this.rule.receiverNewClient += e + ';');
        }
        else {
            this.rule.receiverNewClient = '';
        }

        if (this.rule.sendNotificationToNewOrder) {
            this.rule.receiverNewOrder = '';
            this.emailsNewOrder.forEach(e => this.rule.receiverNewOrder += e + ';');
        }
        else {
            this.rule.receiverNewOrder = '';
        }

        var errors = this.validator.validate();

        if (errors.length > 0) {
            errors.forEach((error: string) => {
                this.nService.error(error);
            });

            return;
        }

        this.isLoading = true;

        this.repository
            .save(this.rule)
            .then((result: any) => {
                this.nService.success('Cadastro realizado')
                this.isLoading = false;
            })
            .catch(e => {
                this.nService.error(e);
                this.isLoading = false;
            });
    }
}