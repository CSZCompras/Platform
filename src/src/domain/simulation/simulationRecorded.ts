import { ProductClass } from "../productClass";
import { User } from "../user"
import { SimulationRecordedItem } from "./SimulationRecordedItem"

export class SimulationRecorded{

    constructor() {
        this.items = [];
    }
    
    id                          : string;
    productClass                : ProductClass;
    name                        : string;
    createdBy                   : User;
    items                       : SimulationRecordedItem[];
}