import { FoodService } from "../foodService";
import { SimulationItem } from "./simulationItem";
import { SimulationResult } from "./simulationResult";
import { ProductClass } from "../productClass";

export class Simulation{

    id                      : string;
    foodservice             : FoodService;
    market                  : ProductClass;
    items                   : SimulationItem[];
    results                 : SimulationResult[];
    betterResults           : SimulationResult[];
    bestResult              : SimulationResult;
    totalSimulations        : number;
    TotalSimulationsValid   : number;
    TotalSimulationsInvalid : number;
}