import { UserType } from './userType';
import { Supplier } from './supplier';

export class User{
    
    id : string;
    name : string;
    email : string;
    password : string;
    createdOn : Date;
    updatedOn : Date;
    type : UserType;
    supplier : Supplier;
}