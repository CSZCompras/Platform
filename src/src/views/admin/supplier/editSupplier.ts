import { inject, NewInstance} from 'aurelia-framework';
import { Aurelia, autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { Rest, Config } from 'aurelia-api';
import { EventAggregator } from 'aurelia-event-aggregator';
import { IdentityService } from '../../../services/identityService';
import { NotificationService } from '../../../services/notificationService';
import { ProductRepository } from '../../../repositories/productRepository';
import { Product } from '../../../domain/product';
import { ProductCategory } from '../../../domain/productCategory';
import { UnitOfMeasurementRepository } from '../../../repositories/unitOfMeasurementRepository';
import { UnitOfMeasurement } from '../../../domain/unitOfMeasurement';
import { Supplier } from '../../../domain/supplier';
import { SupplierRepository } from '../../../repositories/supplierRepository';
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';
import 'aurelia-validation';
import { StateRegistration } from '../../../domain/stateRegistration';
import { StateRegistrationRepository } from '../../../repositories/stateRegistrationRepository';

@autoinject
export class EditSupplier{

    supplier            : Supplier;
    supplierId          : string;
    selectedFiles       : any;
    isUploading         : boolean;
	stateRegistrations  : StateRegistration[];

    constructor(
        private router              : Router, 
        private ea                  : EventAggregator,
        private nService            : NotificationService,
        private stateRepo           : StateRegistrationRepository, 
        private config              : Config,
        private repository          : SupplierRepository) { 

            this.supplier = new Supplier();
    }

    attached(){

        this.ea.publish('loadingData'); 
        this.loadData();
    }

    
    activate(params){ 

        if(params != null && params.supplierId){ 

            this.supplierId = params.supplierId;
        } 
    }


    loadData(){

        this.repository
            .get(this.supplierId)
            .then(x => {
                this.supplier = x;                
                
                this.stateRepo
                    .getAll()
                    .then( (data : StateRegistration[]) => { 
                        
                        this.stateRegistrations = data;
                        this.ea.publish('dataLoaded');

                    }).catch( e => {
                        this.nService.presentError(e);
                    }); 
                                
            })
            .catch( e => {
                this.nService.presentError(e);
            });


    }

    cancelUpload(){
        this.selectedFiles = [];
        debugger;
        ( <any> document.getElementById("files")).value = "";
    }
    
    downloadSocialContract(){         
        var api = this.config.getEndpoint('csz');
        window.open(api.client.baseUrl + 'downloadSupplierContractSocial?supplierId=' + this.supplier.id, '_parent');
    }

    uploadSocialContract(){ 
        
        this.isUploading = true;

        let formData = new FormData();

        for (let i = 0; i < this.selectedFiles.length; i++) {
            formData.append('file', this.selectedFiles[i]);
        }

        
        this.repository
            .uploadSocialContract(formData, this.supplier.id) 
            .then( () =>{    

                this.isUploading = false;  
                ( <any> document.getElementById("files")).value = "";
                this.nService.presentSuccess('Contrato atualizado com sucesso!');

            }).catch( e => {
                this.selectedFiles = [];
                this.nService.error(e);
                this.isUploading = false;
            });
    }

    save(){

        this.repository
            .save(this.supplier).then( () =>{     
                this.nService.presentSuccess('Cadastro atualizado com sucesso!');

            }).catch( e => {
                this.nService.error(e);                
            });

    }

    cancel(){
        this.router.navigateToRoute('suppliersAdmin');
    }

}