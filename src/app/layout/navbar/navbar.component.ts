import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { SavedStateService } from 'src/app/shared/service/savedstate.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  constructor(
    public savedStateService: SavedStateService,
    private oauthService: OAuthService,
    private router: Router
    ) { }
  
  ngOnInit(): void {
  }

  logout() {
    this.oauthService.logOut();
    this.router.navigateByUrl('/login');
  }

  get givenName() {
    const claims: any = this.oauthService.getIdentityClaims();
    if (!claims) {
      return null;
    }
    return claims.name;
  }

}
