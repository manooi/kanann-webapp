import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators'
import { environment } from 'src/environments/environment';

export interface AssignmentScore {
  studentId: string,
  firstName: string,
  lastName: string,
  academicYearId: number,
  academicYearName: string,
  subjectCode: string,
  subjectName: string,
  assignmentName: string,
  score: number,
  totalScore: number
  credit: number
}

export interface AssignmentScoreSummary {
  studentId: string,
  firstName: string,
  lastName: string,
  academicYearId: number,
  academicYearName: string,
  subjectCode: string,
  subjectName: string,
  score: number,
  totalScore: number,
  credit: number
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private http: HttpClient, private auth: AuthService) {
  }

  getEmail() {
    return this.auth.user$.pipe(
      map((value) => value?.email ?? ""),
      shareReplay(1)
    )
  }

  getAttendace() {
    return this.getEmail().pipe(
      switchMap((email) => {
        const queryParam = new HttpParams().set('userName', email);
        return this.http.get(environment.apiUrl + "/Student/Attendance", { params: queryParam }).pipe(
          map((i: any) => i.result)
        );
      })
    )
  }

  getAssignmentScore(academicYearId: number): Observable<AssignmentScore[]> {
    return this.getEmail().pipe(
      switchMap((email) => {
        const queryParam = new HttpParams().set('userName', email).set('academicYearId', academicYearId);
        return this.http.get(environment.apiUrl + "/Student/AssignmentScore", { params: queryParam }).pipe(
          map((i: any) => i.result)
        );
      })
    )
  }

  getAssignmentScoreSummary(academicYearId: number): Observable<AssignmentScoreSummary[]> {
    return this.getEmail().pipe(
      switchMap((email) => {
        const queryParam = new HttpParams().set('userName', email).set('academicYearId', academicYearId);
        return this.http.get(environment.apiUrl + "/Student/AssignmentScoreSummary", { params: queryParam }).pipe(
          map((i: any) => i.result)
        );
      })
    )
  }

  getCumulativeGPA(): Observable<AssignmentScoreSummary[]> {
    return this.getEmail().pipe(
      switchMap((email) => {
        const queryParam = new HttpParams().set('userName', email);
        return this.http.get(environment.apiUrl + "/Student/AssignmentScoreSummary", { params: queryParam }).pipe(
          map((i: any) => i.result)
        );
      })
    )
  }
}