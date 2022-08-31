import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/shared/service/api/common.service';

@Component({
  selector: 'app-user-and-role',
  templateUrl: './user-and-role.component.html',
  styleUrls: ['./user-and-role.component.scss']
})
export class UserAndRoleComponent implements OnInit {

  maintainForm!: FormGroup;
  maintainDropdown$: any = this.commonService.maintenanceDropdown$;

  constructor(private commonService: CommonService, private fb: FormBuilder) {
    this.maintainForm = fb.group({
      academicYear: [null, Validators.required],
      subject: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    // this.commonService.maintenanceDropdown$.subscribe(
    //   (data: any) => {
    //     this.academicYear = data.academic;
    //     this.subjects = data.subjects;
    //   }
    // )
  }

  onAcademicYearChanges(academicYear: string) {
    this.commonService.onAcademicYearChanged(academicYear);
  }

}
