import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private auth: AuthService) {
  }

  getUser() {
    return this.auth.user$.pipe(
      switchMap((user) => {
        const userName = user?.email ?? "";
        const queryParam = new HttpParams().set('userName', userName);
        return this.http.get<any[]>(environment.apiUrl + '/User/GetUser', { params: queryParam }).pipe(map((i: any) => i.result));
      }),
    );
  }
}