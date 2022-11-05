import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { SavedStateService } from '../shared/service/savedstate.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  constructor(
    public savedStateService: SavedStateService,
    private oauthService: OAuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  
  }

}
