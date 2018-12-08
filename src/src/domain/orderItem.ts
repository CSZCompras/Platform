import { Product } from "./product";

export class OrderItem{

    id              : string;
    product         : Product;
    quantity        : number;
    price           : number;
    total           : number;
}