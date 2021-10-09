import { MarketRule } from '../domain/marketRule';


export class MarketRuleValidator {

    errorMessages: Array<string>;
    isMinimumOrderValueInvalid: boolean;
    isnumberOfDaysToAcceptInvalid: boolean;
    isReceiverNewClientInvalid: boolean;
    isReceiverNewOrderInvalid: boolean;

    isAcceptOrderOnMondayStartInvalid: boolean;
    isAcceptOrderOnMondayEndInvalid: boolean;
    isAcceptOrderOnTuesdayStartInvalid: boolean;
    isAcceptOrderOnTuesdayEndInvalid: boolean;
    isAcceptOrderOnWednesdayStartInvalid: boolean;
    isAcceptOrderOnWednesdayEndInvalid: boolean;
    isAcceptOrderOnThursdayStartInvalid: boolean;
    isAcceptOrderOnThursdayEndInvalid: boolean;
    isAcceptOrderOnFridayStartInvalid: boolean;
    isAcceptOrderOnFridayEndInvalid: boolean;
    isAcceptOrderOnSaturdayStartInvalid: boolean;
    isAcceptOrderOnSaturdayEndInvalid: boolean;
    isAcceptOrderOnSundayStartInvalid: boolean;
    isAcceptOrderOnSundayEndInvalid: boolean;


    isDeliveryOnMondayStartInvalid: boolean;
    isDeliveryOnMondayEndInvalid: boolean;
    isDeliveryOnTuesdayStartInvalid: boolean;
    isDeliveryOnTuesdayEndInvalid: boolean;
    isDeliveryOnWednesdayStartInvalid: boolean;
    isDeliveryOnWednesdayEndInvalid: boolean;
    isDeliveryOnThursdayStartInvalid: boolean;
    isDeliveryOnThursdayEndInvalid: boolean;
    isDeliveryOnFridayStartInvalid: boolean;
    isDeliveryOnFridayEndInvalid: boolean;
    isDeliveryOnSaturdayStartInvalid: boolean;
    isDeliveryOnSaturdayEndInvalid: boolean;
    isDeliveryOnSundayStartInvalid: boolean;
    isDeliveryOnSundayEndInvalid: boolean;

    constructor(private rule: MarketRule) {

        this.errorMessages = new Array<string>();
    }


    validate(): Array<string> {
        this.errorMessages = [];
        this.validateMinimumOrderValue();
        this.validateNumberOfDaysToAccept();



        this.validateAcceptOrderMondayScheduleStart();
        this.validateAcceptOrderMondayScheduleEnd();
        this.validateAcceptOrderTuesdayScheduleStart();
        this.validateAcceptOrderTuesdayScheduleEnd();
        this.validateAcceptOrderWednesdayScheduleStart();
        this.validateAcceptOrderWednesdayScheduleEnd();
        this.validateAcceptOrderThursdayScheduleStart();
        this.validateAcceptOrderThursdayScheduleEnd();
        this.validateAcceptOrderFridayScheduleStart();
        this.validateAcceptOrderFridayScheduleEnd();
        this.validateAcceptOrderSaturdayScheduleStart();
        this.validateAcceptOrderSaturdayScheduleEnd();
        this.validateAcceptOrderSundayScheduleStart();
        this.validateAcceptOrderSundayScheduleEnd();


        this.validateDeliveryMondayScheduleStart();
        this.validateDeliveryMondayScheduleEnd();
        this.validateDeliveryTuesdayScheduleStart();
        this.validateDeliveryTuesdayScheduleEnd();
        this.validateDeliveryWednesdayScheduleStart();
        this.validateDeliveryWednesdayScheduleEnd();
        this.validateDeliveryThursdayScheduleStart();
        this.validateDeliveryThursdayScheduleEnd();
        this.validateDeliveryFridayScheduleStart();
        this.validateDeliveryFridayScheduleEnd();
        this.validateDeliverySaturdayScheduleStart();
        this.validateDeliverySaturdayScheduleEnd();
        this.validateDeliverySundayScheduleStart();
        this.validateDeliverySundayScheduleEnd();

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

    validateMinimumOrderValue() {

        if (this.rule.minimumOrderValue == null || ('' + this.rule.minimumOrderValue) == "") {
            this.errorMessages.push('O valor mínimo do pedido é obrigatório');
            this.isMinimumOrderValueInvalid = true;
        }
        else if (this.rule.minimumOrderValue <= 0) {
            this.errorMessages.push('O valor mínimo do pedido deve ser maior que zero');
            this.isMinimumOrderValueInvalid = true;
        }
        else {
            this.isMinimumOrderValueInvalid = false;
        }
    }

    validateNumberOfDaysToAccept() {

        if (this.rule.numberOfDaysToAccept == null || ('' + this.rule.numberOfDaysToAccept) == "") {
            this.errorMessages.push('A quantidade de dias para aceite do pedido é obrigatória');
            this.isnumberOfDaysToAcceptInvalid = true;
        }
        else if (this.rule.numberOfDaysToAccept <= 0) {
            this.errorMessages.push('A quantidade de dias para aceite do pedido deve ser maior que zero');
            this.isnumberOfDaysToAcceptInvalid = true;
        }
        else {
            this.isnumberOfDaysToAcceptInvalid = false;
        }
    }


    /* ---------- Accept ---------- */

    validateAcceptOrderMondayScheduleStart() {
        if (!this.rule.acceptOrderOnMonday) {
            return;
        }

        this.isAcceptOrderOnMondayStartInvalid = !this.isValidAcceptStartTime(this.rule.acceptOrderOnMondayStart);
    }

    validateAcceptOrderMondayScheduleEnd() {
        if (!this.rule.acceptOrderOnMonday) {
            return;
        }

        this.isAcceptOrderOnMondayEndInvalid = !this.isValidAcceptEndTime(this.rule.acceptOrderOnMondayEnd);
    }

    validateAcceptOrderTuesdayScheduleStart() {
        if (!this.rule.acceptOrderOnTuesday) {
            return;
        }

        this.isAcceptOrderOnTuesdayStartInvalid = !this.isValidAcceptStartTime(this.rule.acceptOrderOnTuesdayStart);
    }

    validateAcceptOrderTuesdayScheduleEnd() {
        if (!this.rule.acceptOrderOnTuesday) {
            return;
        }

        this.isAcceptOrderOnTuesdayEndInvalid = !this.isValidAcceptEndTime(this.rule.acceptOrderOnTuesdayEnd);
    }

    validateAcceptOrderWednesdayScheduleStart() {
        if (!this.rule.acceptOrderOnWednesday) {
            return;
        }

        this.isAcceptOrderOnWednesdayStartInvalid = !this.isValidAcceptStartTime(this.rule.acceptOrderOnWednesdayStart);
    }

    validateAcceptOrderWednesdayScheduleEnd() {
        if (!this.rule.acceptOrderOnWednesday) {
            return;
        }

        this.isAcceptOrderOnWednesdayEndInvalid = !this.isValidAcceptEndTime(this.rule.acceptOrderOnWednesdayEnd);
    }

    validateAcceptOrderThursdayScheduleStart() {
        if (!this.rule.acceptOrderOnThursday) {
            return;
        }

        this.isAcceptOrderOnThursdayStartInvalid = !this.isValidAcceptStartTime(this.rule.acceptOrderOnThursdayStart);
    }

    validateAcceptOrderThursdayScheduleEnd() {
        if (!this.rule.acceptOrderOnThursday) {
            return;
        }

        this.isAcceptOrderOnThursdayEndInvalid = !this.isValidAcceptEndTime(this.rule.acceptOrderOnThursdayEnd);
    }

    validateAcceptOrderFridayScheduleStart() {
        if (!this.rule.acceptOrderOnFriday) {
            return;
        }

        this.isAcceptOrderOnFridayStartInvalid = !this.isValidAcceptStartTime(this.rule.acceptOrderOnFridayStart);
    }

    validateAcceptOrderFridayScheduleEnd() {
        if (!this.rule.acceptOrderOnFriday) {
            return;
        }

        this.isAcceptOrderOnFridayEndInvalid = !this.isValidAcceptEndTime(this.rule.acceptOrderOnFridayEnd);
    }

    validateAcceptOrderSaturdayScheduleStart() {
        if (!this.rule.acceptOrderOnSaturday) {
            return;
        }

        this.isAcceptOrderOnSaturdayStartInvalid = !this.isValidAcceptStartTime(this.rule.acceptOrderOnSaturdayStart);
    }

    validateAcceptOrderSaturdayScheduleEnd() {
        if (!this.rule.acceptOrderOnSaturday) {
            return;
        }

        this.isAcceptOrderOnSaturdayEndInvalid = !this.isValidAcceptEndTime(this.rule.acceptOrderOnSaturdayEnd);
    }

    validateAcceptOrderSundayScheduleStart() {
        if (!this.rule.acceptOrderOnSunday) {
            return;
        }

        this.isAcceptOrderOnSundayStartInvalid = !this.isValidAcceptStartTime(this.rule.acceptOrderOnSundayStart);
    }

    validateAcceptOrderSundayScheduleEnd() {
        if (!this.rule.acceptOrderOnSunday) {
            return;
        }

        this.isAcceptOrderOnSundayEndInvalid = !this.isValidAcceptEndTime(this.rule.acceptOrderOnSundayEnd);
    }

    isValidAcceptEndTime(time: number): boolean {
        if (!time) {
            this.errorMessages.push('O horário final de aceite é obrigatório');
            return false;
        }

        if (isNaN(time)) {
            this.errorMessages.push('O horário final de aceite é obrigatório');
            return false;
        }

        if (time > 2400) {
            this.errorMessages.push('O horário final de aceite é inválido');
            return false;
        }

        return true;
    }

    isValidAcceptStartTime(time: number): boolean {
        if (!time) {
            this.errorMessages.push('O horário inicial de aceite é obrigatório');
            return false;
        }

        if (isNaN(time)) {
            this.errorMessages.push('O horário inicial de aceite é obrigatório');
            return false;
        }

        if (time > 1800) {
            this.errorMessages.push('O horário inicial de aceite é inválido');
            return false;
        }

        return true;
    }


    /* ---------- Delivery ---------- */

    validateDeliveryMondayScheduleStart() {
        if (!this.rule.deliveryOnMonday) {
            return;
        }

        this.isDeliveryOnMondayStartInvalid = !this.isValidDeliveryStartTime(this.rule.deliveryOnMondayStart);
    }

    validateDeliveryMondayScheduleEnd() {
        if (!this.rule.deliveryOnMonday) {
            return;
        }

        this.isDeliveryOnMondayEndInvalid = !this.isValidDeliveryEndTime(this.rule.deliveryOnMondayEnd);
    }

    validateDeliveryTuesdayScheduleStart() {
        if (!this.rule.deliveryOnTuesday) {
            return;
        }

        this.isDeliveryOnTuesdayStartInvalid = !this.isValidDeliveryStartTime(this.rule.deliveryOnTuesdayStart);
    }

    validateDeliveryTuesdayScheduleEnd() {
        if (!this.rule.deliveryOnTuesday) {
            return;
        }

        this.isDeliveryOnTuesdayEndInvalid = !this.isValidDeliveryEndTime(this.rule.deliveryOnTuesdayEnd);
    }

    validateDeliveryWednesdayScheduleStart() {
        if (!this.rule.deliveryOnWednesday) {
            return;
        }

        this.isDeliveryOnWednesdayStartInvalid = !this.isValidDeliveryStartTime(this.rule.deliveryOnWednesdayStart);
    }

    validateDeliveryWednesdayScheduleEnd() {
        if (!this.rule.deliveryOnWednesday) {
            return;
        }

        this.isDeliveryOnWednesdayEndInvalid = !this.isValidDeliveryEndTime(this.rule.deliveryOnWednesdayEnd);
    }

    validateDeliveryThursdayScheduleStart() {
        if (!this.rule.deliveryOnThursday) {
            return;
        }

        this.isDeliveryOnThursdayStartInvalid = !this.isValidDeliveryStartTime(this.rule.deliveryOnThursdayStart);
    }

    validateDeliveryThursdayScheduleEnd() {
        if (!this.rule.deliveryOnThursday) {
            return;
        }

        this.isDeliveryOnThursdayEndInvalid = !this.isValidDeliveryEndTime(this.rule.deliveryOnThursdayEnd);
    }

    validateDeliveryFridayScheduleStart() {
        if (!this.rule.deliveryOnFriday) {
            return;
        }

        this.isDeliveryOnFridayStartInvalid = !this.isValidDeliveryStartTime(this.rule.deliveryOnFridayStart);
    }

    validateDeliveryFridayScheduleEnd() {
        if (!this.rule.deliveryOnFriday) {
            return;
        }

        this.isDeliveryOnFridayEndInvalid = !this.isValidDeliveryEndTime(this.rule.deliveryOnFridayEnd);
    }

    validateDeliverySaturdayScheduleStart() {
        if (!this.rule.deliveryOnSaturday) {
            return;
        }

        this.isDeliveryOnSaturdayStartInvalid = !this.isValidDeliveryStartTime(this.rule.deliveryOnSaturdayStart);
    }

    validateDeliverySaturdayScheduleEnd() {
        if (!this.rule.deliveryOnSaturday) {
            return;
        }

        this.isDeliveryOnSaturdayEndInvalid = !this.isValidDeliveryEndTime(this.rule.deliveryOnSaturdayEnd);
    }

    validateDeliverySundayScheduleStart() {
        if (!this.rule.deliveryOnSunday) {
            return;
        }

        this.isDeliveryOnSundayStartInvalid = !this.isValidDeliveryStartTime(this.rule.deliveryOnSundayStart);
    }

    validateDeliverySundayScheduleEnd() {
        if (!this.rule.deliveryOnSunday) {
            return;
        }

        this.isDeliveryOnSundayEndInvalid = !this.isValidDeliveryEndTime(this.rule.deliveryOnSundayEnd);
    }

    isValidDeliveryEndTime(time: number): boolean {
        if (!time) {
            this.errorMessages.push('O horário final de entrega é obrigatório');
            return false;
        }

        if (isNaN(time)) {
            this.errorMessages.push('O horário final de entrega é obrigatório');
            return false;
        }

        if (time > 2400) {
            this.errorMessages.push('O horário final de entrega é inválido');
            return false;
        }

        return true;
    }

    isValidDeliveryStartTime(time: number): boolean {
        if (!time) {
            this.errorMessages.push('O horário inicial de entrega é obrigatório');
            return false;
        }

        if (isNaN(time)) {
            this.errorMessages.push('O horário inicial de entrega é obrigatório');
            return false;
        }

        if (time > 1800) {
            this.errorMessages.push('O horário inicial de entrega é inválido');
            return false;
        }

        return true;
    }
}