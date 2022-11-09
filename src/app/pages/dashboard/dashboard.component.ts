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

  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ]
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };





}
