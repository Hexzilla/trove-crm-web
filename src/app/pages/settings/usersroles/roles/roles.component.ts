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
import { SnackBarService } from '../../../../shared/snack-bar.service';
import { extractErrorMessagesFromErrorResponse } from '../../../../services/extract-error-messages-from-error-response';
import { FormStatus } from '../../../../services/form-status';

import { SettingsApiService } from 'src/app/services/settings-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Subscription,
  Observable,
  of as observableOf,
  BehaviorSubject,
  combineLatest,
  merge,
} from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private sb: SnackBarService,
    private settingsApiService: SettingsApiService,
    private cdref: ChangeDetectorRef
  ) {
    this.initaddRoleForm();
  }

  ngOnInit() {}
  ngAfterViewInit() {
    this.listRoles();
  }
  /**==================================== Roles Section ====================================*/
  displayedColumnsRoles: string[] = ['name', 'description', 'status', 'Action'];
  Permissions = [];
  closeResult = '';
  newRoleForm;
  LoopingVar = [];
  RolesList: Observable<any[]>;
  formStatus = new FormStatus();
  private subscriptions: Subscription[] = [];
  filterValue = '';
  updateRoleId = '';
  deleteRoleId = '';
  roleConfirmationForDelete = false;

  resultsLengthRole = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginatorRoleList: MatPaginator;
  @ViewChild(MatSort) sortRoleList: MatSort;

  initaddRoleForm(data: any = []) {
    if (data) {
      this.updateRoleId = data.id;
      this.newRoleForm = this.fb.group({
        role_name: [data.name, Validators.required],
        role_description: [data.description],
        menus: this.fb.array([]),
      });
    } else {
      this.newRoleForm = this.fb.group({
        role_name: ['', Validators.required],
        role_description: '',
        menus: this.fb.array([]),
      });
    }
  }
  private addmenu() {
    var self = this;
    var formControlKey = -1;
    this.Permissions.forEach(function (value, key) {
      var temparr = [];
      formControlKey++;
      var obj = {
        menu_id: value.id,
        permission_create: value.user_has_permission_create,
        permission_edit: value.user_has_permission_edit,
        permission_view: value.user_has_permission_view,
        permission_delete: value.user_has_permission_delete,
        title: value.title,
        parent_id: value.parent_id,
        user_has_menu: value.user_has_menu,
        index: key,
        index_child: '',
        formControlKey: formControlKey,
      };
      self.newRoleForm.controls.menus.push(self.addMenuFormGroup(obj));
      temparr.push(obj);
      if (value.child_menus.length > 0) {
        value.child_menus.forEach(function (child_value, child_key) {
          formControlKey++;
          var obj = {
            menu_id: child_value.id,
            permission_create: child_value.user_has_permission_create,
            permission_edit: child_value.user_has_permission_edit,
            permission_view: child_value.user_has_permission_view,
            permission_delete: child_value.user_has_permission_delete,
            title: child_value.title,
            parent_id: child_value.parent_id,
            user_has_menu: child_value.user_has_menu,
            index: key,
            index_child: child_key,
            formControlKey: formControlKey,
          };
          self.newRoleForm.controls.menus.push(self.addMenuFormGroup(obj));
          temparr.push(obj);
        });
      }
      self.LoopingVar[key] = temparr;
    });
    //this.Permissions.forEach((menu) => this.newRoleForm.controls.menus.push(this.addMenuFormGroup(menu)));
  }
  addMenuFormGroup(data: any = []): FormGroup {
    if (data) {
      return this.fb.group({
        menu_id: [data.menu_id],
        permission_create: [data.permission_create],
        permission_edit: [data.permission_edit],
        permission_view: [data.permission_view],
        permission_delete: [data.permission_delete],
        title: [data.title],
        parent_id: [data.parent_id],
        user_has_menu: [data.user_has_menu],
        //index: [data.index],
        //index_child: [data.index_child],
        formControlKey: [data.formControlKey],
      });
    }
  }

  openNewRole(content, id = '') {
    this.settingsApiService.initRoleForm(id).subscribe(
      (res: any) => {
        if (res.success) {
          if (res.data.menu_previlages.create == 1) {
            this.Permissions = res.data.menus;
            this.initaddRoleForm(res.data.role);
            this.addmenu();
            this.modalService
              .open(content, { ariaLabelledBy: 'dialog001', size: 'xl' })
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
  onSubmitRoleForm() {
    if (!this.newRoleForm.valid) {
      return false;
    } else {
      // 2 - Call onFormSubmitting to handle setting the form as submitted and
      //     clearing the error and success messages array
      this.formStatus.onFormSubmitting();
      if (this.updateRoleId) {
        const subs_query_param = this.settingsApiService
          .updateRole(this.newRoleForm.value, this.updateRoleId)
          .subscribe(
            (res: any) => {
              this.updateRoleId = '';
              this.triggerSnackBar(res.message, 'Close');
              this.modalService.dismissAll();
              this.listRoles();
            },
            (errorResponse: HttpErrorResponse) => {
              const messages =
                extractErrorMessagesFromErrorResponse(errorResponse);
              this.triggerSnackBar(messages.toString(), 'Close');
            }
          );
        this.subscriptions.push(subs_query_param);
      } else {
        const subs_query_param = this.settingsApiService
          .addRole(this.newRoleForm.value)
          .subscribe(
            (res: any) => {
              this.triggerSnackBar(res.message, 'Close');
              this.modalService.dismissAll();
              this.listRoles();
            },
            (errorResponse: HttpErrorResponse) => {
              const messages =
                extractErrorMessagesFromErrorResponse(errorResponse);
              this.triggerSnackBar(messages.toString(), 'Close');
            }
          );
        this.subscriptions.push(subs_query_param);
      }
    }
  }

  changeRoleStatus(enable: boolean, id) {
    var status = 2;
    if (enable) {
      status = 1;
    }
    const subs_query_changeuser = this.settingsApiService
      .changeRoleStatus(status, id)
      .subscribe(
        (res: any) => {
          this.triggerSnackBar(res.message, 'Close');
        },
        (errorResponse: HttpErrorResponse) => {
          const messages = extractErrorMessagesFromErrorResponse(errorResponse);
          this.triggerSnackBar(messages.toString(), 'Close');
        }
      );
    this.subscriptions.push(subs_query_changeuser);
  }

  listRoles() {
    this.RolesList = merge(
      this.sortRoleList.sortChange,
      this.paginatorRoleList.page
    ).pipe(
      // startWith([undefined, ]),
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.settingsApiService.listRoles(
          this.sortRoleList.active,
          this.sortRoleList.direction,
          this.paginatorRoleList.pageIndex,
          this.paginatorRoleList.pageSize,
          this.filterValue
        );
      }),
      map((data) => {
        // Flip flag to show that loading has finished.
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLengthRole = data.data.recordsTotal;

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

  deleteModal(content, id) {
    this.deleteRoleId = id;
    this.modalService
      .open(content, { ariaLabelledBy: 'dialog001' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeModal();
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  deleteRole(id) {
    this.settingsApiService.deleteRole(id).subscribe(
      (res: any) => {
        if (res.success) {
          this.triggerSnackBar(res.message, 'Close');
          this.modalService.dismissAll();
          this.listRoles();
          this.deleteRoleId = '';
          this.roleConfirmationForDelete = false;
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
  closeModal() {
    this.updateRoleId = '';
    this.deleteRoleId = '';
    this.modalService.dismissAll();
  }

  resetPagingRole(): void {
    this.paginatorRoleList.pageIndex = 0;
  }

  filterRoles() {
    this.resetPagingRole();
    this.listRoles();
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
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  selectAllMenus(index, obj) {
    var stat = 0;
    if (obj.user_has_menu) {
      stat = 1;
    }
    this.LoopingVar[index].map((r) => {
      r.user_has_menu = obj.user_has_menu;
    });
  }
  SelectMenu(parent, child, obj) {
    if (!obj.user_has_menu) {
      this.LoopingVar[parent][0].user_has_menu = false;
      this.LoopingVar[parent][child].permission_view = 0;
      this.LoopingVar[parent][child].permission_create = 0;
      this.LoopingVar[parent][child].permission_edit = 0;
    } else if (
      this.LoopingVar[parent].length - 1 ===
      this.LoopingVar[parent].filter((r) => {
        return r.user_has_menu === true;
      }).length
    ) {
      this.LoopingVar[parent][0].user_has_menu = true;
    }
  }
  selectAllPermission(permission, index, obj) {
    var stat = 0;
    if (obj[permission]) {
      stat = 1;
    }
    this.LoopingVar[index].map((r) => {
      r[permission] = stat;
    });
  }
  SelectPermission(permission, parent, child, obj) {
    if (!obj[permission]) {
      this.LoopingVar[parent][0][permission] = 0;
      obj[permission] = 0;
    } else {
      obj[permission] = 1;
      if (
        this.LoopingVar[parent].length - 1 ===
        this.LoopingVar[parent].filter((r) => {
          return r[permission] === 1;
        }).length
      ) {
        //length matched
        this.LoopingVar[parent][0][permission] = 1;
      }
    }
  }
}
