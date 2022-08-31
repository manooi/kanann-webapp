import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, EMPTY, forkJoin, iif, of, Subject } from 'rxjs';
import { filter, map, skipWhile, switchMap } from 'rxjs/operators'

@Injectable({ providedIn: 'root' })
export class CommonService {
  constructor(private http: HttpClient) { }

  academicYear$ = this.http.post<any[]>('https://localhost:5000/Common/GetAcademicYear', {});

  getSubjectByAcademicYear(params: any) {
    return this.http.post<any[]>('https://localhost:5000/Common/GetSubjectByAcademicYear', params);
  }

  maintenanceDropdownv$ = forkJoin({
    academic: this.academicYear$
    // subjects: this.getSubjectByAcademicYear({ academicYear: '1/2565' })
  });

  private academicYearSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  selectedAcademicYear$ = this.academicYearSubject.asObservable();

  availableSubject$ = this.selectedAcademicYear$.pipe(
    switchMap((academicYear: string) => {
      return iif(() => academicYear === null, of([]), this.getSubjectByAcademicYear({
        academicYear: academicYear
      }))
    })
  );

  maintenanceDropdown$ = combineLatest([
    this.academicYear$,
    this.selectedAcademicYear$,
    this.availableSubject$
  ])
  .pipe(
    map((i: any) => {
      return {
        academics: i[0],
        subjects: i[2]
      }
    })
  );

  onAcademicYearChanged(academicYear: string) {
    this.academicYearSubject.next(academicYear);
  }
}