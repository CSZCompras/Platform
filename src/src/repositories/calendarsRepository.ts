import { autoinject } from 'aurelia-framework';
import { Rest, Config } from 'aurelia-api';
import { Calendar } from './../domain/calendar';
import { CalendarDate } from './../domain/calendarDate';

@autoinject
export class CalendarsRepository {

    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('apiAddress');
    }

    async getAsync(): Promise<Calendar[]> {
        return await this.api.find('calendars');
    }

    async getByIdAsync(id: string): Promise<Calendar> {
        return await this.api.find(`calendars/${id}`);
    }

    async addAsync(calendar: Calendar): Promise<Calendar> {
        return await this.api.post('calendars', calendar);
    }

    async addDateAsync(id: string, calendarDate: CalendarDate): Promise<CalendarDate> {
        return await this.api.post(`calendars/${id}/dates`, calendarDate);
    }

    async removeDateAsync(id: string, calendarDate: CalendarDate): Promise<CalendarDate> {
        return await this.api.destroy(`calendars/${id}/dates/${calendarDate.id}`);
    }
}
