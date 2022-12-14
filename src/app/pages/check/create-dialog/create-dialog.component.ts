import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateTimeUtil } from 'src/app/class/utility/datetime-util';
import { CreateTransactionRequest } from 'src/app/model/check';
import { CheckService } from 'src/app/shared/service/api/check.service';
import { CommonService } from 'src/app/shared/service/api/common.service';
import { AlertService } from 'src/app/shared/service/utility/alert.service';

@Component({
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.scss']
})
export class CreateDialogComponent implements OnInit {
  createAssignmentForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private alertService: AlertService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private checkService: CheckService,
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.createAssignmentForm = this.fb.group({
      classWeight: ["1", Validators.required],
      isRetro: [false, Validators.required],
      date: [DateTimeUtil.getNowDateTimeForDateTimePicker(), Validators.required],
    });
  }

  get isClassWeight() {
    return this.createAssignmentForm.controls['classWeight'] as FormControl;
  }

  get isFormValid() {
    return this.createAssignmentForm.valid;
  }

  get isRetro() {
    return this.createAssignmentForm.controls['isRetro'] as FormControl;
  }

  get isDate() {
    return this.createAssignmentForm.controls['date'] as FormControl;
  }

  create() {
    this.spinner.show();
    const param: CreateTransactionRequest = {
      academicYearId: this.data.formValue.academicYear,
      subjectCode: this.data.formValue.subject,
      classRoomId: this.data.formValue.classRoom,
      startDateTime: new Date(this.isDate.value),
      classWeight: this.isClassWeight.value,
    }
    this.checkService.createTransaction(param).subscribe(
      (data) => {
        this.spinner.hide();
        this.dialog.closeAll();
        this.alertService.success('????????????????????????????????????????????????????????????');
        this.checkService.onCreated();
      },
      (err) => {
        this.alertService.error('error');
        this.spinner.hide();
      },
    )
  }
}
