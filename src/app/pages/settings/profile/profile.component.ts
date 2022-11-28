import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { SnackBarService } from '../../../shared/snack-bar.service';
import { AccountApiService } from 'src/app/services/account-api.service';
import { TokenService } from 'src/app/services/token.service';
import { SettingsApiService } from 'src/app/services/settings-api.service';
import { UserProfile } from './user-profile';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, NavigationExtras } from '@angular/router';
import { extractErrorMessagesFromErrorResponse } from 'src/app/services/extract-error-messages-from-error-response';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  /*Browse File*/
  private subscriptions: Subscription[] = [];
  profile: File = null;
  userData: UserProfile;
  imageUrl: string | ArrayBuffer = '../../../assets/images/settingsProfile.png';
  /*Browse File*/
  changePasswordForm: FormGroup;
  createChangePasswordForm() {
    this.changePasswordForm = this.fb.group({
      old_password: ['', Validators.required],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
    });
  }
  closeResult = '';
  profileForm: FormGroup;
  account_id: string;

  //  constructor starts
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private sb: SnackBarService,
    private settingsApiService: SettingsApiService,
    private account: AccountApiService,
    private token: TokenService,
    private router: Router,
  ) {
    // this.changePassword();
  }
  //  constructor ends

  //defining method for display of SnackBar
  triggerSnackBar(message: string, action: string) {
    this.sb.openSnackBarBottomCenter(message, action);
  }
  /*Modal dialog*/
  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'dialog001' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  /*Modal dialog*/

  profilePicture(event) {
    this.profile = event.target.files[0];
  }
  removeProfilePicture() {
    this.settingsApiService.removeProfilePic().subscribe(
      (res: any) => {
        this.triggerSnackBar(res.message, 'Close');
        this.profile = null;
        this.imageUrl = '../../../assets/images/settingsProfile.png';
      },
      (errorResponse: HttpErrorResponse) => {
        const messages = extractErrorMessagesFromErrorResponse(errorResponse);
        this.triggerSnackBar(messages.toString(), 'Close');
      }
    );
  }
  onChangeProfile(profile: File) {
    if (profile) {
      this.profile = profile;
      const reader = new FileReader();
      reader.readAsDataURL(profile);
      reader.onload = (event) => {
        this.imageUrl = reader.result;
      };
      this.settingsApiService.changeProfilePic(this.profile).subscribe(
        (res: any) => {
          this.triggerSnackBar(res.message, 'Close');
          this.imageUrl = res.data.profile_image_url;
        },
        (errorResponse: HttpErrorResponse) => {
          this.profile = null;
          this.imageUrl = '../../../assets/images/settingsProfile.png';
          const messages = extractErrorMessagesFromErrorResponse(errorResponse);
          this.triggerSnackBar(messages.toString(), 'Close');
        }
      );
    }
  }

  ngOnInit(): void {
    const subs_query_param_get = this.settingsApiService
      .accountMe()
      .subscribe((res: any) => {
        this.userData = res.data;
        this.account_id = res.data.account_id;
        if(res.success){
          this.imageUrl = res.data.profile_pic;
        }
      });
    this.subscriptions.push(subs_query_param_get);
  }

  createProfileForm() {
    this.profileForm = this.fb.group({
      email: [
        this.userData.email,
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      first_name: [this.userData.first_name, [Validators.required]],
      last_name: [this.userData.last_name, [Validators.required]],
    });
    this.profileForm.controls.email.disable();
  }

  updateProfile() {
    const data = this.profileForm.value;
    const subs_query_param = this.settingsApiService
      .updateProfile(data)
      .subscribe((res: any) => {
        this.triggerSnackBar(res.message, 'Close');
        this.userData.first_name = data.first_name;
        this.userData.last_name = data.last_name;
        this.modalService.dismissAll();
      });
    this.subscriptions.push(subs_query_param);
  }

  updateChangePassword() {
    const data = this.changePasswordForm.value;
    this.settingsApiService.changePassword(data).subscribe(
      (res: any) => {
        this.triggerSnackBar(res.message, 'Close');
        this.modalService.dismissAll();
        this.logout();
      },
      (errorResponse: HttpErrorResponse) => {
        const messages = extractErrorMessagesFromErrorResponse(errorResponse);
        this.triggerSnackBar(messages.toString(), 'Close');
      }
    );
  }
  logout() {
    this.account.logout().subscribe(
      (response) => {
        this.token.remove();
        //this.router.navigate(['login']);
        let objToSend: NavigationExtras = {
          queryParams: {
            success: response.success,
            message: response.message,
          },
        };
        this.router.navigate(['login'], {
          state: objToSend,
        });
        //this.router.navigate(['login'], {queryParams: { logout: 'true' } });
      },
      (err) => {
        if (err.error.code == 113) {
          this.token.remove();
          let objToSend: NavigationExtras = {
            queryParams: {
              success: true,
              message: 'Password Changed successfully!',
            },
          };
          this.router.navigate(['login'], {
            state: objToSend,
          });
          //this.router.navigate(['login'], {queryParams: { logout: 'true' } });
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
