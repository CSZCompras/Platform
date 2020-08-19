import { SimulationInputItem } from "./simulationInputItem";
import { SupplierViewModel } from "../supplierViewModel";
import { BrandViewModel } from "../brandViewModel";
import { UnitViewModel } from "../unitViewModel";

export class SimulationInputBaseItem{

    productBaseId               : string;
    quantity                    : number;
    name                        : string;
    category                    : string;
    items                       : SimulationInputItem[];
    brands                      : BrandViewModel[];
    units                       : UnitViewModel[];
    suppliers                   : SupplierViewModel[]; 
}