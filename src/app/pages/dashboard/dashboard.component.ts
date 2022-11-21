import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ChartConfiguration } from 'chart.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { AppConstant } from 'src/app/config/app.constant';
import { DashboardService } from 'src/app/shared/service/api/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  selectedTabIndex: number = 0;
  dtOptions: DataTables.Settings | any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;

  data: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService,
  ) {
    this.dtOptions = AppConstant.dtOptions
    this.dtOptions = {
      ...this.dtOptions,
    }
  }

  ngOnInit(): void {
    this.spinner.show();
    this.dashboardService.getLessThanEightyPercentAttendance().subscribe(
      {
        next: value => {
          this.spinner.hide();
          this.data = value;
          this.dtTrigger.next();
        },
        error: err => this.spinner.hide()
      }
    )
  }
}
