import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { delay, filter, takeUntil, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  destroyed = new Subject<void>();
  @Input() sidenav!: MatSidenav;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) { }

  autoToggleSideNav() {
    const routerChanged$ = this.router.events.pipe(
      filter((v) => v instanceof NavigationEnd));

    const breakPointChanged$ = this.breakpointObserver.observe(['(max-width: 768px)']).pipe(
      delay(0),
      filter((v) => v.matches),
      takeUntil(this.destroyed)
    );

    routerChanged$.pipe(withLatestFrom(breakPointChanged$)).subscribe(
      ([router, breakPoint]) => {
        this.sidenav.close();
      },
      (err) => {
      },
    );
  }

  ngOnInit(): void {
    this.autoToggleSideNav();
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}