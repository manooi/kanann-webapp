import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SavedStateService } from '../shared/service/savedstate.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewInit {
  destroyed = new Subject<void>();
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public savedStateService: SavedStateService,) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.breakpointObserver.observe(['(max-width: 768px)']).pipe(
      delay(0),
      takeUntil(this.destroyed)
    ).subscribe(
      (res) => {
        if (res.matches) {
          this.sidenav.mode = 'push';
          this.sidenav.close();
        }
        else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      }
    )
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }


}
