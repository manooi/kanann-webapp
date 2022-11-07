import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertService } from '../shared/service/utility/alert.service';

@Injectable()
export class Auth401and403Interceptor implements HttpInterceptor {

  constructor(private router: Router, private alertService: AlertService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(tap(() => { },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status == 401) {
            this.alertService.unauthorized('ออกไปนะ!', () => this.router.navigateByUrl('login'));
          }
          else if (err.status == 403) {
            this.alertService.forbidden('ออกไปนะ!', () => this.router.navigateByUrl('login'));
          }
          else {
            return;
          }
        }
      }));
  }
}