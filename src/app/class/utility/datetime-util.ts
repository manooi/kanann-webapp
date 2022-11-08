import * as moment from 'moment';

export class DateTimeUtil {
  static convertDateForSort(date: any) {
    return moment(date).format('YYYYMMDD');
  }

  static getNowDateTimeForDateTimePicker() {
    return moment().format('YYYY-MM-DDTHH:mm');
  }

  static convertDateTimeForDateTimePicker(date: Date) {
    return moment(date).add(7, 'hour').format('YYYY-MM-DDTHH:mm');
  }
}