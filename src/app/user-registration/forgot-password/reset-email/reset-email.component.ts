import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountApiService } from 'src/app/services/account-api.service';
@Component({
  selector: 'app-reset-email',
  templateUrl: './reset-email.component.html',
  styleUrls: ['./reset-email.component.css']
})

export class ResetEmailComponent implements OnInit {

  formDisplay = 'formHide';
  timerFinished = false;
  clicked = false;
  apiResponse: any;
  private subscriptions: Subscription[] = [];

  constructor(
    public formBuilder: FormBuilder,
    private account: AccountApiService,
    private router: Router
  ) {
    const subs_value_change = this.resetPasswordForm.valueChanges.subscribe((data) => {
      this.apiResponse = false;
    });
    this.subscriptions.push(subs_value_change);
  }

  resetPasswordForm = this.formBuilder.group({
    email: [
      '',
      [
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
    ],
  });

  ngOnInit(): void {
    this.apiResponse = {"success": true};
  }
  onTimerFinished(e:Event){
    if (e["action"] == "done"){
       this.formDisplay = 'formShow';
       this.timerFinished = true;
     }
   }
   // Submit Registration Form
  onSubmit() {
    if (!this.resetPasswordForm.valid) {
      return false;
    } else {
      this.clicked = true;
      const subs_send_password_link = this.account.sendPasswordResetLink(this.resetPasswordForm.controls['email'].value).subscribe(
        (response) => {
          this.clicked = false;
          this.apiResponse = response;
          //this.router.navigate(['/user/forgot-password/reset-email']);
          this.formDisplay = 'formHide';
          this.timerFinished = false;
        },
        (err) => {
          this.clicked = false;
          if (err.error.code === 254) {
            const formControl = this.resetPasswordForm.get('email');
            if (formControl) {
              formControl.setErrors({
                serverError: err.error.message,
              });
            }
          } else {
            this.apiResponse = err.error;
          }
        }
      );
      this.subscriptions.push(subs_send_password_link);
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
