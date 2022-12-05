import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { delay } from 'rxjs/operators';
import { ScoringService } from 'src/app/shared/service/api/scoring.service';
import { AlertService } from 'src/app/shared/service/utility/alert.service';
import { XlsxService } from 'src/app/shared/service/utility/xlsx.service';


@Component({
  templateUrl: './edit-score.component.html',
  styleUrls: ['./edit-score.component.scss']
})
export class EditScoreComponent implements OnInit {
  data: any;
  editscoreForm!: FormGroup;
  totalScore: number = 0;

  constructor(
    private route: ActivatedRoute,
    private scoringService: ScoringService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private xlsxService: XlsxService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.initializeForm();
    const qp = this.route.snapshot.queryParams;
    this.scoringService.getScoring(qp).pipe(delay(500)).subscribe(
      (data) => {
        this.spinner.hide();
        this.data = data;

        if (this.data.assignmentHeaders.length == 0) {
          this.alertService.info("ไม่มีข้อมูล", () => window.close());
          return;
        }

        this.data.assignmentHeaders.forEach((assignment: any, index: number) => {
          // add assignment
          this.addAssignment({ assignmentMappingId: assignment.assignmentMappingId, assignmentName: assignment.assignmentName });
          this.totalScore += assignment.totalScore;

          assignment.scores.forEach((score: any) => {
            const param = {
              assignmentMappingId: score.assignmentMappingId,
              score: score.score,
              studentId: score.studentId,
              totalScore: assignment.totalScore
            };
            // add score
            this.addScore(index, param);
          });
        });

      },
      (err) => {
        this.spinner.hide();
        console.log("err", err);
      },
    )
  }

  initializeForm() {
    this.editscoreForm = this.fb.group({
      assignment: this.fb.array([])
    })
  }

  get isAssignment(): FormArray {
    return this.editscoreForm.controls['assignment'] as FormArray;
  }

  getAssignmentAtIndex(assignmentIndex: number): FormGroup {
    return this.isAssignment.at(assignmentIndex) as FormGroup;
  }

  addAssignment(param: any) {
    const form = this.fb.group({
      assignmentMappingId: [param.assignmentMappingId],
      assignmentName: [param.assignmentName],
      score: this.fb.array([]),
      checkBox: [false]
    })
    this.isAssignment.push(form);
  }

  addScore(index: number, param: any) {
    const form = this.fb.group({
      assignmentMappingId: [param.assignmentMappingId, { updateOn: 'blur' }],
      score: [{ value: param.score, disabled: true }, { validators: [Validators.min(0), Validators.max(param.totalScore)], updateOn: 'change' }],
      studentId: [param.studentId, { updateOn: 'blur' }]
    });
    this.getAssignmentScoreArray(index).push(form);
  }

  getAssignmentScoreArray(index: number): FormArray {
    return this.isAssignment.at(index).get('score') as FormArray
  }

  getAssignmentFormControl(assignmentIndex: number, scoreIndex: number): FormControl {
    const fa = this.isAssignment.at(assignmentIndex).get('score') as FormArray;
    return fa.at(scoreIndex) as FormControl
  }

  isReadOnly(assignmentIndex: number) {
    const isChecked = this.getAssignmentAtIndex(assignmentIndex).value.checkBox;
    return isChecked ? false : true;
  }

  getTabIndex(assignmentIndex: number) {
    if (this.isReadOnly(assignmentIndex)) {
      return -1;
    }
    return null;
  }

  isFormReady() {
    return this.editscoreForm.valid && (this.editscoreForm.dirty);
  }

  onCheckboxChecked(assignmentIndex: number) {
    const isChecked = this.getAssignmentAtIndex(assignmentIndex).value.checkBox;
    if (!isChecked) {
      this.getAssignmentScoreArray(assignmentIndex).disable();
    }
    else {
      this.getAssignmentScoreArray(assignmentIndex).enable();
    }
  }

  getEachStudentTotalScore(studentId: string) {
    const score = this.editscoreForm.getRawValue().assignment.flatMap((i: any) => i.score).filter((i: any) => i.studentId == studentId);
    return score.reduce((prev: any, cur: any) => {
      return prev + cur.score;
    }, 0);
  }

  export() {
    const htmlElement = document.getElementById('score-table');
    this.xlsxService.tableToExcel(htmlElement, `${this.data.subjectCode}_exported`, this.data.subjectCode);
  }

  save() {
    this.spinner.show();
    const score = { scores: this.editscoreForm.getRawValue().assignment.flatMap((i: any) => i.score) };
    this.scoringService.updateScore(score).pipe(delay(500)).subscribe(
      (data) => {
        this.spinner.hide();
        this.alertService.success("บันทึกคะแนนสำเร็จ", () => window.location.reload());
        this.editscoreForm.markAsUntouched();
        this.editscoreForm.markAsPristine();
      },
      (err) => {
        this.spinner.hide();
        this.alertService.error("เกิดข้อผิดพลาด");
        console.log("err", err);
      },
    )
  }

  debug() {
    console.log(this.editscoreForm);
    // this.getAssignmentAtIndex(0).get('score')?.disable();
  }
}
