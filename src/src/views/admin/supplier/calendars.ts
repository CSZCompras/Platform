import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ValidationControllerFactory, ValidationController, validateTrigger, ValidationRules, ControllerValidateResult } from 'aurelia-validation';
import { EventAggregator } from 'aurelia-event-aggregator';
import { NotificationService } from '../../../services/notificationService';
import { FormValidationRenderer } from '../../formValidationRenderer';
import { CalendarsRepository } from './../../../repositories/calendarsRepository';
import { Calendar } from '../../../domain/calendar';


@autoinject
export class Calendars {

    validationController: ValidationController;

    calendars: Calendar[] = [];

    showNewCalendarForm: boolean = false;
    newCalendar: Calendar = new Calendar();
    isSaving: boolean = false;


    constructor(
        private router: Router,
        private ea: EventAggregator,
        private nService: NotificationService,
        private calendarsRepository: CalendarsRepository,
        private validationControllerFactory: ValidationControllerFactory
    ) {
        this.validationController = this.validationControllerFactory.createForCurrentScope();
        this.validationController.addRenderer(new FormValidationRenderer());
        this.validationController.validateTrigger = validateTrigger.blur;

        ValidationRules
            .ensure((calendar: Calendar) => calendar.name).displayName('Nome do calendário').required()
            .on(this.newCalendar);
    }

    attached() {
        this.ea.publish('loadingData');
        this.loadDataAsync();
    }

    calendarSelected(calendar: Calendar) {
        this.router.navigateToRoute('calendarDatesAdmin', { id: calendar.id });
    }

    newCalendarClick(): void {
        this.showNewCalendarForm = true;
    }

    saveNewCalendarClick(): void {
        this.isSaving = true;

        this.validationController
            .validate()
            .then((result: ControllerValidateResult) => {

                if (!result.valid) {
                    this.nService.error('Erros de validação foram encontrados');
                    this.isSaving = false;
                    return;
                }

                let calendar = this.calendarsRepository
                    .addAsync(this.newCalendar)
                    .then((c: Calendar) => {
                        this.calendars.push(c);
                        this.newCalendar.name = '';
                        this.showNewCalendarForm = false;
                        this.isSaving = false;
                        this.nService.success('Calendário criado');
                    })
                    .catch(error => {
                        this.nService.error('Erro ao criar calendário');
                        this.isSaving = false;
                    });
            });
    }

    cancelNewCalendarClick(): void {
        this.newCalendar.name = '';
        this.showNewCalendarForm = false;
    }

    async loadDataAsync(): Promise<void> {
        this.calendars = await this.calendarsRepository.getAsync();
        this.ea.publish('dataLoaded');
    }

}