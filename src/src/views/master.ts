import { Router, RouterConfiguration } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-dependency-injection'; 
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
import { RegisterStatus } from '../domain/registerStatus';
import 'jquery-visible';
import 'popper.js';
import 'bootstrap';
import 'velocity-animate';

@autoinject
export class Master {

	prefix 					: string;
    router                  : Router;
    isLogged                : boolean;
    identity                : Identity;
    isLoading               : boolean; 
	isLoadingOrders         : boolean; 
	isloadingFoodServices   : boolean; 
    notifications 			: Notification[];
    unSeenCount 			: number;
	newOrdersCount			: number;
	acceptedOrdersCount		: number;
	rejectedOrdersCount		: number;
    novoFoodServices		: FoodServiceConnectionViewModel[];
	waitingFoodServices		: FoodServiceConnectionViewModel[];

    constructor(
        private service                 : IdentityService, 
        private nService 				: NotificationService,
		private notificationRepository 	: NotificationRepository,
		private identityService			: IdentityService,
        private orderRepo 				: OrderRepository,
        private messageService 			: MessageService, 
        private connRepository 			: FoodServiceConnectionRepository,
        private ea                      : EventAggregator) {

	//	this.prefix = '/cszhomologacao';
		this.isLoadingOrders = true;
		this.isloadingFoodServices = true;
        this.ea.subscribe('loadingData', () => this.isLoading = true);
        this.ea.subscribe('dataLoaded', () => window.setTimeout(() => this.isLoading = false, 500));
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

		this.ea.subscribe('registerStatusModified', (x : RegisterStatus) => {

			if(this.identity != null){
				this.identity.registerStatus = x;
			}
		});
		
		
		if(this.isLogged){

			this.getNotifications(); // retrieve notifications	

			this.ea.subscribe('newOrder', () =>{
				this.newOrdersCount++;
			});

			this.ea.subscribe('orderAccepted', () => { // when supplier accept the order
				this.newOrdersCount--;
				this.acceptedOrdersCount++;
			});

			this.ea.subscribe('orderRejected', () => { // when supplier accept the order
				this.newOrdersCount--;
				this.rejectedOrdersCount++;
			});
				
			this.ea.subscribe('orderFinished', () => { 
				this.acceptedOrdersCount--;
			});

			this.ea.subscribe('newNotification', (x : Notification) =>{

				this.notifications.unshift(x);
				
				this.updateUnSeenCount();

				this.ea.publish(x.eventName, x.body);

				if( this.identity.type == UserType.Supplier){
					this.loadFoodServiceConnections();
				}
			});

			if( this.identity.type != UserType.Admin){
				this.getOrders();
			}

			if( this.identity.type == UserType.FoodService){

				this.ea.subscribe('registrationSent', () => this.loadFoodServiceConnections()); 
			}

			if( this.identity.type == UserType.Supplier){
				this.loadFoodServiceConnections();
				this.ea.subscribe('registrationSent', () => this.loadFoodServiceConnections()); // ???
				this.ea.subscribe('foodApproved', () => this.loadFoodServiceConnections());  // ???
				this.ea.subscribe('registrationRejected', () => this.loadFoodServiceConnections());  // ???
			}
		} 
 
		if(this.identity.type == UserType.Admin){
			this.router.navigateToRoute('dashboardAdmin');
		}
		else if(this.identity.type == UserType.Supplier){
			this.router.navigateToRoute('dashboardFornecedor');
			this.ea.subscribe('registrationRejected', () => this.loadFoodServiceConnections());  // ???
		}
		else if(this.identity.type == UserType.FoodService){
			this.router.navigateToRoute('dashboardFoodService');
		}   

	}

	loadFoodServiceConnections(){

		var p1 = this.connRepository
					.getSupplierConnections(0)
					.then( (data : FoodServiceConnectionViewModel[]) =>{
							this.novoFoodServices = data;
					}).catch( e => {
					    this.nService.presentError(e);
					});

		var p2 = this.connRepository
					.getSupplierConnections(1)
					.then( (data : FoodServiceConnectionViewModel[]) =>{
							this.waitingFoodServices = data;
					}).catch( e => {
					this.nService.presentError(e);
					});

		Promise.all([p1, p2]).then( () => this.isloadingFoodServices = false);
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
		
		var p1 = this.orderRepo
				.getMyNewOrders()
				.then( (orders : any[]) =>{

					this.newOrdersCount = orders.length;
				}).catch( e =>  {
					this.nService.presentError(e);
				});

		var p2 = this.orderRepo
				.getMyAcceptedOrders()
				.then( (orders : any[]) =>{

					this.acceptedOrdersCount = orders.length;
				}).catch( e =>  {
					this.nService.presentError(e);	
			});

		var p3 = 	this.orderRepo
				.getMyRejectedOrders()
				.then( (orders : any[]) =>{
					this.rejectedOrdersCount = orders.length;
				}).catch( e =>  {
					this.nService.presentError(e);
				});

		Promise.all([p1, p2, p3]).then( () => this.isLoadingOrders = false);
			
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

        config.title = '';

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
				
				
				unSeenList.forEach( (x) => {
					x.wasSeen = true;
				});

            }).catch( e =>  {
                this.nService.presentError(e);
            });
        }
    }
    

   
	addRoutes(config: RouterConfiguration, router: Router) : void {   

		this.identity = this.service.getIdentity(); 

		if(this.identity == null || this.identity.type == UserType.Admin){

			config.map([    				
				{ route: '', redirect: 'dashboardAdmin' },
				{ route: 'dashboard', name: 'dashboard',  moduleId: PLATFORM.moduleName('./admin/dashboard')}
			]);
		}
		else if(this.identity.type == UserType.Supplier){

			config.map([    				
				{ route: '', redirect: 'dashboard' },
				{ route: 'dashboard', name: 'dashboard', moduleId: PLATFORM.moduleName('./fornecedor/dashboard')  }
			]);
		}

		else if(this.identity.type == UserType.FoodService){
			
			config.map([    				
				{ route: '', redirect: 'dashboard' },
				{ route: 'dashboard', name: 'dashboard',  moduleId: PLATFORM.moduleName('./foodService/dashboard')}
			]);
		}

		config.map([    
			{ route: 'login', name: 'login', moduleId: PLATFORM.moduleName('./login') },
			{ route: 'dashboardAdmin', name: 'dashboardAdmin', moduleId: PLATFORM.moduleName('./admin/dashboard') },
			{ route: 'dashboardFornecedor', name: 'dashboardFornecedor', moduleId: PLATFORM.moduleName('./fornecedor/dashboard') },
			{ route: 'cadastro', name: 'cadastro', moduleId: PLATFORM.moduleName('./fornecedor/cadastro') } ,
			{ route: 'produtos', name: 'produtos', moduleId: PLATFORM.moduleName('./fornecedor/produtos') } ,
			{ route: 'regrasDeMercado', name: 'regrasDeMercado', moduleId: PLATFORM.moduleName('./fornecedor/regrasDeMercado') } ,
			{ route: 'dashboardFoodService', name: 'dashboardFoodService', moduleId: PLATFORM.moduleName('./foodService/dashboard') }, 
			{ route: 'cadastroFoodService', name: 'cadastroFoodService', moduleId: PLATFORM.moduleName('./foodService/cadastro') },
			{ route: 'regraDeEntrega', name: 'regraDeEntrega', moduleId: PLATFORM.moduleName('./foodService/regraDeEntrega') }, 
			{ route: 'fornecedores', name: 'fornecedores', moduleId: PLATFORM.moduleName('./foodService/fornecedores') }, 
			{ route: 'meusProdutos', name: 'meusProdutos', moduleId: PLATFORM.moduleName('./foodService/meusProdutos') },  
			{ route: 'clientes', name: 'clientes', moduleId: PLATFORM.moduleName('./fornecedor/clientes') } ,  
			{ route: 'cotacao', name: 'cotacao', moduleId: PLATFORM.moduleName('./cotacao/cotacao') }  ,  
			{ route: 'pedidosFornecedor', name: 'pedidosFornecedor', moduleId: PLATFORM.moduleName('./fornecedor/pedidosFornecedor') } ,  
			{ route: 'pedidosFoodService', name: 'pedidosFoodService', moduleId: PLATFORM.moduleName('./foodService/pedidosFoodService') },
			{ route: 'mercadosAdmin', name: 'mercadosAdmin', moduleId: PLATFORM.moduleName('./admin/product/listMarkets') },
			{ route: 'produtosAdmin', name: 'produtosAdmin', moduleId: PLATFORM.moduleName('./admin/product/listProduct') },
			{ route: 'suppliersAdmin', name: 'suppliersAdmin', moduleId: PLATFORM.moduleName('./admin/supplier/listSuppliers') },
			{ route: 'marcasAdmin', name: 'marcasAdmin', moduleId: PLATFORM.moduleName('./admin/product/listBrands') },			
			{ route: 'foodServicesAdmin', name: 'foodServicesAdmin', moduleId: PLATFORM.moduleName('./admin/foodService/listFoodServices') },
			{ route: 'editSupplierAdmin', name: 'editSupplierAdmin', moduleId: PLATFORM.moduleName('./admin/supplier/editSupplier') },
			{ route: 'editFoodServiceAdmin', name: 'editFoodServiceAdmin', moduleId: PLATFORM.moduleName('./admin/foodService/editFoodService') },
			{ route: 'avaliacoes', name: 'avaliacoes', moduleId: PLATFORM.moduleName('./admin/supplier/evaluations') },
			{ route: 'avaliacoesFornecedor', name: 'avaliacoesFornecedor', moduleId: PLATFORM.moduleName('./fornecedor/evaluations') },
			{ route: 'avaliacoesFoodService', name: 'avaliacoesFoodService', moduleId: PLATFORM.moduleName('./foodService/evaluations') },
			{ route: 'financeiro', name: 'financeiro', moduleId: PLATFORM.moduleName('./admin/finance/listInvoice') }
		]);

        config.mapUnknownRoutes({ route: null, redirect: '/' });
    } 

	logout() : void {
		debugger;
		this.identityService.resetIdentity();

		if(this.prefix != null && this.prefix != ''){
			window.location.assign( window.location.origin + this.prefix + '/'); 
		}
		else{
			window.location.assign('/'); 
		}
   }
}
