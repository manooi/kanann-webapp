import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'thaidate'
})
export class ThaiDatePipe implements PipeTransform {

  constructor() {
    moment.locale("th");
  }

  transform(value: any, format?: string): string {
    let formattedDate = moment(value).add(7, 'hours').format(format ? format : 'lll');
    if (formattedDate == 'Invalid date') {
      return "-";
    }
    return formattedDate;
  }

}
