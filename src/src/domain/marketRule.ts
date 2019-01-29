
export class MarketRule {

    id : string;
    minimumOrderValue : number;
    numberOfDaysToAccept : number;
    periodToAcceptOrder1 : number;
    periodToAcceptOrder2 : number;
    deliveryOnMonday : boolean;
    deliveryOnTuesday : boolean;
    deliveryOnWednesday : boolean;
    deliveryOnThursday : boolean;
    deliveryOnFriday : boolean;
    deliveryOnSaturday : boolean;
    deliveryOnSunday : boolean;
    deliverySchedule1 : number;
    deliverySchedule2 : number;
    sendNotificationToNewClient  : boolean;
    sendNotificationToNewOrder : boolean;
    receiverNewClient : string;
    receiverNewOrder : string;
}