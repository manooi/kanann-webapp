import * as moment from 'moment';

export class DateTimeUtil {


  static convertDateForSort(date: any) {
    return moment(date).format('YYYYMMDD');
  }

  static getNowDateTimeForDateTimePicker() {
    return moment().format('YYYY-MM-DDThh:mm');
  }
}