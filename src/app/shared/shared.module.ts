import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from "angular-datatables";
import { ThaiDatePipe } from './pipe/thai-date.pipe';

@NgModule({
  imports:[
    DataTablesModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    ThaiDatePipe
  ],
  declarations: [
    ThaiDatePipe
  ],
})
export class SharedModule { }
