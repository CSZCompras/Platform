import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ValidationControllerFactory, ValidationController, validateTrigger, ValidationRules, ControllerValidateResult } from 'aurelia-validation';
import { EventAggregator } from 'aurelia-event-aggregator';
import { NotificationService } from '../../../services/notificationService';
import { FormValidationRenderer } from '../../formValidationRenderer';
import { CalendarsRepository } from './../../../repositories/calendarsRepository';
import { Calendar } from '../../../domain/calendar';
import { CalendarDate } from '../../../domain/calendarDate';

@autoinject
export class CalendarDates {

    validationController: ValidationController;

    calendarId: string;
    calendar: Calendar;

    showNewCalendarDateForm: boolean = false;
    newCalendarDate: CalendarDate = new CalendarDate();
    isSaving: boolean = false;
    isRemoving: boolean = false;


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
            .ensure((calendarDate: CalendarDate) => calendarDate.name).displayName('Nome').required()
            .ensure((calendarDate: CalendarDate) => calendarDate.date).displayName('Data').required()
            .on(this.newCalendarDate);
    }

    activate(params): void {
        this.calendarId = params.id;
    }

    attached(): void {
        this.ea.publish('loadingData');
        this.loadDataAsync();
    }

    newCalendarDateClick(): void {
        this.showNewCalendarDateForm = true;
    }

    saveNewCalendarDateClick(): void {
        this.isSaving = true;

        this.validationController
            .validate()
            .then((result: ControllerValidateResult) => {

                if (!result.valid) {
                    this.nService.error('Erros de validação foram encontrados');
                    this.isSaving = false;
                    return;
                }

                let calendarDate = this.calendarsRepository
                    .addDateAsync(this.calendar.id, this.newCalendarDate)
                    .then((cd: CalendarDate) => {
                        this.calendar.calendarDates.push(cd);
                        this.newCalendarDate.name = '';
                        this.newCalendarDate.date = null;
                        this.showNewCalendarDateForm = false;
                        this.isSaving = false;
                        this.nService.success('Data adicionada');
                    })
                    .catch(error => {
                        this.nService.error('Erro ao criar data');
                        this.isSaving = false;
                    });
            });
    }

    cancelNewCalendarDateClick(): void {
        this.newCalendarDate.name = '';
        this.newCalendarDate.date = null;
        this.showNewCalendarDateForm = false;
    }

    deleteCalendarDateClick(calendarDate: CalendarDate): void {
        this.isRemoving = true;

        this.calendarsRepository
            .removeDateAsync(this.calendar.id, calendarDate)
            .then(() => {
                this.calendar.calendarDates.splice(this.calendar.calendarDates.indexOf(calendarDate), 1);
                this.isRemoving = false;
                this.nService.success('Data removida');
            })
            .catch(error => {
                this.nService.error('Erro ao remover data');
                this.isRemoving = false;
            });
    }

    returnClick(): void {
        this.router.navigateToRoute('calendarsAdmin');
    }

    async loadDataAsync(): Promise<void> {
        this.calendar = await this.calendarsRepository.getByIdAsync(this.calendarId);
        this.ea.publish('dataLoaded');
    }

}