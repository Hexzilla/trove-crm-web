import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBarService } from '../../../shared/snack-bar.service';
import { extractErrorMessagesFromErrorResponse } from '../../../services/extract-error-messages-from-error-response';
import { FormStatus } from '../../../services/form-status';

import { SettingsApiService } from 'src/app/services/settings-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription, Observable, of as observableOf, BehaviorSubject, combineLatest, merge } from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {MatInputModule} from '@angular/material/input';
//import { AnyARecord } from 'dns';
interface ADDPERSONROLE {
  value: string;
  viewValue: string;
}
/*For Role Table*/
export interface ROLE {
  role: string;
  accessLevel: string;
}
/*For Role Table*/
/*For User Table*/
export interface USER {
  profile: string;
  user: string;
  role: string;
  accessLevel: string;
}
/*For User Table*/
@Component({
  selector: 'app-usersroles',
  templateUrl: './usersroles.component.html',
  styleUrls: ['./usersroles.component.css'],
})
export class UsersrolesComponent implements OnInit, AfterViewInit {
  closeResult = '';
  /*Browse File*/
  addPersonImage: File = null;
  addPersonImageUrl: string | ArrayBuffer =
    '../../../assets/images/settingsProfile.png';
  /*Add Person Mandatory checkbox*/
  isAddPersonMand: boolean;
  /*Add Person Mandatory checkbox*/
  addPersonForm: FormGroup;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private sb: SnackBarService,
    private settingsApiService: SettingsApiService,
    private cdref: ChangeDetectorRef
  ) {
    //this.initaddPersonForm();
  }
  /*Browse file*/
  addPersonImageEvent(event) {
    this.addPersonImage = event.target.files[0];
  }

  removeAddPersonImage() {
    this.addPersonImage = null;
    this.addPersonImageUrl = '../../../assets/images/settingsProfile.png';
  }

  onChangeAddPerson(profile: File) {
    if (profile) {
      this.addPersonImage = profile;
      const reader = new FileReader();
      reader.readAsDataURL(profile);
      reader.onload = (event) => {
        this.addPersonImageUrl = reader.result;
      };
    }
  }
  /*Browse file*/

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  /** Users Code */

  ngOnInit(): void {}
  ngAfterViewInit() {
    this.listUsers();
  }
  /**=============================================================================================================== */
  // 1 - Initialize a form status object for the component
  formStatus = new FormStatus();
  private subscriptions: Subscription[] = [];
  filterValue = "";

  userData = {
    role_id: 1
  };
  rolesList = [];

  /**============ User Section ============*/
  displayedColumns: string[] = ['first_name', 'role_name', 'access_level', 'record_status', 'Action'];

  data: Observable<any[]>;
  UsersList: Observable<any[]>;
  updateUserId = "";
  deleteUserId = "";
  userConfirmationForDelete = false;

  resultsLength = 0; resultsLengthRole = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  initaddPersonForm(data: any = []) {
    if (data) {
      this.updateUserId = data.id;
      this.addPersonForm = this.fb.group({
        first_name: [
          data.first_name,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(255),
            //Validators.pattern('^[_A-z0-9]*((-|s)*[_A-z0-9])*$'),
          ],
        ],
        last_name: [data.last_name, [Validators.required, Validators.maxLength(255)]],
        email: [
          data.email,
          [
            Validators.required,
            Validators.maxLength(255),
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
        mobile_code: ['+91', Validators.required],
        mobile_number: [data.phone_number, [Validators.required, Validators.maxLength(32)]],
        work_number: [data.work_number, [Validators.required, Validators.maxLength(32)]],
        user_role_id: [data.role_id, []],
        address: [data.address, []],
        skype_id: [data.skype_id, []],
        description: [data.description, []],
      });
    } else {
      this.addPersonForm = this.fb.group({
        first_name: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(255),
            //Validators.pattern('^[_A-z0-9]*((-|s)*[_A-z0-9])*$'),
          ],
        ],
        last_name: ['', [Validators.required, Validators.maxLength(255)]],
        email: [
          '',
          [
            Validators.required,
            Validators.maxLength(255),
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
        mobile_code: ['+91', Validators.required],
        mobile_number: ['', [Validators.required, Validators.maxLength(32)]],
        work_number: ['', [Validators.required, Validators.maxLength(32)]],
        user_role_id: [this.rolesList[0].id, []],
        address: ['', []],
        skype_id: ['', []],
        description: ['', []],
      });
    }
  }
  /*Modal dialog*/
  open(content, id="") {
    this.settingsApiService.initUserForm(id).subscribe(
      (res: any) => {
        if (res.success) {
          if (res.data.menu_previlages.create == 1) {
            this.userData = res.data.user;
            this.rolesList = res.data.roles;
            this.initaddPersonForm(this.userData);
            this.modalService
              .open(content, { ariaLabelledBy: 'dialog001' })
              .result.then(
                (result) => {
                  this.closeResult = `Closed with: ${result}`;
                },
                (reason) => {
                  this.closeModal();
                  this.closeResult = `Dismissed ${this.getDismissReason(
                    reason
                  )}`;
                }
              );
          } else {
            this.triggerSnackBar(res.message, 'Close');
          }
        } else {
          this.triggerSnackBar(res.message, 'Close');
        }
      },
      (errorResponse: HttpErrorResponse) => {
        const messages = extractErrorMessagesFromErrorResponse(errorResponse);
        this.triggerSnackBar(messages.toString(), 'Close');
      }
    );
  }
  onSubmit() {
    if (!this.addPersonForm.valid) {
      return false;
    } else {
      // 2 - Call onFormSubmitting to handle setting the form as submitted and
      //     clearing the error and success messages array
      this.formStatus.onFormSubmitting();
      var formData: any = new FormData();
      if(this.addPersonImage){
        formData.append("profile_pic", this.addPersonImage, this.addPersonImage.name);
      }

      formData.append("address", this.addPersonForm.get('address').value);
      formData.append("description", this.addPersonForm.get('description').value);
      formData.append("email", this.addPersonForm.get('email').value);
      formData.append("first_name", this.addPersonForm.get('first_name').value);
      formData.append("last_name", this.addPersonForm.get('last_name').value);
      formData.append("mobile_code", this.addPersonForm.get('mobile_code').value);
      formData.append("mobile_number", this.addPersonForm.get('mobile_number').value);
      formData.append("skype_id", this.addPersonForm.get('skype_id').value);
      formData.append("user_role_id", this.addPersonForm.get('user_role_id').value);
      formData.append("work_number", this.addPersonForm.get('work_number').value);

      if(this.updateUserId){
        const subs_query_param = this.settingsApiService
        .updateUser(formData, this.updateUserId)
        .subscribe(
          (res: any) => {
            this.triggerSnackBar(res.message, 'Close');
            this.modalService.dismissAll();
            this.listUsers();
          },
          (errorResponse: HttpErrorResponse) => {
            const messages = extractErrorMessagesFromErrorResponse(
              errorResponse
            );
            this.triggerSnackBar(messages.toString(), 'Close');
          }
        );
      this.subscriptions.push(subs_query_param);
      } else {
        const subs_query_param = this.settingsApiService
        .addUser(formData)
        .subscribe(
          (res: any) => {
            this.triggerSnackBar(res.message, 'Close');
            this.modalService.dismissAll();
            this.listUsers();
          },
          (errorResponse: HttpErrorResponse) => {
            const messages = extractErrorMessagesFromErrorResponse(
              errorResponse
            );
            this.triggerSnackBar(messages.toString(), 'Close');
          }
        );
      this.subscriptions.push(subs_query_param);
      }

    }
  }

  listUsers(){
    this.UsersList = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        // startWith([undefined, ]),
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.settingsApiService.listUser(
            this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, this.filterValue);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.data.recordsTotal;

          return data.data.data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      );
  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }

  closeModal(){
    this.updateUserId = "";
    this.deleteUserId = "";
    this.modalService.dismissAll();
  }

  filterUsers(){
    this.resetPaging();
    this.listUsers();
  }

  changeUserStatus(enable: boolean, id){
    var status = 2
    if(enable){
      status = 1;
    }
    const subs_query_changeuser = this.settingsApiService
        .changeUserStatus(status, id)
        .subscribe(
          (res: any) => {
            this.triggerSnackBar(res.message, 'Close');
          },
          (errorResponse: HttpErrorResponse) => {
            const messages = extractErrorMessagesFromErrorResponse(
              errorResponse
            );
            this.triggerSnackBar(messages.toString(), 'Close');
          }
        );
      this.subscriptions.push(subs_query_changeuser);
  }

  deleteModal(content, id){
    this.deleteUserId = id;
    this.modalService
    .open(content, { ariaLabelledBy: 'dialog001' })
    .result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeModal();
        this.closeResult = `Dismissed ${this.getDismissReason(
          reason
        )}`;
      }
    );
  }
  deleteUser(id){
    this.settingsApiService.deleteUser(id).subscribe(
      (res: any) => {
        if (res.success) {
          this.triggerSnackBar(res.message, 'Close');
          this.modalService.dismissAll();
          this.listUsers();
          this.deleteUserId = "";
          this.userConfirmationForDelete = false;
        } else {
          this.triggerSnackBar(res.message, 'Close');
        }
      },
      (errorResponse: HttpErrorResponse) => {
        const messages = extractErrorMessagesFromErrorResponse(errorResponse);
        this.triggerSnackBar(messages.toString(), 'Close');
      }
    );
  }

  triggerSnackBar(message: string, action: string) {
    this.sb.openSnackBarBottomCenter(message, action);
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  tabLoadTimes: Date[] = [];

  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
  }
  compareFunction(o1: any, o2: any) {
    return (o1 == o2);
   }
}
