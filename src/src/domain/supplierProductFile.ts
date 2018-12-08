import { SupplierProductFileRow } from './supplierProductFileRow';
import { User } from './user';


export class SupplierProductFile{

    id : string;
    fileName : string;
    uploadedBy : User;
    uploadedOn : Date;
    rows : SupplierProductFileRow[];    
}