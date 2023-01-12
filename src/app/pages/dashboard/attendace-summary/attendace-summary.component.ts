import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { AppConstant } from 'src/app/config/app.constant';
import { DashboardService } from 'src/app/shared/service/api/dashboard.service';
import { CommonService } from 'src/app/shared/service/api/common.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-attendace-summary',
  templateUrl: './attendace-summary.component.html',
  styleUrls: ['./attendace-summary.component.scss']
})
export class AttendaceSummaryComponent implements OnInit, AfterViewInit, OnDestroy {

  dtOptions: DataTables.Settings | any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  form!: FormGroup;
  dropdown = this.commonService.academicYear$.pipe(
    tap((data) => {
      this.form.patchValue({
        academicYear: data[0].value
      });

      this.onAcademicYearChanges(data[0].value);
    })
  );

  data: any[] = [];
  moreThanEqualEighty: number = 0;

  constructor(
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private commonService: CommonService
  ) {
    this.dtOptions = AppConstant.dtOptions
    this.dtOptions = {
      ...this.dtOptions,
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      academicYear: [null, Validators.required]
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  onAcademicYearChanges(academicYearId: number) {
    this.commonService.onAcademicYearChanges(academicYearId);
    this.fetch({ academicYearId: academicYearId });
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  fetch(param: any) {
    this.spinner.show();
    this.dashboardService.getAttendaceReport(param).subscribe(
      {
        next: value => {
          this.spinner.hide();
          this.data = value;

          this.moreThanEqualEighty = value.reduce((prev: any, cur: any) => {
            let total = (cur.status1 + cur.status2 + cur.status3 + cur.status4);
            let percentage = ((cur.status1 + cur.status2 + cur.status3) / total) * 100;
            return prev + (percentage >= 80 ? 1 : 0);
          }, 0);

          this.rerender();
        },
        error: err => this.spinner.hide()
      }
    )
  }
}
