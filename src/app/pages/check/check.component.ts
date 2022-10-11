import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { AppConstant } from 'src/app/config/app.constant';
import { CreateTransactionRequest } from 'src/app/model/check';
import { CheckService } from 'src/app/shared/service/api/check.service';
import { CommonService } from 'src/app/shared/service/api/common.service';
import { AlertService } from 'src/app/shared/service/utility/alert.service';
import cloneDeep from "lodash/cloneDeep";

export interface Student {
  studentId: number;
  firstName: string;
  lastName: string;
  lastFive?: any;
  today?: any;
}

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
export class CheckComponent implements OnInit {
  maintainForm!: FormGroup;
  maintainDropdown$: any = this.commonService.maintenanceDropdown$;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  data: any;

  constructor(
    private commonService: CommonService,
    private checkService: CheckService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.initializeForm();
    this.dtOptions = cloneDeep(AppConstant.dtOptionsWithOutSearch);
  }

  create() {
    const param: CreateTransactionRequest = {
      academicYearId: this.isAcademicYear.value,
      subjectCode: this.isSubject.value,
      classRoomId: this.isClassRoom.value,
      startDateTime: new Date()
    }
    this.checkService.createTransaction(param).subscribe(
      (data) => {
        this.alertService.success('สร้างคลาสเรียนสำเร็จ');
        this.search();
      },
      (err) => {
        this.alertService.error('error');
      },
    )
  }

  private initializeForm() {
    this.maintainForm = this.fb.group({
      academicYear: [null, Validators.required],
      subject: [null, Validators.required],
      classRoom: [null, Validators.required]
    });
  }

  ngOnInit(): void {

  }

  onAcademicYearChanges(academicYear: string) {
    this.maintainForm.patchValue({
      subject: null,
      classRoom: null
    });
    this.maintainForm.updateValueAndValidity();
    this.commonService.onAcademicYearChanges(academicYear);
  }

  onSubjectChanges(subject: string) {
    this.maintainForm.patchValue({
      classRoom: null
    });
    this.maintainForm.updateValueAndValidity();
    this.commonService.onSubjectChanges(subject);
  }

  get isAcademicYear() {
    return this.maintainForm.get('academicYear') as FormGroup;
  }

  get isSubject() {
    return this.maintainForm.get('subject') as FormGroup;
  }

  get isClassRoom() {
    return this.maintainForm.get('classRoom') as FormGroup;
  }

  debug() {
    console.log(this.maintainForm);
  }

  search() {
    this.data = [];
    console.log(this.maintainForm);
    const param = {
      academicYearId: this.isAcademicYear.value,
      subjectCode: this.isSubject.value,
      classRoomId: this.isClassRoom.value
    };
    this.checkService.getTransactionClass(param).subscribe(
      (data: any) => {
        if (data.result?.length == 0) {
          this.alertService.info('ไม่มีข้อมูล');
          return;
        }
        this.data = data.result;
        this.dtTrigger.next();
      },
      (err) => {
        console.log("err", err);
      },
      () => console.log("completed")
    );

  }
}
