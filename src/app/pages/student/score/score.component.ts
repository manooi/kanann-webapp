import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { tap } from 'rxjs/operators';
import { CommonService } from 'src/app/shared/service/api/common.service';
import { AssignmentScore, AssignmentScoreSummary, StudentService } from 'src/app/shared/service/api/student.service';

interface ScoreData {
  subjectCode: string,
  subjectName: string,
  score: number,
  totalScore: number,
  data: any[]
}

interface GPA {
  creditRegister: number,
  creditAcc: number,
  gp: number,
  gpa: number
}

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {

  scoreForm!: FormGroup;
  data: ScoreData[] = [];
  gpaData: AssignmentScoreSummary[] = [];
  currentTermGPA: GPA = {
    creditRegister: 0,
    creditAcc: 0,
    gp: 0,
    gpa: 0
  };

  cumulativeGPA: GPA = {
    creditRegister: 0,
    creditAcc: 0,
    gp: 0,
    gpa: 0
  };

  dropdown = this.commonService.academicYear$.pipe(
    tap((data) => {
      if (data.length > 0) {
        this.scoreForm.patchValue({
          academicYear: data[0].value
        });
        this.onAcademicYearChanges(data[0].value);
      }
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

  getSummaryScore(academicYearId: number): void {
    this.studentService.getAssignmentScoreSummary(academicYearId).subscribe(
      (data) => {
        this.gpaData = data;
        this.currentTermGPA = this.calculateGPA(data);
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
        console.log("err", err);
      },
    )
  }

  getCumulativeGPA(): void {
    this.studentService.getCumulativeGPA().subscribe(
      (data) => {
        this.cumulativeGPA = this.calculateGPA(data);
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

    const getSumScore = (data: any[], key: string) => {
      return data.reduce((prev, cur) => {
        return prev + cur[key]
      }, 0) as number
    };

    const subjects = Object.keys(grouppedDataBySubject);
    subjects.forEach((subject) => {
      this.data.push({
        subjectCode: grouppedDataBySubject[subject][0].subjectCode,
        subjectName: grouppedDataBySubject[subject][0].subjectName,
        data: grouppedDataBySubject[subject],
        score: getSumScore(grouppedDataBySubject[subject], 'score'),
        totalScore: getSumScore(grouppedDataBySubject[subject], 'totalScore'),
      })
    });
  }

  onAcademicYearChanges(academicYearId: number) {
    this.commonService.onAcademicYearChanges(academicYearId);
    this.getScore(academicYearId);
    this.getSummaryScore(academicYearId);
    this.getCumulativeGPA();
  }

  get user() {
    return this.auth.user$;
  }

  calculateGrade(dt: AssignmentScoreSummary): number {
    const score = dt.score;
    const totalScore = dt.totalScore;
    const percentage = (score / totalScore) * 100;

    if (percentage >= 80) {
      return 4;
    }
    else if (percentage >= 75) {
      return 3.5;
    }
    else if (percentage >= 70) {
      return 3;
    }
    else if (percentage >= 65) {
      return 2.5;
    }
    else if (percentage >= 60) {
      return 2;
    }
    else if (percentage >= 55) {
      return 1.5;
    }
    else if (percentage >= 50) {
      return 1;
    }
    else {
      return 0;
    }
  }

  isExpectedGrade(dt: AssignmentScoreSummary) {
    if (dt.totalScore < 100) {
      return true;
    }
    return false;
  }

  calculateGPA(data: AssignmentScoreSummary[]): GPA {
    let creditRegister = 0;
    let creditAcc = 0;
    let gp = 0;
    let gpa = 0;

    data.forEach((dt) => {
      creditRegister += dt.credit;
      creditAcc += dt.credit;
      gp += dt.credit * this.calculateGrade(dt);
    })

    gpa = gp / creditAcc;

    return {
      creditRegister,
      creditAcc,
      gp,
      gpa
    }
  }

}
