import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { AssignmentService } from 'src/app/shared/service/api/assignment.service';
import { CommonService } from 'src/app/shared/service/api/common.service';
import { AlertService } from 'src/app/shared/service/utility/alert.service';

@Component({
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.scss']
})
export class CreateDialogComponent implements OnInit {
  createAssignmentForm!: FormGroup;
  classRoom$ = this.getClassRoom().pipe(
    tap((res)=> {
      if(res?.length == 0) {
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
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
    this.initializeForm();
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
      subjectCode: this.data.subject.subjectCode,
      academicYearId: this.data.academicYear.value
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

  create() {
    const param = {
      "academicYearId": this.data.academicYear.value,
      "subjectCode": this.data.subject.subjectCode,
      "assignmentName": this.isAssignmentName.value,
      "totalScore": this.isTotalScore.value,
      "assignedClassRooms": this.isClassRoom.value.map((i: any) => i.value)
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

}
