import { FoodService } from "./foodService";
import { SimulationItem } from "./simulationItem";
import { SimulationResult } from "./simulationResult";

export class Simulation{

    id                      : string;
    foodservice             : FoodService;
    items                   : SimulationItem[];
    results                 : SimulationResult[];
    betterResults           : SimulationResult[];
    bestResult              : SimulationResult;
    totalSimulations        : number;
    TotalSimulationsValid   : number;
    TotalSimulationsInvalid : number;
}