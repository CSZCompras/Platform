import { NotificationService } from '../services/notificationService';
import { ScriptRunner } from '../services/scriptRunner';
import { IdentityService } from "../services/identityService";
import { Identity } from '../domain/identity';
import { Credential } from "../domain/credential";
import { LoginRepository } from '../repositories/loginRepository';
import { autoinject, Aurelia } from 'aurelia-framework';
import { Router, RouterConfiguration, NavigationInstruction } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import environment from '../environment';

import 'jquery';
import 'popper.js';
import 'bootstrap';
import 'mdbootstrap';
import 'velocity-animate';
import 'velocity';
import 'custom-scrollbar';
import 'jquery-visible';
import 'ie10-viewport';

@autoinject
export class Login {

    prefix: string;
    credential: Credential;
    processing = false;

    constructor(
        private router: Router,
        private loginRepository: LoginRepository,
        private service: IdentityService,
        private ea: EventAggregator,
        private nService: NotificationService
    ) {
        this.prefix = environment.routePrefix;
    }

    attached(): void {
        ScriptRunner.runScript();

        if (IdentityService.identity) {
            this.ea.publish('loginDone');
            this.router.navigateToRoute('econocompras');
        }
    }

    doLogin(): void {
        this.processing = true;

        this.loginRepository
            .login(this.credential)
            .then((identity: Identity) => {
                this.service.setIdentity(identity);
                this.ea.publish('loginDone');
                this.router.navigateToRoute('econocompras');

            }).catch(e => {
                this.nService.error(e);
                this.processing = false;
            });
    }

}