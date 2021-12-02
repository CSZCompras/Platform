import { ProductRepository } from '../../../repositories/productRepository';
import { NotificationService } from '../../../services/notificationService';
import { IdentityService } from '../../../services/identityService';
import { ProductCategory } from '../../../domain/productCategory';
import { ProductClass } from '../../../domain/productClass';
import { autoinject } from 'aurelia-framework';
import { Product } from "../../../domain/product";
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { FoodServiceRepository } from '../../../repositories/foodServiceRepository';
import { FoodServiceProduct } from '../../../domain/foodServiceProduct';
import { ProductBaseRepository } from '../../../repositories/productBaseRepository';
import { ProductBase } from '../../../domain/productBase';
import { FoodServiceAccountStatusService } from '../../../services/foodServiceAccountStatusService';

@autoinject
export class SelecaoDeProdutosFoodService {

    classes: ProductClass[];
    categories: ProductCategory[];
    allProducts: ProductBase[];
    filteredProducts: ProductBase[];
    selectedCategory: ProductCategory;
    selectedClass: ProductClass;
    filter: string;
    isProcessing: boolean;
    isLoading: boolean;

    subscriptions: Array<Subscription> = [];

    constructor(
        private service: IdentityService,
        private nService: NotificationService,
        private ea: EventAggregator,
        private productRepository: ProductRepository,
        private productBaseRepository: ProductBaseRepository,
        private repository: FoodServiceRepository,
        private foodServiceAccountStatusService: FoodServiceAccountStatusService
    ) {
        this.isProcessing = false;
    }

    attached(): void {
        this.loadData();

        this.subscriptions.push(
            this.ea.subscribe('productRemoved', (fp: FoodServiceProduct) => {
                this.loadData();
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

    updateCategory() {
        this.search();
    }

    loadData() {
        this.allProducts = [];
        this.filteredProducts = [];
        this.isLoading = true;

        var promisse0 = this.productRepository
            .getAllClassesByOfferedProducts()
            .then((data: ProductClass[]) => {
                this.classes = data;

                if (data.length > 0) {
                    this.selectedClass = data[0];
                }
                this.ea.publish('dataLoaded');
            });

        var promisse1 = this.productBaseRepository
            .getAllProducts()
            .then((data: ProductBase[]) => {
                this.allProducts = data;
                this.filteredProducts = data;
            });

        Promise.all([promisse0, promisse1]).then(() => {
            this.isLoading = false;
            this.search();
        });
    }

    marketChanged() {
        (<any>this.selectedCategory) = '-1';
        this.search();
    }

    search() {

        this.isLoading = true;

        this.filteredProducts = this.allProducts.filter((x: ProductBase) => {

            var isFound = true;

            if (this.selectedClass != null && this.selectedClass.id != '') {
                if (x.category.productClass.id == this.selectedClass.id) {
                    isFound = true;
                }
                else {
                    isFound = false;
                }
            }

            if (isFound) {

                if (this.selectedCategory != null && this.selectedCategory.id != null) {
                    if (x.category.id == this.selectedCategory.id) {
                        isFound = true;
                    }
                    else {
                        isFound = false;
                    }
                }

                if (isFound) {

                    if ((this.filter != null && this.filter != '')) {
                        if (x.name.toUpperCase().includes(this.filter.toUpperCase())) {
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

        this.isLoading = false;
    }

    addProduct(product: Product, base: ProductBase) {

        (<any>product).isLoading = true;

        this.isProcessing = true;

        var foodProduct = new FoodServiceProduct();
        foodProduct.product = product;
        foodProduct.isActive = true;

        this.repository
            .addProduct(foodProduct)
            .then((data: FoodServiceProduct) => {

                base.products = base.products.filter(x => x.id != product.id);
                this.nService.presentSuccess('Produto incluído com sucesso!');

                this.foodServiceAccountStatusService.refresh()
                    .then(() => this.ea.publish('foodServiceAccountStatusChanged'));

                this.ea.publish('productAdded', data);
                this.isProcessing = false;
                (<any>product).isLoading = true;

            }).catch(e => {
                this.nService.presentError(e);
                this.isProcessing = false;
                (<any>product).isLoading = true;
            });

    }

}