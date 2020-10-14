import { Supplier } from './supplier';
import { PriceListItem } from "./priceListItem";

export class PriceList{

    id                  : string;
    date                : Date;
    items               : PriceListItem[];
    isDefaultPriceList  : boolean;
    supplier            : Supplier;
}