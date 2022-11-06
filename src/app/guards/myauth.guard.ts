import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserService } from '../shared/service/api/user.service';
import { AuthCredentialService } from '../shared/service/auth-credential.service';

@Injectable({ providedIn: 'root' })
export class MyAuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private authCredentialService: AuthCredentialService, private router: Router, private userService: UserService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkIfUserIsAuthenticatedAndExistInDatabase();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkIfUserIsAuthenticatedAndExistInDatabase();
  }

  private checkIfUserIsAuthenticatedAndExistInDatabase() {
    return this.authService.isAuthenticated$.pipe(
      switchMap((result) => {
        if (result) {
          return this.authCredentialService.getPage().pipe(
            map((result) => true),
            catchError((err) => of(false))
          );
        }
        else {
          return of(false);
        }
      }),
    );
  }
}