import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators'
import { environment } from 'src/environments/environment';

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
        return this.http.get(environment.apiUrl + "/Student/LessThanEightyPercentAttendance", { params: queryParam }).pipe(
          map((i: any) => i.result)
        );
      })
    )
  }
}