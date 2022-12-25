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
    ;

  selectedTabIndex: number = 0;


  constructor() {

  }
  ngOnInit(): void {
    
  }

}
