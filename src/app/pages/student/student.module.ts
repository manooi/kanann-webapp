import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceComponent } from './attendance/attendance.component';
import { ScoreComponent } from './score/score.component';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { NgChartsModule } from 'ng2-charts';

const routes: Routes = [
  { path: 'score', component: ScoreComponent },
  { path: 'attendance', component: AttendanceComponent },
];

@NgModule({
  declarations: [
    AttendanceComponent,
    ScoreComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MaterialModule,
    NgChartsModule
  ]
})
export class StudentModule { }
