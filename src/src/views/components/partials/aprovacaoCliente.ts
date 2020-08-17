import { autoinject } from 'aurelia-framework';
import { PriceListRepository } from '../../../repositories/priceListRepository';
import { PriceList } from '../../../domain/priceList';
import { FoodService } from '../../../domain/foodService';
import { DialogController } from 'aurelia-dialog';
import { FoodServiceSupplier } from '../../../domain/foodServiceSupplier';

@autoinject
export class AprovacaoCliente{

    isLoading                       : boolean;
    priceLists                      : PriceList[];
    selectedPriceList               : PriceList;
    fsSupplier                      : FoodServiceSupplier;

    constructor(		
		private controller          : DialogController, 
        private priceListRepository : PriceListRepository) { 

            this.isLoading = true; 
    } 

    activate(params){  

        if(params.FoodServiceSupplier != null){

            this.fsSupplier = params.FoodServiceSupplier; 
        }
    }

    loadData(){

        this.priceListRepository
            .getAll()
            .then(x => {
                this.priceLists = x;
                this.isLoading = false;

                if(this.fsSupplier.priceListId != null && this.fsSupplier.priceListId != ''){
                    this.selectedPriceList = this.priceLists.filter( p => p.id == this.fsSupplier.priceListId)[0];
                }
                else if(this.priceLists.length > 0){
                    this.selectedPriceList = this.priceLists[0];
                }
            })
            .catch(e => {
                this.isLoading = false;
            })
    }
    
    attached() : void{ 
        
		this.loadData();  
    } 

    save(){
        if(this.selectedPriceList != null && ( <any> this.selectedPriceList) != ''){
            this.controller.ok(this.selectedPriceList);
        }
    }

    cancel(){
        this.controller.cancel();
    }
}