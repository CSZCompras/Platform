import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';  
import { SimulationInputBaseItem } from '../../../domain/simulation/simulationInputBaseItem'; 
import { BrandViewModel } from '../../../domain/brandViewModel';
import { SimulationInputItem } from '../../../domain/simulation/simulationInputItem';

@autoinject
export class DetalhesProduto{
 
    controller                              : DialogController;  
    simulationInput                         : SimulationInputBaseItem;
    processing                              : boolean;
    unitName                                : string;

    constructor(pController : DialogController){ 

        this.processing = false; 
        this.controller = pController;    
    }    

    activate(params){  

        if(params.SimulationInputBaseItem != null){ 
            this.simulationInput = params.SimulationInputBaseItem; 
            if(this.simulationInput.items.length > 0){
                if(this.simulationInput.items[0].unitInternal == null){
                    this.unitName = this.simulationInput.items[0].unit.name;
                }
                else{
                    this.unitName = this.simulationInput.items[0].unitInternal.name;
                }
            }
        }
    }

    addRemoveBrand(brand : BrandViewModel, checkProducts : boolean){

        if((<any> brand).wasRemoved == null){
            (<any> brand).wasRemoved = true;
        }
        else{
            (<any> brand).wasRemoved =  ! (<any> brand).wasRemoved;            
        } 

        if( (<any> brand).wasRemoved){

            this.simulationInput.brandsBlackList.push(brand);
        }
        else{
            this.simulationInput.brandsBlackList = this.simulationInput.brandsBlackList.filter(x => x.id != brand.id);
        }

        if(checkProducts){

            var items = this.simulationInput.items.filter(x => x.brand != null && x.brand.id == brand.id);
            items.forEach( x=> {  

                (<any> x).wasRemoved =  (<any> brand).wasRemoved;
                                
                if((<any> brand).wasRemoved){

                    var item = this.simulationInput.productsBlackList.filter(p => p.productId == x.productId);
                    
                    // se nao esta na lista.
                    if(item.length == 0){
                        this.simulationInput.productsBlackList.push(x);
                    }
                }
                else{
                    var products = this.simulationInput.items.filter(x => x.brand.id == brand.id);
                    
                    products.forEach(p => {
                        (<any> p).wasRemoved =  (<any> brand).wasRemoved;
                        this.simulationInput.productsBlackList = this.simulationInput.productsBlackList.filter(x => x.productId != p.productId);

                    });
                }
            });
        }
    }

    removeProduct(product : SimulationInputItem){

        if((<any> product).wasRemoved == null){
            (<any> product).wasRemoved = true;
        }
        else{
            (<any> product).wasRemoved =  ! (<any> product).wasRemoved;
        }

        if((<any> product).wasRemoved){

            var item = this.simulationInput.productsBlackList.filter(x => x.productId == product.productId);
            
            if(item.length == 0){ // se nao esta na lista.
                this.simulationInput.productsBlackList.push(product);
            }

            if(product.brand != null){
                var productsBrand = this.simulationInput.items.filter( x=> x.brand.id == product.brand.id);
                var productsRemoved = this.simulationInput.productsBlackList.filter(x => x.brand.id == product.brand.id);

                if(productsBrand.length == productsRemoved.length){
                    
                    var brand = this.simulationInput.brands.filter(x => x.id == product.brand.id);    
                    
                    if(brand.length > 0){
                        
                        if(! (<any> brand[0]).wasRemoved){
                            this.addRemoveBrand(brand[0], false);
                        }
                    }

                }
            }
        }
        else{
            var products = this.simulationInput.productsBlackList.filter(x => x.brand.id == product.brand.id);

            this.simulationInput.productsBlackList = this.simulationInput.productsBlackList.filter(x => x.productId != product.productId);

            if(product.brand != null){
                
                // verifica se é o unico produto desta marca.. se sim, reativa a marca.
                if(products.length == 1){
                    
                    var brand = this.simulationInput.brands.filter(x => x.id == product.brand.id);    
                    
                    if(brand.length > 0){
                        
                        if( (<any> brand[0]).wasRemoved){
                            this.addRemoveBrand(brand[0], false);
                        }
                    }
                }
            }
        }
    } 
    cancel(){
        this.controller.cancel();
    } 

    confirm(){
        this.controller.ok(this.simulationInput);
    }
}