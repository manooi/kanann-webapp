import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CreateTransactionRequest } from 'src/app/model/check';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CheckService {
  selectedProvince$: any;
  constructor(private http: HttpClient) { }

  getTransactionClass(param: any) {
    const queryParam = new HttpParams()
      .set('academicYearId', param.academicYearId)
      .set('subjectCode', param.subjectCode)
      .set('classRoomId', param.classRoomId);
    return this.http.get(environment.apiUrl + '/Check/Class', { params: queryParam });
  }

  createTransaction(param: CreateTransactionRequest) {
    return this.http.post(environment.apiUrl + '/Check/Class', param)
  }

  removeTransaction(transactionClassId: number) {
    return this.http.delete(environment.apiUrl + `/Check/Class/${transactionClassId}`);
  }


  getClass(transactionClassId: number) {
    const queryParam = new HttpParams()
      .set("transactionClassId", transactionClassId);
    return this.http.get<any>(environment.apiUrl + '/Check/Check', { params: queryParam }).pipe(
    );
  }

  saveAttendance(param: any) {
    return this.http.put(environment.apiUrl + '/Check/Check', param).pipe(delay(500));
  }

  getRfidMapping() {
    return this.http.get(environment.apiUrl + '/Check/RFIDMapping');
  }

  private createdSubject = new Subject();
  created$ = this.createdSubject.asObservable();
  onCreated() {
    this.createdSubject.next(true);
  }
}