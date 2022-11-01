import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { CommonService } from './common.service';

@Injectable()
export class AssignmentService extends CommonService {
  constructor(http: HttpClient) {
    super(http);
  }

  assignmentDropdown$ = combineLatest([
    this.academicYear$,
    this.selectedAcademicYear$,
    this.availableSubject$,
    this.selectedSubject$,
  ])
    .pipe(
      map((i: any) => {
        return {
          academics: i[0],
          subjects: i[2],
        }
      }),
    );

  getAssignment(param: any) {
    let queryParam = new HttpParams()
      .set('academicYearId', param.academicYearId)
      .set('subjectCode', param.subjectCode)

    if (param.assignmentId) {
      queryParam = queryParam.set('assignmentId', param.assignmentId);
    }

    return this.http.get(environment.apiUrl + '/Assignment/Assignment', { params: queryParam });
  }

  createAssignment(param: any) {
    return this.http.post(environment.apiUrl + '/Assignment/Assignment', param);
  }

  updateAssignment(assignmentId: number, param: any) {
    return this.http.put(`${environment.apiUrl}/Assignment/Assignment/${assignmentId}`, param);
  }

  deleteAssignment(assignmentId: number) {
    return this.http.delete(`${environment.apiUrl}/Assignment/Assignment/${assignmentId}`);
  }

  private createdSubject = new Subject();
  created$ = this.createdSubject.asObservable();
  onCreated() {
    this.createdSubject.next(true);
  }
}