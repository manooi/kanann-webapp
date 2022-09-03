import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetDatabaseRequest } from 'src/app/model/database';

@Injectable({ providedIn: 'root' })
export class UploadMasterService {
  constructor(private http: HttpClient) { }

  uploadStudentMaster(params: any) {
    return this.http.post<any>('https://localhost:5000/UploadMaster/UploadStudentMaster', params);
  }

  uploadAcademicYearMaster(params: any) {
    return this.http.post<any>('https://localhost:5000/UploadMaster/UploadStudentMaster', params);
  }

  getDatabase(params: GetDatabaseRequest) {
    return this.http.post<any>('https://localhost:5000/Common/GetDatabase', params);
  }
}