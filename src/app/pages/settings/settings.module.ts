import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { RouterModule , Routes } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
const routes: Routes = [
  {path:'', component:SettingsComponent}
]
@NgModule({
  declarations: [SettingsComponent,],
  imports: [
    CommonModule,RouterModule.forChild(routes),MaterialModule,SharedModule
  ],
  exports:[RouterModule]
})
export class SettingsModule { }
