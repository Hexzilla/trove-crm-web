import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit,NgZone } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountApiService } from '../../services/account-api.service';
import { extractErrorMessagesFromErrorResponse } from './../../services/extract-error-messages-from-error-response';
import { FormStatus } from './../../services/form-status';
import {
  SocialAuthService,
  GoogleLoginProvider,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';
//import { AuthTwitterService } from './../../services/auth-twitter.service';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Subscription } from 'rxjs';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  fbLoginOptions = {
    scope: 'email',
    return_scopes: true,
    enable_profile_selector: true,
  }; // https://developers.facebook.com/docs/reference/jaPvascript/FB.login/v2.11

  googleLoginOptions = {
    scope: 'profile email https://www.googleapis.com/auth/contacts.readonly',
  }; // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig

  apiResponse: any;
  clicked = false;
  hide = true;
  socialUser: SocialUser;
  isLoggedin: boolean;
  sub_social_auth;

  private subscriptions: Subscription[] = [];

  // 1 - Initialize a form status object for the component
  formStatus = new FormStatus();

  constructor(
    public fb: FormBuilder,
    private account: AccountApiService,
    private router: Router,
    private token: TokenService,
    private socialAuthService: SocialAuthService,
    //public authTwitterService: AuthTwitterService,
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public ngZone: NgZone,
  ) {
    const subs_valuechange = this.registrationForm.valueChanges.subscribe(
      (data) => {
        this.apiResponse = false;
      }
    );
    this.subscriptions.push(subs_valuechange);
  }

  ngOnInit(): void {
    if (this.isLoggedin) {
      this.logOut();
      this.TwitterSignOut();
    }
  }
  /*##################### Google Auth #####################*/
  async loginWithGoogle(): Promise<void> {
    await this.socialAuthService.signIn(
      GoogleLoginProvider.PROVIDER_ID,
      this.googleLoginOptions
    ).then((user) => {
      this.socialUser = user;
        this.isLoggedin = user != null;
        this.formStatus.onFormSubmitting();
        if (this.socialUser && typeof this.socialUser.email !== 'undefined') {
          let postData = {
            first_name: this.socialUser.firstName,
            last_name: this.socialUser.lastName,
            email: this.socialUser.email,
            platform: 'web',
            type: this.socialUser.provider,
            social_user_id: this.socialUser.id,
            auth_token: this.socialUser.authToken,
            profile_pic: this.socialUser.photoUrl,
          };
          const sub_social = this.account.createAccount(postData).subscribe(
            (response) => {
              this.apiResponse = response;
              this.token.handle(response.data.token);
              this.formStatus.onFormSubmitResponse({
                success: true,
                messages: [],
              });
              this.logOut();
              this.router.navigate(['pages/dashboard']);
            },
            (errorResponse: HttpErrorResponse) => {
              const messages = extractErrorMessagesFromErrorResponse(
                errorResponse
              );
              this.formStatus.onFormSubmitResponse({
                success: false,
                messages: messages,
              });
              this.logOut();
            }
          );
          this.subscriptions.push(sub_social);
        } else {
          this.formStatus.onFormSubmitResponse({
            success: false,
            messages: [
              "Your social media doesn't have email, so kindly signup with email.",
            ],
          });
          this.logOut();
        }
    })
    .catch((error) => {
      //window.alert(error);
      console.log(error);
    });
  }
  async loginWithFacebook(): Promise<void> {
    await this.socialAuthService.signIn(
      FacebookLoginProvider.PROVIDER_ID,
      this.fbLoginOptions
    ).then((user) => {
      this.socialUser = user;
        this.isLoggedin = user != null;
        this.formStatus.onFormSubmitting();
        if (this.socialUser && typeof this.socialUser.email !== 'undefined') {
          let postData = {
            first_name: this.socialUser.firstName,
            last_name: this.socialUser.lastName,
            email: this.socialUser.email,
            platform: 'web',
            type: this.socialUser.provider,
            social_user_id: this.socialUser.id,
            auth_token: this.socialUser.authToken,
            profile_pic: this.socialUser.photoUrl,
          };
          const sub_social = this.account.createAccount(postData).subscribe(
            (response) => {
              this.apiResponse = response;
              this.token.handle(response.data.token);
              this.formStatus.onFormSubmitResponse({
                success: true,
                messages: [],
              });
              this.logOut();
              this.router.navigate(['pages/dashboard']);
            },
            (errorResponse: HttpErrorResponse) => {
              const messages = extractErrorMessagesFromErrorResponse(
                errorResponse
              );
              this.formStatus.onFormSubmitResponse({
                success: false,
                messages: messages,
              });
              this.logOut();
            }
          );
          this.subscriptions.push(sub_social);
        } else {
          this.formStatus.onFormSubmitResponse({
            success: false,
            messages: [
              "Your social media doesn't have email, so kindly signup with email.",
            ],
          });
          this.logOut();
        }
    })
    .catch((error) => {
      //window.alert(error);
      console.log(error);
    });
  }

  // signUp With Twitter
  signUpTwitter(): void {
    this.AuthTwitter(new auth.TwitterAuthProvider());
  }
  // Auth logic to run auth providers
  AuthTwitter(provider) {
    this.afAuth.auth
      .signInWithPopup(provider).then((result: any) => {
        let user = result.additionalUserInfo.profile;
        this.isLoggedin = user != null;

        this.formStatus.onFormSubmitting();
        if(typeof user !== 'undefined' && user.email != ""){
          let postData = {
            first_name: user.name,
            email: user.email,
            platform: 'web',
            type: 'TWITTER',
            social_user_id: user.id,
            auth_token: result.credential.accessToken,
            profile_pic: user.profile_image_url_https || '',
          };
          const sub_social = this.account.createAccount(postData).subscribe(
            (response) => {
              this.apiResponse = response;
              this.token.handle(response.data.token);
              this.formStatus.onFormSubmitResponse({
                success: true,
                messages: [],
              });

              this.ngZone.run(() => {
                this.router.navigate(['pages/dashboard']);
              });
            },
            (errorResponse: HttpErrorResponse) => {

              const messages = extractErrorMessagesFromErrorResponse(
                errorResponse
              );
              this.formStatus.onFormSubmitResponse({
                success: false,
                messages: messages,
              });
              this.TwitterSignOut();

            }
          );
          this.subscriptions.push(sub_social);
        } else {
          this.formStatus.onFormSubmitResponse({
            success: false,
            messages: [
              "Your social media doesn't have email, so kindly signup with email.",
            ],
          });
          this.TwitterSignOut();
        }
      })
      .catch((error) => {
        //window.alert(error);
        console.log(error);
      });
  }

  logOut(): void {
    if (this.isLoggedin) {this.socialAuthService.signOut().then().catch(this.yourHandler);}
  }
  /* SignOut method for logging out from the Angular/Firebase app */
  TwitterSignOut() {
    if (this.isLoggedin) {this.afAuth.auth.signOut().then().catch(this.yourHandler);}
  }
  yourHandler(){
    console.log("Social logged out");
  }
  /*##################### Registration Form #####################*/

  registrationForm = this.fb.group({
    first_name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(255),
        //Validators.pattern('^[_A-z0-9]*((-|s)*[_A-z0-9])*$'),
      ],
    ],
    last_name: ['', [Validators.maxLength(255)]],
    email: [
      '',
      [
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
        ),
      ],
    ],
    company_name: ['', [Validators.maxLength(255)]],
    no_of_employees: '',
    platform: '',
    type: '',
  });

  // Submit Registration Form
  async onSubmit() {
    if (!this.registrationForm.valid) {
      //console.log(this.registrationForm.controls.first_name.errors);
      return false;
    } else {
      // 2 - Call onFormSubmitting to handle setting the form as submitted and
      //     clearing the error and success messages array
      this.formStatus.onFormSubmitting();
      this.registrationForm.patchValue({ platform: 'web', type: 'form' });
      const subs_form = await this.account
        .createAccount(this.registrationForm.value)
        .subscribe(
          (response) => {
            this.apiResponse = response;
            this.token.handle(response.data.token);
            this.router.navigate(['pages/dashboard']);
          },
          (errorResponse: HttpErrorResponse) => {
            const messages = extractErrorMessagesFromErrorResponse(
              errorResponse
            );
            this.formStatus.onFormSubmitResponse({
              success: false,
              messages: messages,
            });
            /*if (errorResponse.error.code === 253) {
            const validationErrors = { email: errorResponse.error.message };
            Object.keys(validationErrors).forEach((prop) => {
              const formControl = this.registrationForm.get(prop);
              if (formControl) {
                formControl.setErrors({
                  serverError: validationErrors[prop],
                });
              }
            });
          } else {
            const messages = extractErrorMessagesFromErrorResponse(
              errorResponse
            );
            // call onFormSubmitResponse with the submission success status (false) and the array of messages
            this.formStatus.onFormSubmitResponse({
              success: false,
              messages: messages,
            });
          }*/
          }
        );
      this.subscriptions.push(subs_form);
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
    //this.sub_social_auth.unsubscribe();
    this.logOut();
    this.TwitterSignOut();
  }
}
