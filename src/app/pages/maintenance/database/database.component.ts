import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dropdown } from 'src/app/model/dropdown';
import { CommonService } from 'src/app/shared/service/api/common.service';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit {
  maintainForm!: FormGroup;

  constructor(private commonService: CommonService, private fb: FormBuilder) {
    this.maintainForm = fb.group({
      database: [null, Validators.required],
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
}
