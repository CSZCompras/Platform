import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';
import 'aurelia-validation';
import { EventAggregator } from 'aurelia-event-aggregator';
import { NotificationService } from '../../../services/notificationService';
import { ServiceViewModel } from '../../../domain/serviceViewModel';
import { ServiceTypeViewModel } from '../../../domain/serviceTypeViewModel';
import { ServiceRepository } from '../../../repositories/serviceRepository';
import { IdentityService } from '../../../services/identityService';
import { UserType } from '../../../domain/userType';

@autoinject
export class ListServices{

    services                        : ServiceViewModel[];
    filteredServices                : ServiceViewModel[];
    types                           : ServiceTypeViewModel[];
    selectedServiceTypeId           : string; 
    filter                          : string;
    edit                            : boolean; 

    constructor(
        private router              : Router, 
        private ea                  : EventAggregator,
        private nService            : NotificationService,
        private identityService     : IdentityService,
        private repository          : ServiceRepository) { 

        this.services = [];
        this.types = [];  

        if(this.identityService.getIdentity().type == UserType.Admin){
            this.edit = true;
        }
        else{
            this.edit = false;
        }
    }

    attached(){

        this.ea.publish('loadingData'); 
        this.loadData();
    }

    loadData(){

        var p1 = this.repository.getAllServiceTypes().then(x => {
            this.types = x;            
        });

        var p2 = this.repository
            .getAllServices()
            .then(x =>{

                this.services = x;
                this.filteredServices = x;
            })
            .catch( e => {
                this.nService.presentError(e);
            });

        Promise.all([p1, p2]).then(_ =>{
            this.ea.publish('dataLoaded');
        });
    }

    search(){

        this.filteredServices = this.services.filter( (x : ServiceViewModel) => {

            var isFound = true;  

            if( (this.selectedServiceTypeId != null && this.selectedServiceTypeId != '' &&  this.selectedServiceTypeId != '-1')){ 
                if(x.typeId.toString() == this.selectedServiceTypeId){
                    isFound = true;
                }
                else {
                    isFound= false;
                }
            }

            if( (this.filter != null && this.filter != '')){ 
                if(     x.title.toUpperCase().includes(this.filter.toUpperCase()) 
                    ||  x.site.toUpperCase().includes(this.filter.toUpperCase())){
                    isFound = true;
                }
                else {
                    isFound= false;
                }
            }  

            if(isFound){
                return x;
            }
        });

    }

    editService(x : ServiceViewModel){
        this.router.navigateToRoute('editServiceAdmin', { service : x });
    }
    create(){
        this.router.navigateToRoute('editServiceAdmin');
    }
}