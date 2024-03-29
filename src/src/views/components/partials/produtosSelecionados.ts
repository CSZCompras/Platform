import { ProductRepository } from '../../../repositories/productRepository';
import { NotificationService } from '../../../services/notificationService';
import { ProductCategory } from '../../../domain/productCategory';
import { ProductClass } from '../../../domain/productClass';
import { autoinject } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { Product } from "../../../domain/product";
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { FoodServiceProduct } from '../../../domain/foodServiceProduct';
import { FoodServiceRepository } from '../../../repositories/foodServiceRepository';
import { BuyList } from '../../../domain/buyList';
import { BuyListProduct } from '../../../domain/buyListProduct';
import { AlterBuyListProductViewModel } from '../../../domain/alterBuyListProductViewModel';
import { DeleteBuyList } from '../../components/partials/deleteBuyList';
import { BuyListStatus } from '../../../domain/buyListStatus';
import { FoodServiceAccountStatusService } from '../../../services/foodServiceAccountStatusService';

@autoinject
export class ProdutosSelecionados {

    classes: ProductClass[];
    selectedClass: ProductClass;
    selectedCategory: ProductCategory;
    allProducts: FoodServiceProduct[];
    filteredProducts: FoodServiceProduct[];
    isFiltered: boolean;
    filter: string;
    isCreatingList: boolean;
    newListName: string;
    allLists: BuyList[];
    lists: BuyList[];
    isProcessing: boolean;

    subscriptions: Array<Subscription> = [];

    constructor(
        private dialogService: DialogService,
        private nService: NotificationService,
        private ea: EventAggregator,
        private productRepository: ProductRepository,
        private repository: FoodServiceRepository,
        private foodServiceAccountStatusService: FoodServiceAccountStatusService
    ) {

        this.isFiltered = false;
        this.isCreatingList = false;
        this.filteredProducts = [];
        this.lists = [];
    }

    attached(): void {
        this.loadData();

        this.subscriptions.push(
            this.ea.subscribe('productAdded', (product: FoodServiceProduct) => {
                var productClass = product.product.base.category.productClass;

                if (this.classes.filter(x => x.id == productClass.id).length == 0) {

                    if (productClass.categories == null) {
                        productClass.categories = [];
                    }
                    this.classes.unshift(productClass);
                }
                this.loadProducts();
            })
        );
    }

    detached() {
        if (this.subscriptions && this.subscriptions.length > 0) {
            for (let s of this.subscriptions) {
                s.dispose();
            }
        }
    }

    getDefaultList(): BuyList {
        var defaultList = this.allLists.filter((x: BuyList) => x.isDefaultList);

        if (defaultList != null && defaultList.length > 0) {
            return defaultList[0];
        }
        return null;
    }

    addProductToDefaultList(product: FoodServiceProduct) {
        this.addProductToList(this.getDefaultList(), product);
    }

    addProductToList(x: BuyList, product: FoodServiceProduct) {

        var foodProduct = x.products.filter(x => x.foodServiceProduct.productId == product.productId);

        if (foodProduct == null || foodProduct.length == 0) {

            var item = new BuyListProduct();
            item.foodServiceProduct = product;
            item.isInList = x.isDefaultList;
            x.products.unshift(item);
        }
        else {
            foodProduct[0].foodServiceProduct.isActive = true;
            foodProduct[0].isInList = x.isDefaultList;
        }

    }

    updateCategories() {
        this.defineCurrentLists();
        this.defineProductsInList();
        this.search();
    }

    loadData() {

        this.productRepository
            .getProductClassesBySelectedProducts()
            .then((data: ProductClass[]) => {

                this.classes = data;

                data.forEach(x => {

                    if (x.categories == null) {
                        x.categories = [];
                    }
                });

                this.ea.publish('dataLoaded');
                this.loadProducts();

            }).catch(e => {
                this.nService.presentError(e);
            });


    }

    loadProducts() {
        this.repository
            .getProducts()
            .then((data: FoodServiceProduct[]) => {

                this.allProducts = data;
                this.filteredProducts = data;
                this.loadBuyLists();
            }).catch(e => {
                this.nService.presentError(e);
            });
    }

    loadBuyLists() {

        this.repository
            .getLists()
            .then((data: BuyList[]) => {

                this.allLists = data;
                this.defineCurrentLists();
                this.defineProductsInList();
                this.search();
            }).catch(e => {
                //    this.nService.presentError(e);
            });
    }

    defineCurrentLists() {

        var defaultList = this.getDefaultList();
        this.lists = this.allLists.filter((x: BuyList) => !x.isDefaultList && (x.productClass == null || x.productClass.id == this.selectedClass.id));

        if (defaultList != null) {
            this.lists.unshift(defaultList);
        }
    }

    defineProductsInList() {

        this.lists.forEach((y: BuyList) => {

            y.products.forEach((z: BuyListProduct) => {

                if (z.foodServiceProduct != null) {
                    y[z.foodServiceProduct.productId] = z.isInList;
                }

            });
        })
    }

    search() {

        this.isFiltered = true;

        this.filteredProducts = this.allProducts.filter((x: FoodServiceProduct) => {

            var isFound = true;

            if ((<any>this.selectedClass) == '-1') {
                isFound = true;
            }
            else if ((this.selectedClass != null && this.selectedClass.id != null)) {

                if (x.product.base.category.productClass.id == this.selectedClass.id) {
                    isFound = true;
                }
                else {
                    isFound = false;
                }
            }

            if (isFound) {

                if ((<any>this.selectedCategory) == '-1') {
                    isFound = true;
                }
                else if ((this.selectedCategory != null && this.selectedCategory.id != null)) {

                    if (x.product.base.category.id == this.selectedCategory.id) {
                        isFound = true;
                    }
                    else {
                        isFound = false;
                    }
                }

                if (isFound) {

                    if ((this.filter != null && this.filter != '')) {
                        if (x.product.base.name.toUpperCase().includes(this.filter.toUpperCase())) {
                            isFound = true;
                        }
                        else {
                            isFound = false;
                        }
                    }
                }
            }
            if (isFound) {
                return x;
            }
        });
    }

    addProduct(product: Product) {

        this.allProducts = this.allProducts.filter((x: FoodServiceProduct) => {
            if (x.product.id != product.id)
                return x;
        });

        this.filteredProducts = this.filteredProducts.filter((x: FoodServiceProduct) => {
            if (x.product.id != product.id)
                return x;
        });

        this.ea.publish('productAdded', product);
    }

    createList(): void {

        if (this.newListName != null && this.newListName != '') {

            var buyList = new BuyList();
            buyList.name = this.newListName;

            this.repository
                .addBuyList(buyList)
                .then((data: BuyList) => {

                    this.lists.unshift(data);
                    this.newListName = '';
                    this.nService.presentSuccess('Lista criada com sucesso!');
                }).catch(e => {
                    this.nService.presentError(e);
                });
        }
    }

    changeList(list: BuyList, product: FoodServiceProduct) {

        var viewModel = new AlterBuyListProductViewModel();
        viewModel.isInList = list[product.product.id];
        viewModel.foodServiceProductId = product.productId;
        viewModel.buyListId = list.id;

        this.repository
            .alterBuyList(viewModel)
            .then((data: any) => {
                this.nService.presentSuccess('Lista atualizada com sucesso!');
            }).catch(e => {
                this.nService.presentError(e);
            });
    }

    removeProduct(product: FoodServiceProduct) {

        (<any>product).isLoading = true;

        this.isProcessing = true;

        this.repository
            .inativateProduct(product)
            .then((data: any) => {

                this.allProducts = this.allProducts.filter(x => x.productId != product.productId);
                this.filteredProducts = this.filteredProducts.filter(x => x.productId != product.productId);

                product.isActive = false;
                this.ea.publish('productRemoved', product);
                this.nService.presentSuccess('Produto removido  com sucesso!');

                this.foodServiceAccountStatusService.refresh()
                    .then(() => this.ea.publish('foodServiceAccountStatusChanged'));

                this.isProcessing = false;
                (<any>product).isLoading = true;

            }).catch(e => {

                this.nService.presentError(e);
                this.isProcessing = false;
                (<any>product).isLoading = true;
            });
    }

    deleteList(list: BuyList) {


        if (!list.isDefaultList) {

            var params = { List: list };

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
}