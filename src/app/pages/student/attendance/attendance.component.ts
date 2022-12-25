import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { StudentService } from 'src/app/shared/service/api/student.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {

  dtOptions: DataTables.Settings | any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;

  constructor(
    private auth: AuthService,
    private studentService: StudentService,
    private spinner: NgxSpinnerService,
  ) {
    this.dtOptions = {
      dom: 'ti',
    }
  }

  data: any = [];

  ngOnInit(): void {
    this.spinner.show();
    this.studentService.getAttendace().subscribe(
      (data) => {
        this.data = data;
        this.spinner.hide();
        this.dtTrigger.next();
      },
      (err) => {
        this.spinner.hide();
        console.log("err", err);
      },
    )

  }

  get user() {
    return this.auth.user$;
  }

  calculatePercentage(data: any): number {
    return data.gainedClassWeight / data.totalClassWeight * 100;
  }

  calculateStatus(data: any): string {
    const percentage = this.calculatePercentage(data);
    if (percentage > 80) {
      return 'มีสิทธิ์สอบ';
    }
    return 'ไม่มีสิทธิ์สอบ';
  }
}
