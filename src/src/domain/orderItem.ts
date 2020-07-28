import { Product } from "./product";

export class OrderItem{

    id              : string;
    product         : Product;
    quantity        : number;
    priceByUnit     : number;
    price           : number;
    total           : number;
    clientCode      : string;
    multiplier      : number;
    isEditing       : Boolean;
}