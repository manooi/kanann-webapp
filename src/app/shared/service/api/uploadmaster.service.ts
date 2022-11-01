import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetDatabaseRequest } from 'src/app/model/database';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UploadMasterService {
  constructor(private http: HttpClient) { }

  uploadStudentMaster(params: any) {
    return this.http.post<any>(environment.apiUrl + '/UploadMaster/UploadStudentMaster', params);
  }

  uploadAcademicYearMaster(params: any) {
    return this.http.post<any>(environment.apiUrl + '/UploadMaster/UploadStudentMaster', params);
  }

  getDatabase(params: GetDatabaseRequest) {
    const masterIdParam = new HttpParams().set('masterId', params.database);
    return forkJoin({
      database: this.http.post<any>(environment.apiUrl + '/Common/GetDatabase', params).pipe(map((i) => i.result)),
      mapping: this.http.get<any>(environment.apiUrl + '/Common/MasterMapping', { params: masterIdParam }).pipe(map((i)=>i.result))
    });
  }
}