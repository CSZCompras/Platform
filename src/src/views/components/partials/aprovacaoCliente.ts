import { autoinject } from 'aurelia-framework';
import { PriceListRepository } from '../../../repositories/priceListRepository';
import { PriceList } from '../../../domain/priceList';
import { FoodService } from '../../../domain/foodService';
import { DialogController } from 'aurelia-dialog';

@autoinject
export class AprovacaoCliente{

    isLoading                       : boolean;
    priceLists                      : PriceList[];
    selectedPriceList               : PriceList;
    foodService                     : FoodService;

    constructor(		
		private controller          : DialogController, 
        private priceListRepository : PriceListRepository) { 

            this.isLoading = true; 
    } 

    activate(params){  

        if(params.FoodService != null){

            this.foodService = params.FoodService; 
        }
    }

    loadData(){

        this.priceListRepository
            .getAll()
            .then(x => {
                this.priceLists = x;
                this.isLoading = false;
            })
            .catch(e => {
                this.isLoading = false;
            })
    }
    
    attached() : void{ 
        
		this.loadData();  
    } 

    save(){
        if(this.selectedPriceList != null && (<any> this.selectedPriceList) != ''){
            this.controller.ok(this.selectedPriceList);
        }
    }

    cancel(){
        this.controller.cancel();
    }
}