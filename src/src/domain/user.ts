import { UserType } from './userType';
import { Supplier } from './supplier';
import { FoodService } from './foodService';

export class User{
    
    id : string;
    name : string;
    email : string;
    password : string;
    createdOn : Date;
    updatedOn : Date;
    type : UserType;
    supplier : Supplier;
    foodService : FoodService;
}