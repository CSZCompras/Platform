import { autoinject, customAttribute } from 'aurelia-framework';
import 'jquery-mask-plugin';

@autoinject
export class TimeValueConverter {

    toView(value: number): string {
        if (!value) {
            return '';
        }

        if (isNaN(value)) {
            return '';
        }

        var h = (value / 100) | 0;
        var m = value % 100;

        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }

    fromView(value: string): number {
        return parseInt(value.replace(":", ''));
    }
}
