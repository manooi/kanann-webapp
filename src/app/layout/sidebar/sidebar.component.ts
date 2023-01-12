import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Subject } from 'rxjs';
import { delay, filter, takeUntil, withLatestFrom } from 'rxjs/operators';
import { getSideBarItemById, SideBarItems } from 'src/app/config/sidebar-items';
import { AuthCredentialService } from 'src/app/shared/service/auth-credential.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  destroyed = new Subject<void>();
  @Input() sidenav!: MatSidenav;
  sidebarItems: SideBarItems[] = [];

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private authCredentialService: AuthCredentialService,
    public auth: AuthService,
  ) {
  }

  autoToggleSideNav() {
    const routerChanged$ = this.router.events.pipe(
      filter((v) => v instanceof NavigationEnd));

    const breakPointChanged$ = this.breakpointObserver.observe(['(max-width: 768px)']).pipe(
      delay(0),
      takeUntil(this.destroyed)
    );

    routerChanged$.pipe(withLatestFrom(breakPointChanged$)).subscribe(
      ([router, breakPoint]) => {
        if (breakPoint.matches) {
          this.sidenav.close();
        }
      },
      (err) => {
      },
    );
  }

  ngOnInit(): void {
    this.authCredentialService.getPage().subscribe((res) => {
      this.sidebarItems = getSideBarItemById(res.map((i) => i.pageId));
    });

    this.autoToggleSideNav();
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}