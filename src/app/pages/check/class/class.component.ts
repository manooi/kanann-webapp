import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { AppConstant } from 'src/app/config/app.constant';
import { CheckService } from 'src/app/shared/service/api/check.service';
import * as moment from "moment";
import { AlertService } from 'src/app/shared/service/utility/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RFIDSocketService } from 'src/app/shared/service/rfid-socket.service';
import { ThrowStmt } from '@angular/compiler';
import { tap } from 'rxjs/operators';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DateTimeUtil } from 'src/app/class/utility/datetime-util';

@Component({
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss'],
  providers: [RFIDSocketService]
})
export class ClassComponent implements OnInit, OnDestroy {

  isEdit: boolean = false;
  classDateTime!: Date;

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
      isRetro: [null],
      date: [null],
      status: this.fb.array([])
    });
    moment.locale("th");
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  form!: FormGroup;

  sub: Subscription = this.rFIDSocketService.getMessage().pipe(
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

        this.classDateTime = classes.result.classDate;

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
    this.alertService.rfidCheck('ok');
    // console.log(this.isStatus);
    // console.log(this.isStatus.value);
  }

  getNoOfStudents(status: number) {
    let count = 0;
    for (let i = 0; i < this.isStatus.controls.length; i++) {
      const formArray = this.isStatus.at(i) as FormArray;
      const formStatus = (formArray.getRawValue() as any).attendanceStatus;
      // const formStatus = this.isStatus.at(i).value.attendanceStatus;
      if (formStatus == status) {
        count += 1;
      }
    }
    return count;
  }

  isFormTouchedOrDirty() {
    return this.isStatus.dirty || this.isStatus.touched;
  }

  onRetroChecked(event: MatCheckboxChange) {
    this.form.patchValue({
      date: DateTimeUtil.convertDateTimeForDateTimePicker(this.classDateTime)
    });

  }

  onDateChanged(event: any) {
    if (event?.target?.value) {
      this.isStatus.enable();
      return;
    }
    this.isStatus.disable();
  }

  onStatusClick(index: number, value?: string) {
    // normal
    if (!this.isRetro.value) {
      this.eachFormGroup(index).patchValue({
        attendTime: value == '4' ? null : moment().utc()
      });
    }

    // retro check
    else {
      this.isStatus.enable();
      this.eachFormGroup(index).patchValue({
        attendTime: value == '4' ? null : moment(this.isDate.value).utc()
      });
    }
  }

  findIndexByRFID(rfid: string) {
    const studentId = this.rfidMapping.find((i) => i.rfid == rfid).studentId;
    const index = this.data.findIndex((i) => i.studentId == studentId);
    return index;
  }

  onRFIDTap(index: number, value: string) {
    if (!this.isEdit) {
      return;
    }

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
      window.location.reload();
    };

    this.checkService.saveAttendance(param).subscribe(
      (data) => {
        this.spinner.hide();
        this.alertService.success("บันทึกเวลาเรียนสำเร็จ", () => reload());
      },
      (err) => {
        this.spinner.hide();
        this.alertService.error("เกิดข้อผิดพลาด");
        console.log("err", err);
      },
    )

  }

  markAll() {
    const currentTime = this.isRetro.value ? moment(this.isDate.value).utc() : moment().utc();
    for (let index = 0; index < this.isStatus.length; index++) {
      this.eachFormGroup(index).patchValue({
        attendanceStatus: '1',
        attendTime: currentTime
      });
    }
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  }

  calculateEmoji(score: number) {
    if (score == 1) {
      return 0;
    }

    else if (score >= 0.8) {
      return 1;
    }

    else if (score >= 0.5) {
      return 2;
    }

    else {
      return 3;
    }
  }

  get isRetro() {
    return this.form.controls['isRetro'] as FormControl;
  }

  get isDate() {
    return this.form.controls['date'] as FormControl;
  }
}
