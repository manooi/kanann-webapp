import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { EMPTY, of } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { AssignmentService } from 'src/app/shared/service/api/assignment.service';
import { CommonService } from 'src/app/shared/service/api/common.service';
import { AlertService } from 'src/app/shared/service/utility/alert.service';

export enum PageType {
  CREATE,
  EDIT
}

@Component({
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.scss']
})
export class CreateDialogComponent implements OnInit, OnDestroy {
  pageType!: PageType;

  createAssignmentForm!: FormGroup;
  classRoom$ = this.getClassRoom().pipe(
    tap((res) => {
      this.spinner.hide();
      if (res?.length == 0) {
        this.alertService.error('ไม่สามารถสร้างใบงานได้ เนื่องจากไม่พบห้องเรียน');
      }
    })
  );

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private assignmentService: AssignmentService,
    private alertService: AlertService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.pageType = data.pageType;
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.spinner.show();
    this.initializeForm();
    if (this.pageType == PageType.EDIT) {
      // fetch data after classroom is ready
      const assignment$ = this.classRoom$.pipe(
        switchMap((i: any) => {
          this.spinner.show();
          return this.assignmentService.getAssignment(this.data.searchParam);
        })
      );

      assignment$.subscribe(
        (data: any) => {
          this.spinner.hide();
          this.createAssignmentForm.patchValue({
            assignmentName: data.result[0].assignmentName,
            totalScore: data.result[0].totalScore,
            assignedClassRooms: data.result[0].assignedClassRooms.map((i: any) => i.classRoomId)
          });
          this.isClassRoom.disable();
        },
        (err) => {
          this.spinner.hide();
          console.log("err", err);
        },
      )
    }
  }

  private initializeForm() {
    this.createAssignmentForm = this.fb.group({
      assignmentName: [null, Validators.required],
      totalScore: [null, Validators.required],
      assignedClassRooms: [null, Validators.required],
    });
  }

  private getClassRoom() {
    const param = {
      subjectCode: this.data.formValue.subject.subjectCode,
      academicYearId: this.data.formValue.academicYear.value
    };
    return this.commonService.getClassRoom(param.subjectCode, param.academicYearId);
  }

  get isAssignmentName() {
    return this.createAssignmentForm.controls['assignmentName'] as FormControl;
  }

  get isTotalScore() {
    return this.createAssignmentForm.controls['totalScore'] as FormControl;
  }

  get isClassRoom() {
    return this.createAssignmentForm.controls['assignedClassRooms'] as FormControl;
  }

  get isFormValid() {
    return this.createAssignmentForm.valid && (this.createAssignmentForm.dirty);
  }

  create() {
    const param = {
      "academicYearId": this.data.formValue.academicYear.value,
      "subjectCode": this.data.formValue.subject.subjectCode,
      "assignmentName": this.isAssignmentName.value,
      "totalScore": this.isTotalScore.value,
      "assignedClassRooms": this.isClassRoom.value
    };
    this.assignmentService.createAssignment(param).subscribe(
      (data) => {
        this.alertService.success('สร้างใบงานสำเร็จ', () => {
          this.dialog.closeAll();
          this.assignmentService.onCreated();
        })
      },
      (err) => {
        this.alertService.error('เกิดข้อผิดพลาด')
      },
    )
  }

  edit() {
    const param = {
      "assignmentName": this.isAssignmentName.value,
      "totalScore": this.isTotalScore.value,
      "assignedClassRooms": this.isClassRoom.value
    };
    this.assignmentService.updateAssignment(this.data.searchParam.assignmentId, param).subscribe(
      (data) => {
        this.alertService.success('บันทึกใบงานสำเร็จ', () => {
          this.dialog.closeAll();
          this.assignmentService.onCreated();
        })
      },
      (err) => {
        this.alertService.error('เกิดข้อผิดพลาด')
      },
    )
  }

  debug() {
    console.log(this.createAssignmentForm.value);
  }

}
