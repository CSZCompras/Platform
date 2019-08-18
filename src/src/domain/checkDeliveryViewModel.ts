export class CheckDeliveryViewModel{

    deliveryDate                    : Date;
    deliveryScheduleStart           : Number;
    deliveryScheduleEnd             : Number;
    suppliers                       : Array<string>;

    
    constructor() {
        this.suppliers = new Array<string>();
    }
}