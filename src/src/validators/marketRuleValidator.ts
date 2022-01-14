import { MarketRule } from '../domain/marketRule';

export class MarketRuleValidator {

    errorMessages: Array<string>;
    isReceiverNewClientInvalid: boolean;
    isReceiverNewOrderInvalid: boolean;

    constructor(private rule: MarketRule) {
        this.errorMessages = new Array<string>();
    }

    validate(): Array<string> {
        this.errorMessages = [];

        this.validateReceiverNewClient();
        this.validateReceiverNewOrder();
        return this.errorMessages;
    }

    validateReceiverNewClient(email = null) {
        if (email == null) {
            if (this.rule.sendNotificationToNewClient && (this.rule.receiverNewClient == null || this.rule.receiverNewClient == '')) {
                this.errorMessages.push('É necessário adicionar ao menos um e-mail em caso de novo cliente');
                this.isReceiverNewClientInvalid = true;
            }
        }
        else {
            if (this.rule.sendNotificationToNewClient && (email == null || email == '')) {
                this.errorMessages.push('O e-mail do destinatário em caso de novo cliente está em branco');
                this.isReceiverNewClientInvalid = true;
            }
            else {
                this.isReceiverNewClientInvalid = false;
            }
        }
    }

    validateReceiverNewOrder(email = null) {
        if (email == null) {
            if (this.rule.sendNotificationToNewOrder && (this.rule.receiverNewOrder == null || this.rule.receiverNewOrder == '')) {
                this.errorMessages.push('É necessário adicionar ao menos um e-mail em caso de novo pedido');
                this.isReceiverNewOrderInvalid = true;
            }
        }
        else {
            if (this.rule.sendNotificationToNewOrder && (email == null || email == '')) {
                this.errorMessages.push('O e-mail do destinatário em caso de novo pedido está em branco');
                this.isReceiverNewOrderInvalid = true;
            }
            else {
                this.isReceiverNewOrderInvalid = false;
            }
        }
    }
}