import { UserType } from "./userType";
import { RegisterStatus } from "./registerStatus";

export class Identity {

    token       : string;
    id          : string;
    name        : string;
    email       : string;
    type        : UserType;
    companyId   : string;
    registerStatus : RegisterStatus
}
