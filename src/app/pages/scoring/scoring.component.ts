import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CheckService } from 'src/app/shared/service/api/check.service';
import { MaintenanceService } from 'src/app/shared/service/api/maintenance.service';
import { ScoringService } from 'src/app/shared/service/api/scoring.service';
import { AlertService } from 'src/app/shared/service/utility/alert.service';

@Component({
  selector: 'app-scoring',
  templateUrl: './scoring.component.html',
  styleUrls: ['./scoring.component.scss']
})
export class ScoringComponent implements OnInit {

  maintainForm!: FormGroup;
  maintainDropdown$: any = this.maintenanceService.maintenanceDropdown$;
  constructor(
    private maintenanceService: ScoringService,
    private checkService: CheckService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.maintainForm = this.fb.group({
      academicYear: [null, Validators.required],
      subject: [null, Validators.required],
      classRoom: [null, Validators.required]
    });
  }


  onSubjectChanges(subject: string) {
    this.maintainForm.patchValue({
      classRoom: null
    });
    this.maintainForm.updateValueAndValidity();
    this.maintenanceService.onSubjectChanges(subject);
  }

  onAcademicYearChanges(academicYear: string) {
    this.maintainForm.patchValue({
      subject: null,
      classRoom: null
    });
    this.maintainForm.updateValueAndValidity();
    this.maintenanceService.onAcademicYearChanges(academicYear);
  }

  search() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(
        ['/scoring/edit'],
        {
          queryParams: {
            academicYearId: this.maintainForm.value.academicYear,
            subjectCode: this.maintainForm.value.subject,
            classRoomId: this.maintainForm.value.classRoom
          }
        })
    );

    window.open(url, '_blank');

    // this.router.navigate(
    //   ['/scoring/edit'],
    //   {
    //     queryParams: {
    //       academicYearId: this.maintainForm.value.academicYear,
    //       subjectCode: this.maintainForm.value.subject,
    //       classRoomId: this.maintainForm.value.classRoom
    //     }
    //   }
    // );
  }

}
