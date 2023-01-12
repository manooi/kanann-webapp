import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() sidenav!: MatSidenav;

  constructor(
    public auth: AuthService,
  ) { }

  ngOnInit(): void {
  }

  logout() {
    this.auth.logout({ returnTo: environment.auth.logoutRedirectUri });
  }
}
