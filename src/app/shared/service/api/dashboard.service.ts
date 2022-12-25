import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient, private auth: AuthService) {
  }

  getLessThanEightyPercentAttendance() {
    return this.http.get<any[]>(environment.apiUrl + '/Dashboard/LessThanEightyPercentAttendance').pipe(map((i: any) => i.result));
  }

  getAttendaceReport(param:any) {
    const queryParam = new HttpParams().set('academicYearId', param.academicYearId);
    return this.http.get<any[]>(environment.apiUrl + '/Dashboard/AttendaceReport', { params: queryParam }).pipe(map((i: any) => i.result));
  }
}