import { TokenService } from './../../services/token.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, DoCheck, OnDestroy, NgZone } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountApiService } from '../../services/account-api.service';
import { extractErrorMessagesFromErrorResponse } from './../../services/extract-error-messages-from-error-response';
import { FormStatus } from './../../services/form-status';
import {
  SocialAuthService,
  GoogleLoginProvider,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { Subscription } from 'rxjs';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  apiResponse: any;
  clicked = false;
  hide = true;
  infoMessage = '';
  infoStatus = 'alertBox';
  socialUser: SocialUser;
  isLoggedin: boolean;
  NavigationExtrasResponse:any;

  private subscriptions: Subscription[] = [];

  // 1 - Initialize a form status object for the component
  formStatus = new FormStatus();

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private account: AccountApiService,
    private token: TokenService,
    private socialAuthService: SocialAuthService,
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public ngZone: NgZone,
  ) {
    this.NavigationExtrasResponse = this.router.getCurrentNavigation().extras.state;
    //console.log(this.NavigationExtrasResponse);

    if (account.isLoggedIn()) {
      router.navigate(['pages/dashboard']);
    }
    const subs_valuechange = this.loginForm.valueChanges.subscribe((data) => {
      this.apiResponse = false;
    });


    const subs_query_param = this.route.queryParams
      .subscribe(params => {
        if(params.logout !== undefined && params.logout === 'true') {
            this.infoMessage = 'Logged out successfully.';
        } else if(params.reset !== undefined && params.reset === 'true'){
          this.infoMessage = 'Password changed successfully.';
        } else if(params.resettoken !== undefined && params.resettoken === 'false'){
          this.infoMessage = 'Password reset token is invalid/expired.';
          this.infoStatus = 'alertBoxError';
        } else if(params.verifyemail !== undefined && params.verifyemail === 'false'){
          this.infoMessage = 'Invalid token.';
          this.infoStatus = 'alertBoxError';
        } else if(params.verifyemail !== undefined && params.verifyemail === 'verified'){
          this.infoMessage = 'Email already verified.';
          this.infoStatus = 'alertBoxError';
        }
      });
      this.subscriptions.push(subs_valuechange);
      this.subscriptions.push(subs_query_param);
  }

  ngOnInit(): void {

  }

  /*##################### Google Auth #####################*/
  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user) => {
      this.socialUser = user;
      this.isLoggedin = user != null;
      //console.log(this.isLoggedin);
      this.formStatus.onFormSubmitting();
      if ( this.socialUser && typeof this.socialUser.email !== 'undefined') {
        let postData = {
          email: this.socialUser.email,
          platform: 'web',
          type: this.socialUser.provider,
          social_user_id: this.socialUser.id,
        };

        const sub_social = this.account.login(postData).subscribe(
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
          messages: ['Your social media doesn\'t have email, so kindly signup with email.']
        });
        this.logOut();
      }
    })
    .catch((error) => {
      //window.alert(error);
      console.log(error)
    });
  }
  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((user) => {
      this.socialUser = user;
      this.isLoggedin = user != null;
      this.formStatus.onFormSubmitting();
      if ( this.socialUser && typeof this.socialUser.email !== 'undefined') {
        let postData = {
          email: this.socialUser.email,
          platform: 'web',
          type: this.socialUser.provider,
          social_user_id: this.socialUser.id,
        };
        const sub_social = this.account.login(postData).subscribe(
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
        this.logOut();
        this.formStatus.onFormSubmitResponse({
          success: false,
          messages: ['Your social media doesn\'t have email, so kindly signup with email.']
        });
      }
    })
    .catch((error) => {
      //window.alert(error);
      console.log(error);
    });
  }

  // signUp With Twitter
  loginWithTwitter(): void {
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
            email: user.email,
            platform: 'web',
            type: 'TWITTER',
            social_user_id: user.id,
          };
          const sub_social = this.account.login(postData).subscribe(
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
        }
      })
      .catch((error) => {
        //window.alert(error);
        console.log(error);
      });
  }

  logOut(): void {
    if(this.isLoggedin){
      this.socialAuthService.signOut().then().catch(this.yourHandler);
    }
  }
  /* SignOut method for logging out from the Angular/Firebase app */
  TwitterSignOut() {
    if(this.isLoggedin){
      this.afAuth.auth.signOut().then().catch(this.yourHandler);
    }
  }
  yourHandler(){
    console.log("Social logged out");
  }
  /*##################### Login Form #####################*/

  loginForm = this.formBuilder.group({
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
    platform:"",
    type: ""
  });

  // Submit Registration Form
  onSubmit() {
    if (!this.loginForm.valid) {
      return false;
    } else {
      this.clicked = true;
      this.formStatus.onFormSubmitting();
      this.loginForm.patchValue({ platform: 'web', type: 'form' });
      const subs_form = this.account.login(this.loginForm.value).subscribe(
        (response) => {
          this.clicked = false;
          this.apiResponse = response;
          this.token.handle(response.data.token);
          localStorage.setItem('me', JSON.stringify(response.data.me));
          this.router.navigate(['pages/dashboard']);
        },
        (errorResponse: HttpErrorResponse) => {
          const messages = extractErrorMessagesFromErrorResponse(errorResponse);
          // call onFormSubmitResponse with the submission success status (false) and the array of messages
          this.formStatus.onFormSubmitResponse({
            success: false,
            messages: messages,
          });
        }
      );
      this.subscriptions.push(subs_form);
    }
  }
  ngOnDestroy() {
    //console.log("ngOnDestroy")
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
    if(this.isLoggedin){
      this.logOut();
      this.afAuth.auth.signOut();
    }
  }
}
