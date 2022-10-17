import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { MaintenanceService } from 'src/app/shared/service/api/maintenance.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { DatabaseComponent } from './database/database.component';
import { UploadComponent } from './database/upload/upload.component';
import { ViewComponent } from './database/view/view.component';

const routes: Routes = [
  {
    path: 'database', component: DatabaseComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes), 
    SharedModule,
    MaterialModule
  ],
  declarations: [DatabaseComponent, UploadComponent, ViewComponent],
  exports: [RouterModule],
})
export class MaintenanceModule { }
