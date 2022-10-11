import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, Subject } from 'rxjs';
import { AppConstant } from 'src/app/config/app.constant';
import { CheckService } from 'src/app/shared/service/api/check.service';
import * as moment from "moment";
import { AlertService } from 'src/app/shared/service/utility/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RFIDSocketService } from 'src/app/shared/service/rfid-socket.service';
import { ThrowStmt } from '@angular/compiler';
import { tap } from 'rxjs/operators';

@Component({
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss'],
  providers: [RFIDSocketService]
})
export class ClassComponent implements OnInit {

  isEdit: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private checkService: CheckService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private rFIDSocketService: RFIDSocketService
  ) {
    this.isEdit = route.snapshot.data.isEdit;
    this.dtOptions = Object.assign({}, AppConstant.dtOptions);
    this.dtOptions.pageLength = 50;
    this.dtOptions.dom = "tlip";
    this.form = this.fb.group({
      status: this.fb.array([])
    });
    moment.locale("th");
  }

  form!: FormGroup;

  rfid$ = this.rFIDSocketService.getMessage().pipe(
    tap((res: any) => {
      console.log('rfid', res);
      const idx = this.findIndexByRFID(res.msg);
      this.onRFIDTap(idx, '1');
    })
  ).subscribe();

  availableReader$ = this.rFIDSocketService.getAvailableReader();

  rfidMapping: any[] = [];

  get isStatus(): FormArray {
    return this.form.get('status') as FormArray;
  }

  getRRIDMapping() {
    return this.checkService.getRfidMapping();
  }

  getClass() {
    const transactionClassId = this.route.snapshot?.params?.id;
    return this.checkService.getClass(transactionClassId);
  }

  eachFormGroup(index: number) {
    return this.isStatus.controls[index] as FormGroup;
  }

  eachCheckControl(index: number) {
    return this.eachFormGroup(index).get('attendanceStatus') as FormControl;
  }

  addStatus(obj: any) {
    const formGroup = this.fb.group({
      studentId: [obj.studentId],
      attendanceStatus: [{ value: String(obj.attendanceStatusId), disabled: !this.isEdit }, Validators.required],
      attendTime: [obj.attendTime]
    });
    this.isStatus.push(formGroup);
  }

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  data: any[] = [];
  header: any = {};

  ngOnInit(): void {
    this.spinner.show();
    forkJoin({
      rfidMapping: this.getRRIDMapping(),
      classes: this.getClass()
    }).subscribe(
      (res: any) => {
        this.spinner.hide();
        const classes = res.classes;
        const rfidMapping = res.rfidMapping;

        this.rfidMapping = rfidMapping.result;
        this.data = classes.result.transactionAttendance;
        this.header["subjectName"] = classes.result.subjectName;
        this.header["subjectCode"] = classes.result.subjectCode;
        this.header["classRoomName"] = classes.result.classRoomName;
        this.header["classDate"] = classes.result.classDate;

        classes.result.transactionAttendance.forEach((i: any) => {
          this.addStatus(i);
        });

        this.dtTrigger.next();
      },
      (err) => {
        this.spinner.hide();
      },
    )
  }

  debug() {
    console.log(this.isStatus);
    console.log(this.isStatus.value);
  }

  getNoOfStudents(status: number) {
    let count = 0;
    for (let i = 0; i < this.isStatus.controls.length; i++) {
      const formStatus = this.isStatus.at(i).value.attendanceStatus;
      if (formStatus == status) {
        count += 1;
      }
    }
    return count;
  }

  isFormTouchedOrDirty() {
    return this.form.dirty || this.form.touched;
  }

  onStatusClick(index: number, value?: string) {
    this.eachFormGroup(index).patchValue({
      attendTime: value == '4' ? null : moment().utc()
    });
  }

  findIndexByRFID(rfid: string) {
    const studentId = this.rfidMapping.find((i) => i.rfid == rfid).studentId;
    const index = this.data.findIndex((i) => i.studentId == studentId);
    return index;
  }

  onRFIDTap(index: number, value: string) {
    this.eachFormGroup(index).patchValue({
      attendTime: moment().utc(),
      attendanceStatus: value
    });

    this.eachFormGroup(index).markAsDirty();
    this.eachFormGroup(index).markAsTouched();
  }

  save() {
    this.spinner.show();
    const transactionClassId = this.route.snapshot?.params?.id;
    const studentAttendances = this.form.value.status.map((i: any) => {
      return {
        studentId: i.studentId,
        attendTime: i.attendTime,
        attendanceStatusId: i.attendanceStatus,
      }
    });

    const param = {
      transactionClassId: transactionClassId,
      studentAttendances: studentAttendances
    };

    const reload = () => {
      this.spinner.show();
      setTimeout(() => {
        window.location.reload();
      }, (1000));
    };

    this.checkService.saveAttendance(param).subscribe(
      (data) => {
        this.spinner.hide();
        this.alertService.success("บันทึกเวลาเรียนสำเร็จ");
        this.form.markAsUntouched();
        this.form.markAsPristine();
        console.log("sub", data);
      },
      (err) => {
        this.spinner.hide();
        this.alertService.error("เกิดข้อผิดพลาด");
        console.log("err", err);
      },
    )

  }



}
