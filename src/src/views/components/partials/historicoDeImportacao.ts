import { SupplierProductFile } from '../../../domain/supplierProductFile';
import { Rest, Config } from 'aurelia-api'; 
import { SupplierProduct } from '../../../domain/supplierProduct';
import { ProductRepository } from '../../../repositories/productRepository';
import { NotificationService } from '../../../services/notificationService';
import { IdentityService } from '../../../services/identityService';
import { ProductCategory } from '../../../domain/productCategory';
import { ProductClass } from '../../../domain/productClass';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Product } from "../../../domain/product";
import { EventAggregator } from 'aurelia-event-aggregator';

@autoinject
export class HistoricoDeImportacao {

    files : SupplierProductFile[];

    constructor(		
        private router: Router, 
		private service : IdentityService,
		private nService : NotificationService, 
        private ea : EventAggregator ,
        private config: Config,
        private repository : ProductRepository) {
            this.files = [];
    } 

    
     attached(){
        this.loadData();

        this.ea.subscribe('uploadSupplierProductFileDone', (file : SupplierProductFile) => {
            this.files.unshift(file);
        });
    }

    loadData(){

        this.repository
            .getAllSuplierProductFiles()
            .then( (data : SupplierProductFile[]) => {
                this.files = data;
            }).catch( e => {
                this.nService.presentError(e);
            });
    }

     dataAtualFormatada(date  : any) : string{

        var dia = '', mes = '', ano = '';
        var data = (new Date(date));        
        
        dia = data.getDate().toString();

        if (dia.toString().length == 1)
        {
            dia = "0" + dia;
        }
        var mes =  (data.getMonth()+1).toString();
        
        if (mes.toString().length == 1)
        {
            mes = "0" + mes;
        }
        
        var ano = data.getFullYear().toString();  
        if(data.getHours() == 0){
            return dia + "/" + mes + "/" + ano;
        }
        

        return dia + "/" + mes + "/" + ano + ' ' + data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();
    }
}