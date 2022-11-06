import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { SavedStateService } from 'src/app/shared/service/savedstate.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    public savedStateService: SavedStateService,
    public auth: AuthService,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    console.log('destroyed');
  }

  ngOnInit(): void {
    console.log("home init")
  }
}
