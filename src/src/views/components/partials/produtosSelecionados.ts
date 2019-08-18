import { ProductRepository } from '../../../repositories/productRepository';
import { NotificationService } from '../../../services/notificationService';
import { ProductCategory } from '../../../domain/productCategory';
import { ProductClass } from '../../../domain/productClass';
import { autoinject } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { Product } from "../../../domain/product";
import { EventAggregator } from 'aurelia-event-aggregator';
import { FoodServiceProduct } from '../../../domain/foodServiceProduct';
import { FoodServiceRepository } from '../../../repositories/foodServiceRepository';
import { BuyList } from '../../../domain/buyList';
import { BuyListProduct } from '../../../domain/buyListProduct';
import { AlterBuyListProductViewModel } from '../../../domain/alterBuyListProductViewModel';
import { DeleteBuyList} from '../../components/partials/deleteBuyList';
import { BuyListStatus } from '../../../domain/buyListStatus';

@autoinject
export class ProdutosSelecionados{

    
    selectedClass       : ProductClass;
    categories          : ProductCategory[];
    allProducts         : FoodServiceProduct[];
    filteredProducts    : FoodServiceProduct[];
    isFiltered          : boolean;
    selectedCategory    : ProductCategory; 
    filter              : string;
    isCreatingList      : boolean;
    newListName         : string;
    lists               : BuyList[];
    isProcessing        : boolean;

    constructor(		
        private dialogService       : DialogService,
		private nService            : NotificationService, 
        private ea                  : EventAggregator ,
        private productRepository   : ProductRepository,
        private repository          : FoodServiceRepository) {
        
        this.isFiltered = false;
        this.isCreatingList = false;
        this.filteredProducts = [];
        this.lists = [];
    } 
    
    attached() : void{ 

        this.loadData(); 
        
        this.ea.subscribe('productAdded', (product : FoodServiceProduct) =>{  

           (<any>product).isNew  = true;

            if(this.selectedCategory.id == '-1' ||this.selectedCategory.id == '-2' ||  this.selectedCategory.id == '' || this.selectedCategory == null){ // novos 
               
                this.isFiltered = true; 

                this.filteredProducts.unshift(product);
                this.allProducts.unshift(product);

               this.lists.forEach( ( x : BuyList) => {

                    var foodProduct = x.products.filter( x => x.foodServiceProduct.productId == product.productId);

                    if(foodProduct == null){
                        var item = new BuyListProduct();
                        item.foodServiceProduct = product;
                        item.isInList = false;
                        x.products.unshift(item);
                    }
                    else{
                        foodProduct[0].foodServiceProduct.isActive = true;
                    }
                });
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
                novo.class = data[0].class;
                this.categories.unshift(novo)
                
                var novo = new ProductCategory();
                novo.id = '-1';
                novo.name = "Novos Produtos";
                novo.class = data[0].class;
                this.categories.unshift(novo)
                
                this.selectedCategory = novo;

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
                        this.search();
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
        })
    }

    search(){ 
            
            this.isFiltered = true;
            
            if(this.selectedCategory != null && this.selectedCategory.class != null){
                this.selectedClass = this.selectedCategory.class;
            }
            else{
                this.selectedClass = null;
            }

            if(this.selectedCategory != null && this.selectedCategory.id == '-2'){
                this.filteredProducts = this.allProducts;
            } 
            this.filteredProducts = this.allProducts.filter( (x : FoodServiceProduct) =>{

                    var isFound = true;

                    if(this.selectedCategory.id == '-1'){
                        return  (<any>x).isNew != null && (<any>x).isNew == true;
                    }
                    else{ 

                        if( (this.selectedCategory != null && this.selectedCategory.id != '' && this.selectedCategory.id  != '-2')){ 
                            if(x.product.category.id == this.selectedCategory.id){
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
            buyList.productClass = this.selectedClass;
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

    removeProduct(product : FoodServiceProduct){

        ( <any> product).isLoading = true;

        this.isProcessing = true;

        this.repository
            .inativateProduct(product)
            .then( (data : any) => { 

                this.allProducts = this.allProducts.filter( x=> x.productId != product.productId);
                this.filteredProducts = this.filteredProducts.filter( x=> x.productId != product.productId);

                product.isActive = false;
                this.ea.publish('productRemoved', product);
                this.nService.presentSuccess('Produto removido  com sucesso!');                
                this.isProcessing = false;
                ( <any> product).isLoading = true;

            }).catch( e => {

                this.nService.presentError(e);
                this.isProcessing = false;
                ( <any> product).isLoading = true;
            });
    } 

    deleteList(list : BuyList){

        var params = { List : list};

        this.dialogService
            .open({ viewModel: DeleteBuyList, model: params, lock: false })
            .whenClosed(response => {
                if (response.wasCancelled) {
                    return;
                } 
               list.status = BuyListStatus.Inactive; 
            });
    }  
}