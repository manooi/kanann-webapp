import { NgModule } from '@angular/core';
import { CheckComponent } from './check.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'check', component: CheckComponent,
  },
];

@NgModule({
  declarations: [
    CheckComponent
  ],
  imports: [
    RouterModule.forChild(routes), 
    SharedModule,
    MaterialModule
  ],
  exports: [RouterModule]
})
export class CheckModule { }
