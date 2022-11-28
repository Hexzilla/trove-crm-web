import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './forgot-password.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CountdownModule } from 'ngx-countdown';
import { ResetEmailComponent } from './reset-email/reset-email.component';
import { NewPasswordComponent } from './new-password/new-password.component';
const routes: Routes = [
  { path: '', component: ForgotPasswordComponent },
  { path: 'reset-email', component: ResetEmailComponent },
  //{path:'new-password', component:NewPasswordComponent},
  { path: 'new-password', component: NewPasswordComponent },
];

@NgModule({
  declarations: [
    ForgotPasswordComponent,
    ResetEmailComponent,
    NewPasswordComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CountdownModule,
  ],
  exports: [RouterModule],
})
export class ForgotPasswordModule {}
