import { Product } from "../product";
import { Supplier } from "../supplier";

export class SimulationResultItem{

    id                  : string;
    product             : Product;
    supplier            : Supplier;   
    quantity            : number;    
    price               : number;    
    priceByUnit         : number;    
    total               : number;  
    clientCode          : string;
}