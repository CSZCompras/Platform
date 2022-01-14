export class MarketRuleItem {

    id: string;
    name: string;

    minimumOrderValue: number;
    numberOfDaysToAccept: number;

    acceptOrderOnMonday: boolean;
    acceptOrderOnMondayStart: number;
    acceptOrderOnMondayEnd: number;

    acceptOrderOnTuesday: boolean;
    acceptOrderOnTuesdayStart: number;
    acceptOrderOnTuesdayEnd: number;

    acceptOrderOnWednesday: boolean;
    acceptOrderOnWednesdayStart: number;
    acceptOrderOnWednesdayEnd: number;

    acceptOrderOnThursday: boolean;
    acceptOrderOnThursdayStart: number;
    acceptOrderOnThursdayEnd: number;

    acceptOrderOnFriday: boolean;
    acceptOrderOnFridayStart: number;
    acceptOrderOnFridayEnd: number;

    acceptOrderOnSaturday: boolean;
    acceptOrderOnSaturdayStart: number;
    acceptOrderOnSaturdayEnd: number;

    acceptOrderOnSunday: boolean;
    acceptOrderOnSundayStart: number;
    acceptOrderOnSundayEnd: number;

    acceptOrderOnHolidays: boolean;

    deliveryOnMonday: boolean;
    deliveryOnMondayStart: number;
    deliveryOnMondayEnd: number;

    deliveryOnTuesday: boolean;
    deliveryOnTuesdayStart: number;
    deliveryOnTuesdayEnd: number;

    deliveryOnWednesday: boolean;
    deliveryOnWednesdayStart: number;
    deliveryOnWednesdayEnd: number;

    deliveryOnThursday: boolean;
    deliveryOnThursdayStart: number;
    deliveryOnThursdayEnd: number;

    deliveryOnFriday: boolean;
    deliveryOnFridayStart: number;
    deliveryOnFridayEnd: number;

    deliveryOnSaturday: boolean;
    deliveryOnSaturdayStart: number;
    deliveryOnSaturdayEnd: number;

    deliveryOnSunday: boolean;
    deliveryOnSundayStart: number;
    deliveryOnSundayEnd: number;

    deliveryOrderOnHolidays: boolean;

    supplierId: string;
}