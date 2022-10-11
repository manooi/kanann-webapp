import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, iif, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators'
import { Dropdown } from 'src/app/model/dropdown';

@Injectable({ providedIn: 'root' })
export class CommonService {
  selectedProvince$: any;
  constructor(private http: HttpClient) { }

  academicYear$ = this.http.get<any[]>('https://localhost:5000/Common/AcademicYear').pipe(map((i: any) => i.result));
  masterType$ = this.http.get<Dropdown[]>('https://localhost:5000/Common/MasterName').pipe(map((i: any) => i.result));

  private academicYearSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  selectedAcademicYear$ = this.academicYearSubject.asObservable();

  private subjectSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  selectedSubject$ = this.subjectSubject.asObservable();

  availableSubject$ = this.selectedAcademicYear$.pipe(
    switchMap((academicYearId: string) => {
      return iif(() => academicYearId === null, of([]), this.getSubjectByAcademicYear({
        academicYearId: academicYearId
      }))
    })
  );

  availableClassRoom$ = this.selectedSubject$.pipe(
    switchMap((subject: string) => {
      return iif(() => subject === null, of([]), this.getClassRoomBySubjectAndAcademicYear(subject))
    }),
  );

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

  getSubjectByAcademicYear(params: any) {
    return this.http.post<any[]>('https://localhost:5000/Common/GetSubjectByAcademicYear', params).pipe(map((i: any) => i.result));
  }

  getClassRoomBySubjectAndAcademicYear(subjectCode: string) {
    return this.selectedAcademicYear$.pipe(
      switchMap((academicYearId) => {
        const queryParam = new HttpParams().set('academicYearId', academicYearId).set('subjectCode', subjectCode);
        return this.http.get<any[]>('https://localhost:5000/Common/ClassRoom', { params: queryParam }).pipe(map((i: any) => i.result));
      }),
      catchError(() => of([]))
    )
  }

  onAcademicYearChanges(academicYear: string) {
    this.academicYearSubject.next(academicYear);
  }

  onSubjectChanges(subject: string) {
    this.subjectSubject.next(subject);
  }

  getStudents() {
    return this.http.post<any>('https://localhost:5000/Common/GetStudents', {});
  }


}