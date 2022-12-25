import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { LessthaneightyComponent } from './lessthaneighty/lessthaneighty.component';
import { AttendaceSummaryComponent } from './attendace-summary/attendace-summary.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
];

@NgModule({
  declarations: [
    DashboardComponent,
    LessthaneightyComponent,
    AttendaceSummaryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgChartsModule,
    SharedModule,
    MaterialModule
  ]
})
export class DashboardModule { }
