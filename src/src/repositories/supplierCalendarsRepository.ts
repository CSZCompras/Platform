import { autoinject } from 'aurelia-framework';
import { Rest, Config } from 'aurelia-api';
import { SupplierCalendar } from '../domain/supplierCalendar';

@autoinject
export class SupplierCalendarsRepository {

    api: Rest;

    constructor(private config: Config) {
        this.api = this.config.getEndpoint('apiAddress');
    }

    async getBySupplierIdAsync(supplierId: string): Promise<SupplierCalendar[]> {
        return await this.api.find('suppliercalendars', { supplierId: supplierId });
    }

    async addAsync(supplierCalendar: SupplierCalendar): Promise<void> {
        return await this.api.request('PUT', 'suppliercalendars', supplierCalendar);
    }

    async removeAsync(supplierCalendar: SupplierCalendar): Promise<void> {
        return await this.api.request('DELETE', 'suppliercalendars', supplierCalendar);
    }
}
