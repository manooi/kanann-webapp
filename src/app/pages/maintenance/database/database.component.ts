import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
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
  data: any;
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
  fileToBeUploaded!: any;
  maintainUploadForm: FormGroup;

  isFileReady: boolean = false;

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private uploadMasterService: UploadMasterService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService
  ) {
    this.maintainViewForm = fb.group({
      database: [null, Validators.required],
    });
    this.maintainUploadForm = fb.group({
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

  search() {
    this.commonService.getStudents().subscribe(
      (data) => {
        this.data = data;
        this.displayedColumns = Object.keys(this.columnsMapping);
      }
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

  uploadData() {
    console.log(this.fileToBeUploaded);
    this.spinner.show();
    this.uploadMasterService.uploadStudentMaster({ data: this.fileToBeUploaded }).subscribe(
      (data) => {
        this.spinner.hide();
        this.alertService.success("Successfully uploaded data.");
      },
      (err) => {
        this.spinner.hide();
        this.alertService.error("Error occured when uploading data.");
      }
    )
  }

}
