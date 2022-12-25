import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { tap } from 'rxjs/operators';
import { CommonService } from 'src/app/shared/service/api/common.service';
import { AssignmentScore, StudentService } from 'src/app/shared/service/api/student.service';

interface ScoreData {
  subjectCode: string,
  subjectName: string,
  totalScore: number,
  data: any[]
}

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {

  scoreForm!: FormGroup;
  data: ScoreData[] = [];
  dropdown = this.commonService.academicYear$.pipe(
    tap((data) => {
      if (data.length > 0) {
        this.scoreForm.patchValue({
          academicYear: data[0].value
        });
        this.onAcademicYearChanges(data[0].value);
      }
      this.spinner.hide();
    })
  );

  constructor(
    private auth: AuthService,
    private studentService: StudentService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private commonService: CommonService
  ) {

  }

  ngOnInit(): void {
    this.spinner.show();
    this.initializeForm();
  }

  initializeForm() {
    this.scoreForm = this.fb.group({
      academicYear: [null, Validators.required]
    });
  }

  getScore(academicYearId: number): void {
    this.studentService.getAssignmentScore(academicYearId).subscribe(
      (data) => {
        this.groupDataBySubjectCode(data);
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
        console.log("err", err);
      },
    )
  }

  groupDataBySubjectCode(data: AssignmentScore[]) {
    this.data = [];

    const grouppedDataBySubject = data.reduce((prev: any, cur: AssignmentScore) => {
      const currentSubjectCode = cur.subjectCode;
      if (!prev[currentSubjectCode]) {
        prev[currentSubjectCode] = [cur];
      }
      else {
        prev[currentSubjectCode].push(cur);
      }
      return prev;
    }, {});

    const subjects = Object.keys(grouppedDataBySubject);
    subjects.forEach((subject) => {
      this.data.push({
        subjectCode: grouppedDataBySubject[subject][0].subjectCode,
        subjectName: grouppedDataBySubject[subject][0].subjectName,
        data: grouppedDataBySubject[subject],
        totalScore: 50
      })
    });

  }

  onAcademicYearChanges(academicYearId: number) {
    this.commonService.onAcademicYearChanges(academicYearId);
    this.getScore(academicYearId);
  }

  get user() {
    return this.auth.user$;
  }

}
