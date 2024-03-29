import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Config } from 'aurelia-api';
import { EventAggregator } from 'aurelia-event-aggregator';
import { NotificationService } from '../../../services/notificationService';
import { Supplier } from '../../../domain/supplier';
import { StateRegistration } from '../../../domain/stateRegistration';
import { Calendar } from './../../../domain/calendar';
import { SupplierCalendar } from './../../../domain/supplierCalendar';
import { User } from '../../../domain/user';
import { UserStatus } from '../../../domain/userStatus';
import { UserType } from '../../../domain/userType';
import { SupplierStatus } from '../../../domain/supplierStatus';
import { SupplierValidator } from '../../../validators/supplierValidator';
import { ConsultaCEPService } from '../../../services/consultaCEPService';
import { ConsultaCepResult } from '../../../domain/consultaCepResult';
import { FoodServiceSupplier } from '../../../domain/foodServiceSupplier';
import { Address } from '../../../domain/address';
import 'twitter-bootstrap-wizard';
import 'jquery-mask-plugin';
import 'aurelia-validation';

// Repositories
import { SupplierRepository } from '../../../repositories/supplierRepository';
import { UserRepository } from '../../../repositories/userRepository';
import { StateRegistrationRepository } from '../../../repositories/stateRegistrationRepository';
import { FoodServiceConnectionRepository } from '../../../repositories/foodServiceConnectionRepository';
import { SupplierCalendarsRepository } from './../../../repositories/supplierCalendarsRepository';
import { CalendarsRepository } from './../../../repositories/calendarsRepository';

@autoinject
export class EditSupplier {

    supplier: Supplier;
    supplierId: string;
    selectedFiles: any;
    isUploading: boolean;
    stateRegistrations: StateRegistration[];
    users: User[];
    user: User;
    userEditing: User;
    validator: SupplierValidator;
    edit: boolean;
    loadConnection: boolean;
    connection: FoodServiceSupplier;
    calendars: ICalendarItem[];
    supplierCalendars: SupplierCalendar[];


    constructor(
        private router: Router,
        private ea: EventAggregator,
        private nService: NotificationService,
        private stateRepo: StateRegistrationRepository,
        private userRepository: UserRepository,
        private consultaCepService: ConsultaCEPService,
        private config: Config,
        private connectionRepository: FoodServiceConnectionRepository,
        private repository: SupplierRepository,
        private calendarsRepository: CalendarsRepository,
        private supplierCalendarsRepository: SupplierCalendarsRepository
    ) {

        this.supplier = new Supplier();
        this.supplier.address = new Address();
        this.user = new User();
        this.edit = true;
        this.ea.subscribe('showSupplierDetails', (event) => {

            this.supplierId = event.supplierId;
            this.edit = event.edit
            this.loadConnection = event.loadConnection;

            if (!this.loadConnection) {
                this.connection = null;
            }
            this.loadData();
        });
        this.connection = null;
        this.loadConnection = null;
    }

    attached() {
        this.ea.publish('loadingData');
        this.loadData();
    }

    activate(params) {
        if (params != null && params.supplierId) {

            this.supplierId = params.supplierId;
        }
    }

    loadData() {

        if (!this.supplierId) {
            return;
        }

        var p1 = this.repository
            .get(this.supplierId)
            .then(x => this.supplier = x)
            .catch(e => this.nService.presentError(e));

        var p2 = this.stateRepo
            .getAll()
            .then((data: StateRegistration[]) => this.stateRegistrations = data)
            .catch(e => this.nService.presentError(e));

        var p3 = this.userRepository
            .getUsersFromSupplier(this.supplierId)
            .then((data: User[]) => this.users = data)
            .catch(e => this.nService.presentError(e));

        var p4 = this.calendarsRepository
            .getAsync()
            .then((calendars: Calendar[]) => this.calendars = calendars.map<ICalendarItem>(x => <ICalendarItem>{ id: x.id, name: x.name }))
            .catch(e => this.nService.presentError(e));

        var p5 = this.supplierCalendarsRepository
            .getBySupplierIdAsync(this.supplierId)
            .then((supplierCalendars: SupplierCalendar[]) => this.supplierCalendars = supplierCalendars)
            .catch(e => this.nService.presentError(e));

        Promise.all([p1, p2, p3, p4, p5]).then(() => {

            this.ea.publish('dataLoaded');

            if (this.supplier.address == null) {
                this.supplier.address = new Address();
            }

            this.validator = new SupplierValidator(this.supplier);

            for (const supplierCalendar of this.supplierCalendars) {
                this.calendars.find(x => x.id === supplierCalendar.calendarId).selected = true;
            }
        });

        if (this.loadConnection) {
            this.connectionRepository
                .getFoodServiceConnection(this.supplierId)
                .then((x: FoodServiceSupplier) => this.connection = x)
                .catch(e => this.nService.presentError(e));

        }
    }

    cancelUpload() {
        this.selectedFiles = [];
        (<any>document.getElementById("files")).value = "";
    }

    downloadSocialContract() {
        var api = this.config.getEndpoint('apiAddress');
        window.open(api.client.baseUrl + 'downloadSupplierContractSocial?supplierId=' + this.supplier.id, '_blank');
    }

    uploadSocialContract() {

        this.isUploading = true;

        let formData = new FormData();

        for (let i = 0; i < this.selectedFiles.length; i++) {
            formData.append('file', this.selectedFiles[i]);
        }


        this.repository
            .uploadSocialContract(formData, this.supplier.id)
            .then(() => {

                this.isUploading = false;
                (<any>document.getElementById("files")).value = "";
                this.nService.presentSuccess('Contrato atualizado com sucesso!');

            }).catch(e => {
                this.selectedFiles = [];
                this.nService.error(e);
                this.isUploading = false;
            });
    }

    save() {

        this.repository
            .save(this.supplier)
            .then(() => {
                this.nService.presentSuccess('Cadastro atualizado com sucesso!');

            }).catch(e => {
                this.nService.error(e);
            });

    }

    cancel() {
        this.router.navigateToRoute('suppliersAdmin');
    }

    editUser(x: User) {

        (<any>x).isEditing = true;
        (<any>x)._name = x.name;
        (<any>x)._email = x.email;
    }

    cancelEditUser(x: User) {

        (<any>x).isEditing = false;
        x.name = (<any>x)._name;
        x.email = (<any>x)._email;
    }

    editUserStatus(x: User, status: UserStatus) {

        (<any>x)._status = status;
        x.status = status;

        this.userRepository
            .save(x)
            .then((x) => {
                this.nService.presentSuccess('Usuário atualizado com sucesso!');

            }).catch(e => {
                x.status = (<any>x)._status;
                this.nService.error(e);
            });
    }

    saveEditUser(x: User) {

        this.userRepository
            .save(x)
            .then(() => {
                this.nService.presentSuccess('Usuário atualizado com sucesso!');
                (<any>x).isEditing = false;

            }).catch(e => {
                this.nService.error(e);
            });
    }

    createUser() {
        this.user.supplier = this.supplier;
        this.user.type = UserType.Supplier;

        this.userRepository
            .save(this.user)
            .then((x) => {
                this.nService.presentSuccess('Usuário atualizado com sucesso!');
                this.users.unshift(x);
                this.user = new User();

            }).catch(e => {
                this.nService.error(e);
            });
    }

    cancelCreateUser() {

        this.user = new User();
    }

    resendInvite(user: User) {

        this.userRepository
            .resendInvite(user.id)
            .then(() => {
                this.nService.presentSuccess('Invite enviado com sucesso!');
            })
            .catch(e => this.nService.presentError(e));


    }

    editStatus(status: SupplierStatus) {

        this.repository
            .updateStatus(this.supplier.id, status)
            .then(() => {
                this.supplier.status = status;
                this.nService.presentSuccess('Status atualizado com sucesso!');
            })
            .catch(e => this.nService.presentError(e));
    }

    consultaCEP() {

        this.validator.addressValidator.validateCep();

        if (this.supplier.address.cep.length >= 8) {

            this.consultaCepService
                .findCEP(this.supplier.address.cep)
                .then((result: ConsultaCepResult) => {

                    if (result != null) {

                        this.supplier.address.city = result.localidade;
                        this.supplier.address.neighborhood = result.bairro;
                        this.supplier.address.number = null;
                        this.supplier.address.logradouro = result.logradouro;
                        this.supplier.address.complement = result.complemento;
                        this.supplier.address.state = result.uf;
                        this.validator.validate();
                    }
                }).catch(e => {
                    this.nService.presentError(e);
                });
        }
    }

    cancelView() {
        this.ea.publish('showSupplierDetailsCanceled');
    }

    async addCalendarAsync(calendar: ICalendarItem) {
        await this.supplierCalendarsRepository.addAsync({ calendarId: calendar.id, supplierId: this.supplierId });
        this.supplierCalendars.push({ calendarId: calendar.id, supplierId: this.supplierId });
        calendar.selected = true;
    }

    async removeCalendarAsync(calendar: ICalendarItem) {
        await this.supplierCalendarsRepository.removeAsync({ calendarId: calendar.id, supplierId: this.supplierId });
        this.supplierCalendars.splice(
            this.supplierCalendars.indexOf(this.supplierCalendars.find(x => x.calendarId === calendar.id)),
            1
        );
        calendar.selected = false;
    }
}

interface ICalendarItem {
    id: string;
    name: string;
    selected: boolean;
}
