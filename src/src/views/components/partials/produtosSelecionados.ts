import { Rest, Config } from 'aurelia-api'; 
import { ProductRepository } from '../../../repositories/productRepository';
import { NotificationService } from '../../../services/notificationService';
import { IdentityService } from '../../../services/identityService';
import { ProductCategory } from '../../../domain/productCategory';
import { ProductClass } from '../../../domain/productClass';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Product } from "../../../domain/product";
import { EventAggregator } from 'aurelia-event-aggregator';
import { FoodServiceProduct } from '../../../domain/foodServiceProduct';
import { FoodServiceRepository } from '../../../repositories/foodServiceRepository';
import { BuyList } from '../../../domain/buyList';
import { BuyListProduct } from '../../../domain/buyListProduct';
import { AlterBuyListProductViewModel } from '../../../domain/alterBuyListProductViewModel';

@autoinject
export class ProdutosSelecionados{

    classes : ProductClass[];
    categories : ProductCategory[];
    allProducts : FoodServiceProduct[];
    filteredProducts : FoodServiceProduct[];
    isFiltered : boolean;
    selectedCategory : string;
    filter : string;
    isCreatingList : boolean;
    newListName : string;
    lists : BuyList[];

    constructor(		
        private router: Router, 
		private service : IdentityService,
		private nService : NotificationService, 
        private ea : EventAggregator ,
        private productRepository : ProductRepository,
        private repository : FoodServiceRepository, 
        private identityService : IdentityService) {
        
        this.isFiltered = false;
        this.isCreatingList = false;
        this.filteredProducts = [];
        this.lists = [];
    } 
    
    attached() : void{ 
        this.loadData(); 
        
        this.ea.subscribe('productAdded', (product : FoodServiceProduct) =>{  

            (<any>product).isNew  = true;

            if(this.selectedCategory == '-1' || this.selectedCategory == '' || this.selectedCategory == null){ // novos 
                this.isFiltered = true;
                this.filteredProducts.unshift(product);
                this.allProducts.unshift(product);
                
                this.lists.forEach( ( x : BuyList) => {
                    var item = new BuyListProduct();
                    item.foodServiceProduct = product;
                    item.isInList = false;
                    x.products.unshift(item);
                })
            }
            else{
                this.allProducts.unshift(product);
            } 
        });
    } 

    loadData(){

        this.productRepository
            .getAllCategories()
            .then( (data : ProductCategory[]) => { 
                this.categories = data;

                var novo = new ProductCategory();
                novo.id = '-2';
                novo.name = "Todos";
                this.categories.unshift(novo)
                
                var novo = new ProductCategory();
                novo.id = '-1';
                novo.name = "Novos Produtos";
                this.categories.unshift(novo)


            }).catch( e => {
                this.nService.presentError(e);
            });

        this.repository
            .getProducts()
            .then( (data : FoodServiceProduct[]) => { 
                this.allProducts = data; 

                this.repository
                    .getLists()
                    .then( (data : BuyList[]) => { 

                        this.lists = data; 
                        this.defineProductsInList();
                    }).catch( e => {
                        this.nService.presentError(e);
                    });

            }).catch( e => {
                this.nService.presentError(e);
            });
    }

    defineProductsInList(){

        this.lists.forEach( (y : BuyList) =>{

            y.products.forEach( (z : BuyListProduct) => {
                
                if(z.foodServiceProduct != null){
                    y[z.foodServiceProduct.product.name + '_' + z.foodServiceProduct.product.unit.name] =  z.isInList;
                }
                
            });

            // this.allProducts.forEach( (x : FoodServiceProduct) => {
                
            //     var isInList = false;
               
            //     if(y.products != null && y.products.length > 0) {

            //         var result = y.products.filter( (z : BuyListProduct) => {
            //             z.foodServiceProduct.productId == x.productId;
            //         });          
                    
            //         isInList = result.length == 0 ? false : true;

            //         x[y.name] = isInList;
            //     }
           //  });
        })
    }

    search(){ 
            
            this.isFiltered = true;

            if(this.selectedCategory == '-2'){
                this.filteredProducts = this.allProducts;
            }
            else { 

                this.filteredProducts = this.allProducts.filter( (x : FoodServiceProduct) =>{

                    var isFound = true;

                    if(this.selectedCategory == '-1'){
                        return  (<any>x).isNew != null && (<any>x).isNew == true;
                    }
                    else{ 

                        if( (this.selectedCategory != null && this.selectedCategory != '')){ 
                            if(x.product.category.id == this.selectedCategory){
                                isFound = true;
                            }
                            else {
                                isFound= false;
                            }
                        }
                        
                        if(isFound){

                            if( (this.filter != null && this.filter != '')){ 
                                if( x.product.name.toUpperCase().includes(this.filter.toUpperCase()) ){
                                    isFound = true;
                                }
                                else {
                                    isFound= false;
                                }
                            }
                        }

                        if(isFound){
                            return x;
                        }
                    }
                });
            }
    }

    addProduct(product : Product){
        
        this.allProducts = this.allProducts.filter( (x : FoodServiceProduct) => {
            if(x.product.id != product.id)
                return x;
        });

        this.filteredProducts = this.filteredProducts.filter( (x : FoodServiceProduct) => {
            if(x.product.id != product.id)
                return x;
        });

        this.ea.publish('productAdded', product);
    }

    createList() : void{      

        if(this.newListName != null && this.newListName != '' ){
            
            var buyList = new BuyList();
            buyList.name = this.newListName;
            
            this.repository
                .addBuyList(buyList)
                .then( (data : BuyList) => { 
                    this.lists.unshift(data);         
                    this.newListName = '';
                    this.nService.presentSuccess('Lista criada com sucesso!');
                }).catch( e => {
                    this.nService.presentError(e);
                });
        }
    }

    changeList(list : BuyList, product : FoodServiceProduct){
        var viewModel = new AlterBuyListProductViewModel();
        viewModel.isInList = list[product.product.name + '_' + product.product.unit.name];
        viewModel.foodServiceProductId = product.productId;
        viewModel.buyListId = list.id;
 
         this.repository
                .alterBuyList(viewModel)
                .then( (data : any) => { 
                    this.nService.presentSuccess('Lista atualizada com sucesso!');
                }).catch( e => {
                    this.nService.presentError(e);
                });
    }
}