import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';
import { CreateTransactionRequest } from 'src/app/model/check';

@Injectable({ providedIn: 'root' })
export class CheckService {
  selectedProvince$: any;
  constructor(private http: HttpClient) { }

  getTransactionClass(param: any) {
    const queryParam = new HttpParams()
      .set('academicYearId', param.academicYearId)
      .set('subjectCode', param.subjectCode)
      .set('classRoomId', param.classRoomId);
    return this.http.get('https://localhost:5000/Check/Class', { params: queryParam });
  }

  createTransaction(param: CreateTransactionRequest) {
    return this.http.post('https://localhost:5000/Check/Class', param)
  }

  getClass(transactionClassId: number) {
    const queryParam = new HttpParams()
      .set("transactionClassId", transactionClassId);
    return this.http.get<any>('https://localhost:5000/Check/Check', { params: queryParam }).pipe(
    );
  }

  saveAttendance(param: any) {
    return this.http.put('https://localhost:5000/Check/Check', param).pipe(delay(500));
  }

  getRfidMapping() {
    return this.http.get('https://localhost:5000/Check/RFIDMapping');
  }
}