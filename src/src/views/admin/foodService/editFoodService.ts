import { inject, NewInstance} from 'aurelia-framework';
import { Aurelia, autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { Rest, Config } from 'aurelia-api';
import { EventAggregator } from 'aurelia-event-aggregator';
import { IdentityService } from '../../../services/identityService';
import { NotificationService } from '../../../services/notificationService';
import { ProductRepository } from '../../../repositories/productRepository';
import { Product } from '../../../domain/product';
import { ProductCategory } from '../../../domain/productCategory';
import { UnitOfMeasurementRepository } from '../../../repositories/unitOfMeasurementRepository';
import { UnitOfMeasurement } from '../../../domain/unitOfMeasurement';
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';
import 'aurelia-validation';
import { StateRegistration } from '../../../domain/stateRegistration';
import { StateRegistrationRepository } from '../../../repositories/stateRegistrationRepository';
import { User } from '../../../domain/user';
import { UserRepository } from '../../../repositories/userRepository';
import { UserStatus } from '../../../domain/userStatus';
import { UserType } from '../../../domain/userType';
import { FoodService } from '../../../domain/foodService';
import { FoodServiceRepository } from '../../../repositories/foodServiceRepository';
import { FoodServiceStatus } from '../../../domain/foodServiceStatus';
import { ConsultaCEPService } from '../../../services/consultaCEPService';
import { ConsultaCepResult } from '../../../domain/consultaCepResult';
import { FoodServiceValidator } from '../../../validators/foodServiceValidator';
import { Address } from '../../../domain/address';

@autoinject
export class EditFoodService{

    foodService         : FoodService;
    foodId              : string;
    selectedFiles       : any;
    isUploading         : boolean;
    stateRegistrations  : StateRegistration[];
    users               : User[];    
    user                : User;   
    userEditing         : User;     
	validator 			: FoodServiceValidator;

    constructor(
        private router              : Router, 
        private ea                  : EventAggregator,
        private nService            : NotificationService,
        private stateRepo           : StateRegistrationRepository, 
        private userRepository      : UserRepository,
        private config              : Config,
        private repository          : FoodServiceRepository, 
		private consultaCepService  : ConsultaCEPService) { 

            this.foodService = new FoodService();
            this.foodService.address = new Address();
            this.user = new User();
    }

    attached(){

        this.ea.publish('loadingData'); 
        this.loadData();
    }

    
    activate(params){ 

        if(params != null && params.foodId){ 

            this.foodId = params.foodId;
        } 
    }


    loadData(){

        var p1 =    this.repository
                        .get(this.foodId)
                        .then(x => this.foodService = x)
                        .catch( e => this.nService.presentError(e)); 

        var p2 =    this.stateRepo
                        .getAll()
                        .then( (data : StateRegistration[]) => this.stateRegistrations = data)
                        .catch( e => this.nService.presentError(e)); 

        var p3  =   this.userRepository
                    .getUsersFromFoodService(this.foodId)
                    .then( (data : User[]) => this.users = data)
                    .catch( e => this.nService.presentError(e)); 
                    
        Promise.all([p1, p2, p3]).then(() => {

            this.ea.publish('dataLoaded'); 

            if(this.foodService.address == null){
                this.foodService.address = new Address();
            } 
            this.validator = new FoodServiceValidator(this.foodService);				
        });
    } 

    save(){

        this.repository
            .save(this.foodService)
            .then( () =>{     
                this.nService.presentSuccess('Cadastro atualizado com sucesso!');

            }).catch( e => {
                this.nService.error(e);                
            });

    }

    cancel(){
        this.router.navigateToRoute('foodServicesAdmin');
    }

    editUser(x : User){

        (<any> x).isEditing = true;
        (<any> x)._name = x.name;
        (<any> x)._email = x.email;
    }

    cancelEditUser(x : User){

        (<any> x).isEditing = false;
        x.name = (<any> x)._name;
        x.email = (<any> x)._email;
    }

    editUserStatus(x : User, status : UserStatus){

        ( <any>x)._status = status;
        x.status = status;

        this.userRepository
        .save(x)
        .then( (x) =>{     
            this.nService.presentSuccess('Usuário atualizado com sucesso!');

        }).catch( e => {
            x.status = ( <any>x)._status;
            this.nService.error(e);                
        }); 
    }

    saveEditUser(x : User){
        
        this.userRepository
            .save(x)
            .then( () =>{     
                this.nService.presentSuccess('Usuário atualizado com sucesso!');
                ( <any>x).isEditing = false;

            }).catch( e => {
                this.nService.error(e);                
            }); 
    }

    createUser(){
        this.user.foodService = this.foodService;
        this.user.type = UserType.FoodService;
        
        this.userRepository
            .save(this.user)
            .then( (x) =>{     
                this.nService.presentSuccess('Usuário atualizado com sucesso!');
                this.users.unshift(x);
                this.user = new  User();

            }).catch( e => {
                this.nService.error(e);                
            }); 
    }

    cancelCreateUser(){

        this.user = new User();
    }

    resendInvite(user : User){

        this.userRepository
            .resendInvite(user.id)
            .then( () => {
                this.nService.presentSuccess('Invite enviado com sucesso!');
            })
            .catch(e => this.nService.presentError(e));


    }

    editStatus( status : FoodServiceStatus){
        
        this.repository
            .updateStatus(this.foodService.id, status)
            .then( () => {
                this.foodService.status = status;
                this.nService.presentSuccess('Status atualizado com sucesso!');
            })
            .catch(e => this.nService.presentError(e));
    }

    

	consultaCEP(){

		this.validator.addressValidator.validateCep();

		if(this.foodService.address.cep.length >= 8){

			this.consultaCepService
				.findCEP(this.foodService.address.cep)
				.then( (result : ConsultaCepResult) => {

					if(result != null){
						
						this.foodService.address.city = result.localidade;
						this.foodService.address.neighborhood = result.bairro;
						this.foodService.address.number = null;
						this.foodService.address.logradouro = result.logradouro;
						this.foodService.address.complement = result.complemento;
						this.foodService.address.state = result.uf;
						this.validator.validate();
					}
				}).catch( e => 
				{
					this.nService.presentError(e);
				});
		}
	}

}