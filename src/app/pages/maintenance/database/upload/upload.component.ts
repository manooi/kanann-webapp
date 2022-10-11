import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { GetDatabaseRequest } from 'src/app/model/database';
import { CommonService } from 'src/app/shared/service/api/common.service';
import { UploadMasterService } from 'src/app/shared/service/api/uploadmaster.service';
import { AlertService } from 'src/app/shared/service/utility/alert.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  maintainUploadForm!: FormGroup;
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
    this.dtOptions = {
      pagingType: 'full_numbers',
      order: []
    };
  }

  private initializeForm() {
    this.maintainUploadForm = this.fb.group({
      database: [null, Validators.required],
    });
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
        const errMsg = err?.error?.responseException?.exceptionMessage?.detail;
        this.alertService.error("Error occured when uploading data. <br>" + errMsg);
      }
    )
  }

  debug() {
    // console.log(this.maintainViewForm.controls);
    console.log(this.selectedTabIndex);
  }
}
