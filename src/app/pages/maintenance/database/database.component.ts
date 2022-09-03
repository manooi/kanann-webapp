import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { NgxSpinnerService } from 'ngx-spinner';
import { delay } from 'rxjs/operators';
import { GetDatabaseRequest } from 'src/app/model/database';
import { Dropdown } from 'src/app/model/dropdown';
import { CommonService } from 'src/app/shared/service/api/common.service';
import { UploadMasterService } from 'src/app/shared/service/api/uploadmaster.service';
import { AlertService } from 'src/app/shared/service/utility/alert.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit {
  maintainViewForm!: FormGroup;
  maintainUploadForm!: FormGroup;
  academicYear$ = this.commonService.academicYear$;

  data: any;
  filteredData: any;

  displayedColumns: string[] = [];
  columnsMapping: any = {
    sequence: "เลขที่",
    studentId: "รหัสนักเรียน",
    gender: "เพศ",
    firstName: "ชื่อ",
    lastName: "สกุล",
    academicYear: "ปีการศึกษา",
    classRoomName: "ชั้นเรียน"
  };
  searchKeyword:any;

  fileToBeUploaded!: any;
  isFileReady: boolean = false;

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
  }

  private initializeForm() {
    this.maintainViewForm = this.fb.group({
      database: [null, Validators.required],
      academicYear: [null]
    });

    this.maintainUploadForm = this.fb.group({
      database: [null, Validators.required],
    });
  }

  onDatabaseChange(event: MatSelectChange) {
    const isAcadamicYearSelected = event.value == 1;
    if (!isAcadamicYearSelected) {
      this.isAcademicYear()?.setValidators(Validators.required);
    }
    else {
      this.isAcademicYear()?.clearValidators();
      this.isAcademicYear()?.setErrors(null);
      this.maintainViewForm.patchValue({
        academicYear: null
      })
    }
  }


  onSearch(event: any) {
    this.searchKeyword = event.target.value.trim();
    if (event.target.value == '') {
      this.filteredData = this.data.slice(0, 10);
      return;
    }

    const keys = Object.keys(this.data[0]);
    this.filteredData = this.data.filter((i: any) => {
      let isMatched: boolean = false;
      for (let key = 0; key < keys.length; key++) {
        const value = String(i[keys[key]]);
        if (value.includes(String(event.target.value.trim()))) {
          isMatched = true;
        }
      }
      return isMatched;
    }).slice(0, 10);
  }

  search() {
    this.spinner.show();
    const params: GetDatabaseRequest = {
      database: this.isDataBase()?.value,
      academicYear: this.isAcademicYear()?.value,
    };

    this.uploadMasterService.getDatabase(params).pipe(delay(100)).subscribe(
      (data) => {
        this.spinner.hide();
        if (data?.length == 0) {
          this.alertService.info('No data');
          this.data = [];
          this.filteredData = [];
          return;
        }
        this.data = data;
        this.filteredData = data?.slice(0, 10);
        this.displayedColumns = Object.keys(this.columnsMapping);
      },
      (error) => this.spinner.hide()
    );
  }

  handleFileInput(event: any) {
    this.isFileReady = false;
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const workBook = XLSX.read(e?.target?.result);
      const firstSheet = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[firstSheet];
      this.fileToBeUploaded = XLSX.utils.sheet_to_json(workSheet, { raw: true });
      this.convertDataType(this.fileToBeUploaded);
      this.isFileReady = true;
      console.log(this.fileToBeUploaded);
    };

    reader.readAsArrayBuffer(file);
  }

  private convertDataType(fileToBeUploaded: any) {
    this.fileToBeUploaded = fileToBeUploaded.map((i: any) => ({ ...i, StudentId: String(i.StudentId) }))
  }

  onPageEvent(event: PageEvent) {
    const pageSize = event.pageSize;
    const pageIndex = event.pageIndex;
    this.filteredData = this.data.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
  }

  uploadData() {
    console.log(this.fileToBeUploaded);
    this.spinner.show();
    const startTime = new Date().getTime();
    this.uploadMasterService.uploadStudentMaster({ data: this.fileToBeUploaded }).subscribe(
      (data) => {
        this.spinner.hide();
        const elaspedTime = new Date().getTime() - startTime;
        this.alertService.success(`Successfully uploaded data. ${elaspedTime / 1000} sec.`);
      },
      (err) => {
        this.spinner.hide();
        this.alertService.error("Error occured when uploading data.");
      }
    )
  }

  isDataBase() {
    return this.maintainViewForm.get("database");
  }

  isAcademicYear() {
    return this.maintainViewForm.get("academicYear");
  }


  debug() {
    console.log(this.maintainViewForm.controls);
  }

}
