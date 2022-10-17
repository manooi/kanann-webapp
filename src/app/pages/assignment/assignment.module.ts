import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentComponent } from './assignment.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { AssignmentService } from 'src/app/shared/service/api/assignment.service';
import { CreateDialogComponent } from './create-dialog/create-dialog.component';

const routes: Routes = [
  { path: '', component: AssignmentComponent },
];

@NgModule({
  declarations: [
    AssignmentComponent,
    CreateDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MaterialModule
  ],
  providers: [AssignmentService]
})
export class AssignmentModule { }
