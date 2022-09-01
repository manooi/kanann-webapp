import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UploadMasterService {
  constructor(private http: HttpClient) { }

  uploadStudentMaster(params: any) {
    return this.http.post<any>('https://localhost:5000/UploadMaster/UploadStudentMaster', params);
  }

}