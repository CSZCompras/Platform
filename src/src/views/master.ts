import { Router, RouterConfiguration, NavigationInstruction } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-dependency-injection'; 
import { Config, Rest } from 'aurelia-api'; 

import 'jquery-visible';
import 'popper.js';
import 'bootstrap';
import 'velocity-animate';
/* import 'malihu-custom-scrollbar-plugin';*/ 
import { Identity } from '../domain/identity';
import { IdentityService } from '../services/identityService';
import { ScriptRunner } from '../services/scriptRunner';
import { FoodServiceConnectionViewModel } from '../domain/foodServiceViewModel';
import { UserType } from '../domain/userType';
import { Notification } from '../domain/notification';
import { FoodServiceConnectionRepository } from '../repositories/foodServiceConnectionRepository';
import { NotificationService } from '../services/notificationService';
import { NotificationRepository } from '../repositories/notificationRepository';
import { OrderRepository } from '../repositories/orderRepository';
import { MessageService } from '../services/messageService';

@autoinject
export class MasterBlotter {

    router                  : Router;
    isLogged                : boolean;
    identity                : Identity;
    isLoading               : boolean; 
    notifications 			: Notification[];
    unSeenCount 			: number;
	newOrdersCount			: number;
    acceptedOrdersCount		: number;
    novoFoodServices		: FoodServiceConnectionViewModel[];
	waitingFoodServices		: FoodServiceConnectionViewModel[];

    constructor(
        private service                 : IdentityService, 
        private nService 				: NotificationService,
        private notificationRepository 	: NotificationRepository,
        private orderRepo 				: OrderRepository,
        private messageService 			: MessageService, 
        private connRepository 			: FoodServiceConnectionRepository,
        private ea                      : EventAggregator
    ) {

        this.ea.subscribe('loadingData', () => {
            this.isLoading = true;
        });

        this.ea.subscribe('dataLoaded', () => {

            window.setTimeout(() => this.isLoading = false, 500);
        });
    }

    

    attached() {
        ScriptRunner.runScript();
        this.isLogged = this.service.isLogged();
        this.identity = this.service.getIdentity();
        this.load();
    }

	load(){

		this.notifications = [];
		this.unSeenCount = 0; 

		this.isLogged = this.service.isLogged();
		
		this.ea.subscribe('loginDone', () => {

			this.isLogged = this.service.isLogged()
			this.identity = this.service.getIdentity(); 
			ScriptRunner.runScript();  

			if(this.identity.type == 0){
				this.router.navigate('/#/dashboard');
			}
			else if(this.identity.type == 1){
				this.router.navigateToRoute('dashboardFoodService');
			}   
		}); 

		this.ea.subscribe('orderAccepted', () => {
			this.newOrdersCount--;
			this.acceptedOrdersCount++;
		});

		this.ea.subscribe('loadingData', () => {
			this.isLoading = true;
		});

		this.ea.subscribe('dataLoaded', () => {
			window.setTimeout( () => this.isLoading = false, 500);
        });
        

		if(this.isLogged){
			this.identity = this.service.getIdentity();
		} 
		
		if(this.isLogged){

			this.getNotifications();

			this.ea.subscribe('newNotification', (x : Notification) =>{
				this.notifications.unshift(x);
				this.updateUnSeenCount();
				this.ea.publish(x.eventName);

				if(x.eventName.toUpperCase() == 'NEWORDER'){
					this.newOrdersCount++;
				} 
				if( this.identity.type == UserType.Supplier){
					this.getSuppliers();
				}
			});

			if( this.identity.type != UserType.Admin){
				this.getOrders();
			}

			if( this.identity.type == UserType.Supplier){
				this.getSuppliers();
				this.ea.subscribe('registrationSent', () => this.getSuppliers());
				this.ea.subscribe('foodApproved', () => this.getSuppliers());
			}
		}

	}

	getSuppliers(){

		this.connRepository
					.getSuppliers(0)
					.then( (data : FoodServiceConnectionViewModel[]) =>{
							this.novoFoodServices = data;
					}).catch( e => {
					    this.nService.presentError(e);
					});

		this.connRepository
					.getSuppliers(1)
					.then( (data : FoodServiceConnectionViewModel[]) =>{
							this.waitingFoodServices = data;
					}).catch( e => {
					this.nService.presentError(e);
					});
	}

	getNotifications(){ 
			
		this.notificationRepository
			.getAll()
			.then( (notifications : Notification[]) =>{ 

				this.notifications = notifications; 				
				this.messageService.subscribe();
				this.updateUnSeenCount();

			}).catch( e =>  {
				this.nService.presentError(e);
			});
	}

	getOrders(){
		
		this.orderRepo
			.getNyNewOrders()
			.then( (orders : any[]) =>{

				this.newOrdersCount = orders.length;
			}).catch( e =>  {
				this.nService.presentError(e);
			});

			this.orderRepo
				.getNyAcceptedOrders()
				.then( (orders : any[]) =>{

					this.acceptedOrdersCount = orders.length;
				}).catch( e =>  {
					this.nService.presentError(e);
				});
	}

	updateUnSeenCount(){
		if(this.notifications != null){
			this.unSeenCount = this.notifications.filter( (notification : Notification) => notification.wasSeen ? false : true ).length;
		}
	}

    canActivate(params, routeConfig, navigationInstruction): boolean {
        return this.service.isLogged();
    } 

    configureRouter(config: RouterConfiguration, router: Router): void {

        config.title = 'Blotter';

        this.router = router;
        this.addRoutes(config, router);
    }

    

   updateNotifications(){
        if(this.unSeenCount > 0)  {

        var notificationIds = new Array<string>();
        var unSeenList = this.notifications.filter( (x) => ! x.wasSeen);
        unSeenList.forEach( (x) => {
            notificationIds.push(x.id)
        });

        this.notificationRepository
            .updateUnseen(notificationIds)
            .then( () =>{
                this.unSeenCount = 0;
                this.getNotifications();
            }).catch( e =>  {
                this.nService.presentError(e);
            });
        }
    }
    

   addRoutes(config: RouterConfiguration, router: Router) : void { 

    config.map([    
        { route: '', redirect: 'dashboard' },
        { route: 'dashboard', name: 'dashboard', moduleId: PLATFORM.moduleName('./dashboard') },
        { route: 'cadastro', name: 'cadastro', moduleId: PLATFORM.moduleName('./cadastro') } ,
        { route: 'produtos', name: 'produtos', moduleId: PLATFORM.moduleName('./produtos') } ,
        { route: 'regrasDeMercado', name: 'regrasDeMercado', moduleId: PLATFORM.moduleName('./regrasDeMercado') } ,
        { route: 'login', name: 'login', moduleId: PLATFORM.moduleName('./login') },
        { route: 'dashboardFoodService', name: 'dashboardFoodService', moduleId: PLATFORM.moduleName('./foodService/dashboard') }, 
        { route: 'cadastroFoodService', name: 'cadastroFoodService', moduleId: PLATFORM.moduleName('./foodService/cadastro') }, 
        { route: 'fornecedores', name: 'fornecedores', moduleId: PLATFORM.moduleName('./foodService/fornecedores') }, 
        { route: 'meusProdutos', name: 'meusProdutos', moduleId: PLATFORM.moduleName('./foodService/meusProdutos') },  
        { route: 'clientes', name: 'clientes', moduleId: PLATFORM.moduleName('./fornecedor/clientes') } ,  
        { route: 'cotacao', name: 'cotacao', moduleId: PLATFORM.moduleName('./cotacao/cotacao') }  ,  
        { route: 'pedidosFornecedor', name: 'pedidosFornecedor', moduleId: PLATFORM.moduleName('./cotacao/pedidosFornecedor') } ,  
        { route: 'pedidosFoodService', name: 'pedidosFoodService', moduleId: PLATFORM.moduleName('./foodService/pedidosFoodService') },
        { route: 'produtosAdmin', name: 'produtosAdmin', moduleId: PLATFORM.moduleName('./admin/product/listProduct') },
        { route: 'suppliersAdmin', name: 'suppliersAdmin', moduleId: PLATFORM.moduleName('./admin/supplier/listSuppliers') },
        { route: 'editSupplierAdmin', name: 'editSupplierAdmin', moduleId: PLATFORM.moduleName('./admin/supplier/editSupplier') }
    ]);

        config.mapUnknownRoutes({ route: null, redirect: '/' });
    }

}
