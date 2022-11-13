import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { RouterModule, Routes } from '@angular/router';
import { RfidComponent } from './rfid/rfid.component';

const routes: Routes = [
  { path: '', component: RfidComponent },
];

@NgModule({
  declarations: [
    RfidComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    MaterialModule,
  ],
  exports: [RouterModule],
})
export class RfidModule { }

