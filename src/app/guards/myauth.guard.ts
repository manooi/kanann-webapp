import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserService } from '../shared/service/api/user.service';
import { AuthCredentialService } from '../shared/service/auth-credential.service';
import { AlertService } from '../shared/service/utility/alert.service';

@Injectable({ providedIn: 'root' })
export class MyAuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private authCredentialService: AuthCredentialService,
    private router: Router,
    private alertService: AlertService,
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkIfUserIsAuthenticatedAndExistInDatabase(route);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkIfUserIsAuthenticatedAndExistInDatabase(route);
  }

  private checkIfUserIsAuthenticatedAndExistInDatabase(route: ActivatedRouteSnapshot) {
    return this.authService.isAuthenticated$.pipe(
      switchMap((result) => {
        if (result) {
          return this.authCredentialService.getPage().pipe(
            map((result) => {
              if (route.data.id == '0') {
                return true;
              }

              const routePageId: number[] = route.data.id.split(",").map((i: string) => +i);
              const availblePageId: number[] = result.map((i) => i.pageId);

              const isInAvailable = routePageId.reduce((prev, cur) => {
                if (availblePageId.includes(cur)) {
                  return prev && true;
                }
                return prev && false;
              }, true);

              if (isInAvailable) {
                return true;
              }
              this.alertService.forbidden('ออกไปเลย!', () => this.router.navigateByUrl('/'));
              return false;

            }),
            catchError((err) => of(false))
          );
        }
        else {
          this.router.navigateByUrl('/login');
          return of(false);
        }
      }),
    );
  }
}