import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import cloneDeep from 'lodash.clonedeep';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AppConstant } from 'src/app/config/app.constant';
import { AssignmentService } from 'src/app/shared/service/api/assignment.service';
import { AlertService } from 'src/app/shared/service/utility/alert.service';
import { CreateDialogComponent, PageType } from './create-dialog/create-dialog.component';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss']
})
export class AssignmentComponent implements OnInit {

  assignmentForm!: FormGroup;
  assignmentDropdown$ = this.assignmentService.assignmentDropdown$;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  data: any;

  constructor(private assignmentService: AssignmentService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {

    this.initializeForm();
    this.dtOptions = cloneDeep(AppConstant.dtOptionsWithOutSearch);
    this.dtOptions = {
      ...this.dtOptions, autoWidth: false, columns: [
        { "width": "25%" },
        { "width": "10%" },
        { "width": "50%" },
        { "width": "15%" },
      ],
    };
  }

  private initializeForm() {
    this.assignmentForm = this.fb.group({
      academicYear: [null, Validators.required],
      subject: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    // const queryParam = this.route.snapshot.queryParams;
    // if (queryParam.academicYearId && queryParam.subjectCode) {
    //   this.assignmentForm.patchValue({
    //     academicYear: queryParam.academicYearId,
    //     subject: queryParam.subjectCode
    //   });
    //   this.search();
    // }
    this.assignmentService.created$.subscribe(() => {
      this.search();
    })
  }

  get isAcademicYear() {
    return this.assignmentForm.get('academicYear') as FormGroup;
  }

  get isSubject() {
    return this.assignmentForm.get('subject') as FormGroup;
  }

  onAcademicYearChanges(academicYear: any) {
    this.assignmentForm.patchValue({
      subject: null,
    });
    this.assignmentService.onAcademicYearChanges(academicYear.value);
  }

  onSubjectChanges(subject: any) {
    this.assignmentService.onSubjectChanges(subject.subjectCode);
  }

  create() {
    this.dialog.open(CreateDialogComponent, {
      data: { formValue: this.assignmentForm?.value, pageType: PageType.CREATE },
      width: "500px"
    });
  }

  search() {
    this.spinner.show();
    // this.router.navigate(['/assignment'], { queryParams: { academicYearId: this.isAcademicYear.value, subjectCode: this.isSubject.value } });
    this.data = [];
    const param = {
      academicYearId: this.isAcademicYear.value.value,
      subjectCode: this.isSubject.value.subjectCode,
    };
    this.assignmentService.getAssignment(param).pipe(delay(500)).subscribe(
      (data: any) => {
        this.spinner.hide();
        if (data.result?.length == 0) {
          this.alertService.info('ไม่มีข้อมูล');
          return;
        }
        this.data = data.result;
        this.dtTrigger.next();
      },
      (err) => {
        this.spinner.hide();
        console.log("err", err);
      },
      () => console.log("completed")
    );
  }

  edit(assignmentId: number) {
    const param = {
      academicYearId: this.isAcademicYear.value.value,
      subjectCode: this.isSubject.value.subjectCode,
      assignmentId: assignmentId 
    };

    this.dialog.open(CreateDialogComponent, {
      data: { formValue: this.assignmentForm?.value, pageType: PageType.EDIT, searchParam: param  },
      width: "500px"
    });
  }

  delete(assignmentId: number) {
    this.alertService.yesno('ยืนยันการลบ', () => {
      this.assignmentService.deleteAssignment(assignmentId).subscribe(
        (data: any) => {
          this.alertService.success('ลบสำเร็จ', () => this.search());
        },
        (err) => {
          this.alertService.error('เกิดข้อผิดพลาด');
        },
      );
    });
  }

}
