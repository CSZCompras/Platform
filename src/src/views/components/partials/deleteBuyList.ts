import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog'; 
import { EventAggregator } from 'aurelia-event-aggregator';
import { NotificationService } from '../../../services/notificationService';  
import { BuyList } from '../../../domain/buyList'; 
import { BuyListStatus } from '../../../domain/buyListStatus';
import { FoodServiceRepository} from '../../../repositories/foodServiceRepository';

@autoinject
export class DeleteBuyList{

    list                                    : BuyList;
    controller                              : DialogController;   
    processing                              : boolean;

    constructor(
        pController                         : DialogController,  
        private ea                          : EventAggregator,
        private notification                : NotificationService,
        private repo                        : FoodServiceRepository){ 
 
        this.controller = pController;   
         this.processing = false;
    }    

    activate(params){  

        debugger;
        
        if(params.List != null){

            this.list = params.List;
        } 
    }

    deleteList(){ 

        this.processing = true;
    
        this.repo
            .deleteBuyList(this.list)
            .then( (x : any) => {

                this.notification.success('Lista apagada com sucesso!') ;              
                this.list.status = BuyListStatus.Inactive;                
                this.ea.publish('listDeleted', this.list);     
                this.controller.ok();    
                this.processing = false;       
            })
            .catch( e => {
                this.notification.presentError(e); 
                this.processing = false;
            });
    }
 

    cancel(){
        this.controller.cancel();
    } 
}