import * as moment from 'moment';

export class DateTimeUtil {


  static convertDateForSort(date: any) {
    return moment(date).format('YYYYMMDD');
  }
}