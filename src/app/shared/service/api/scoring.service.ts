import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { CommonService } from './common.service';

@Injectable()
export class ScoringService extends CommonService {
  constructor(http: HttpClient) {
    super(http);
  }

  maintenanceDropdown$ = combineLatest([
    this.academicYear$,
    this.selectedAcademicYear$,
    this.availableSubject$,
    this.selectedSubject$,
    this.availableClassRoom$
  ])
    .pipe(
      map((i: any) => {
        return {
          academics: i[0],
          subjects: i[2],
          classRooms: i[4]
        }
      }),
    );

  getScoring(param: any) {
    const queryParam = new HttpParams()
    .set('academicYearId', param.academicYearId)
    .set('subjectCode', param.subjectCode)
    .set('classRoomId', param.classRoomId);
    return this.http.get<any[]>(environment.apiUrl + '/Assignment/Scoring', { params: queryParam }).pipe(map((i: any) => i.result));
  }

  updateScore(param:any) {
    return this.http.put(environment.apiUrl + '/Assignment/Scoring', param);
  }

}