import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators'
import { CommonService } from './common.service';

@Injectable()
export class MaintenanceService extends CommonService {
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

}