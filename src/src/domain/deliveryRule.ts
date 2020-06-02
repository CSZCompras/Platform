import { FoodService } from "./foodService";
import { ProductClass } from "./productClass";

export class DeliveryRule {

    id                          : string;
    foodService                 : FoodService;
    productClass                : ProductClass;
    deliveryOnMonday            : boolean;
    deliveryOnTuesday           : boolean;
    deliveryOnWednesday         : boolean;
    deliveryOnThursday          : boolean;
    deliveryOnFriday            : boolean;
    deliveryOnSaturday          : boolean;
    deliveryOnSunday            : boolean;
    deliveryScheduleInitial     : number;
    deliveryScheduleFinal       : number;

    static getNextDeliveryDate(rule : DeliveryRule) : Date {

        var isFound = false;
        var count = 0;

        var days = [
            rule.deliveryOnSunday,
            rule.deliveryOnMonday,
            rule.deliveryOnTuesday,
            rule.deliveryOnWednesday,
            rule.deliveryOnThursday,
            rule.deliveryOnFriday,
            rule.deliveryOnSaturday
        ];

        var today = new Date();
        var dayToday = today.getDay();
        var day = dayToday + 1;

        while(isFound == false){

            if(count >= days.length + 1){
                break;
            }

            if(days[day]){
                isFound = true;
                break;
            }             
            count++;
            if(day >= days.length - 1){
                day = 0;
            }           
            else{
                day++;
            }
        }
        
        if(day == dayToday){
            day = 7;
        }
        else if(day < dayToday){
            day += (7 - dayToday);
        }
        else{
            day -= dayToday;
        }

        if(isFound){
            var x = new Date(today.getTime() + (1000 * 60 * 60 * 24 * day));
            x.setHours(0,0,0,0);
            return x;
        }
        return null;
    }
}