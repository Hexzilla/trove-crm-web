import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AccountApiService } from './../../../services/account-api.service';
import { ConfirmedValidator } from './../../../services/confirmed.validator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css'],
})
export class NewPasswordComponent implements OnInit, OnDestroy {
  public error = [];
  public form = {
    password: null,
    password_confirmation: null,
    reset_token: null,
  };
  apiResponse: any;
  clicked = false;

  private subscriptions: Subscription[] = [];

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private account: AccountApiService
  ) {
    const subs_query_param = route.queryParams.subscribe((params) => {
      this.form.reset_token = params['token'];
      const subs_validate_token = this.account
        .validateResetPasswordToken(params['token'])
        .subscribe(
          (response) => {
            this.apiResponse = response;
          },
          (err) => {
            //console.log(err.error);
            let objToSend: NavigationExtras = {
              queryParams: {
                success: false,
                message: err.error.message,
              },
            };
            this.router.navigate(['login'], {
              state: objToSend,
            });
          }
        );
      this.subscriptions.push(subs_validate_token);
    });
    this.subscriptions.push(subs_query_param);
    const subs_value_change = this.ResetPasswordForm.valueChanges.subscribe(
      (data) => {
        //console.log("value change");
        this.apiResponse = false;
      }
    );
    this.subscriptions.push(subs_value_change);
  }

  ngOnInit(): void {}
  pwd = true;
  confirmPwd = true;

  ResetPasswordForm = this.formBuilder.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
          ),
        ],
      ],
      password_confirmation: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
          ),
        ],
      ],
    },
    {
      validator: ConfirmedValidator('password', 'password_confirmation'),
    }
  );

  onSubmit() {
    if (!this.ResetPasswordForm.valid) {
      return false;
    } else {
      this.clicked = true;
      this.form.password = this.ResetPasswordForm.get('password').value;
      this.form.password_confirmation = this.ResetPasswordForm.get(
        'password_confirmation'
      ).value;

      this.account.resetPassword(this.form).subscribe(
        (response) => {
          this.clicked = false;
          let objToSend: NavigationExtras = {
            queryParams: {
              success: true,
              message: response.message,
            },
          };
          this.router.navigate(['login'], {
            state: objToSend,
          });
          //this.router.navigate(['login'], {queryParams: { reset: 'true' } });
        },
        (err) => {
          this.clicked = false;
          this.apiResponse = err.error;
        }
      );
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
