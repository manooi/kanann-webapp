import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AppConstant } from 'src/app/config/app.constant';
import { GetDatabaseRequest } from 'src/app/model/database';
import { CommonService } from 'src/app/shared/service/api/common.service';
import { UploadMasterService } from 'src/app/shared/service/api/uploadmaster.service';
import { AlertService } from 'src/app/shared/service/utility/alert.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  maintainViewForm!: FormGroup;
  academicYear$ = this.commonService.academicYear$;
  masterType$ = this.commonService.masterType$;

  data: any;
  selectedTabIndex: number = 0;

  displayedColumns: string[] = [];
  columnsMapping: any = {};

  fileToBeUploaded!: any;
  isFileReady: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private uploadMasterService: UploadMasterService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.dtOptions = AppConstant.dtOptions
  }

  private initializeForm() {
    this.maintainViewForm = this.fb.group({
      database: [null, Validators.required],
      academicYear: [null]
    });
  }

  onDatabaseChange(event: MatSelectChange) {
    const isAcadamicYearOrTeacherSelected = (event.value == 1 || event.value == 2);

    if (isAcadamicYearOrTeacherSelected) {
      this.isAcademicYear()?.clearValidators();
      this.isAcademicYear()?.setErrors(null);
      this.maintainViewForm.patchValue({
        academicYear: null
      });
    }
    else {
      this.isAcademicYear()?.setValidators(Validators.required);
    }
    this.maintainViewForm.updateValueAndValidity();
  }

  search() {
    this.spinner.show();
    this.data = [];
    const params: GetDatabaseRequest = {
      database: +this.isDataBase()?.value,
      academicYearId: +this.isAcademicYear()?.value,
    };

    this.uploadMasterService.getDatabase(params).pipe(delay(100)).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.database?.length == 0) {
          this.alertService.info('ไม่มีข้อมูล');
          this.data = [];
          return;
        }
        this.data = res.database;
        this.displayedColumns = res.mapping.map((i: any) => i.variable);
        res.mapping.forEach((map: any) => {
          this.columnsMapping[map.variable] = map.name;
        });
        this.dtTrigger.next();
      },
      (error) => this.spinner.hide()
    );
  }

  isDataBase() {
    return this.maintainViewForm.get("database");
  }

  isAcademicYear() {
    return this.maintainViewForm.get("academicYear");
  }

  showAcademicYear() {
    return this.isDataBase()?.value && this.isDataBase()?.value !== '1' && this.isDataBase()?.value !== '2';
  }


  debug() {
    console.log(this.maintainViewForm);
    // console.log(this.selectedTabIndex);
  }

}
