import { PriceList } from '../../../domain/priceList';
import { PriceListRepository } from '../../../repositories/priceListRepository';
import { Rest, Config } from 'aurelia-api'; 
import { NotificationService } from '../../../services/notificationService';
import { IdentityService } from '../../../services/identityService';
import { ProductCategory } from '../../../domain/productCategory';
import { ProductClass } from '../../../domain/productClass';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Product } from "../../../domain/product";
import { EventAggregator } from 'aurelia-event-aggregator';
import { SupplierProductFile } from '../../../domain/supplierProductFile';

@autoinject
export class ListaDePrecos{
    
    lists : PriceList[];

     constructor(		
        private router: Router, 
		private service : IdentityService,
		private nService : NotificationService, 
        private ea : EventAggregator ,
        private config: Config,
        private repository : PriceListRepository) {

        this.lists = [];
    } 

    attached(){

        this.loadData();

          this.ea.subscribe('uploadSupplierProductFileDone', (file : SupplierProductFile) => {
                this.loadData();
          });
    }

    loadData() {

        this.repository
            .getAll()
            .then( (data : PriceList[]) => { 
                this.lists = data;
            }).catch( e => {
                this.nService.presentError(e);
            });
    }   

    

    downloadList(list : PriceList){ 
        var userId = this.service.getIdentity().id
        var api = this.config.getEndpoint('csz');
        window.open(api.client.baseUrl + 'DownloadPriceList?userId=' + userId +'&listId=' + list.id, '_parent');
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