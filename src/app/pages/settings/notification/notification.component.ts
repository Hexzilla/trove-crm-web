import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import { SnackBarService } from '../../../shared/snack-bar.service';
import { extractErrorMessagesFromErrorResponse } from '../../../services/extract-error-messages-from-error-response';
import { FormStatus } from '../../../services/form-status';

import { SettingsApiService } from 'src/app/services/settings-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  /*Notification user checkbox*/
  isNotiUserAll: boolean;
  notificationUser: any = [
    {
      name: 'When deal is assigned',
      isSelected: false,
    },
    {
      name: 'When task is assigned',
      isSelected: false,
    },
    {
      name: 'When contact is assigned',
      isSelected: false,
    },
  ];
  /*Notification user checkbox*/
  /*Notification System checkbox*/
  isNotiSystemAll: boolean;
  notificationSystem: any = [
    {
      name: 'When import is completed',
      isSelected: false,
    },
    {
      name: 'When export is completed',
      isSelected: false,
    },
  ];
  /*Notification user checkbox*/
  constructor(
    private fb: FormBuilder,
    private sb: SnackBarService,
    private settingsApiService: SettingsApiService,
    private cdref: ChangeDetectorRef
  ) {
    this.initnotificationForm();
  }

  /*Notification user checkbox*/
  selectAllNotiUser() {
    this.notificationUser.map((r) => {
      r.isSelected = this.isNotiUserAll;
    });
  }
  unSelectNotiUser(isSelected) {
    if (!isSelected) {
      this.isNotiUserAll = false;
    } else if (
      this.notificationUser.length ===
      this.notificationUser.filter((r) => {
        return r.isSelected === true;
      }).length
    ) {
      this.isNotiUserAll = true;
    }
  }
  /*Notification user checkbox*/

  /*Notification System checkbox*/
  selectAllNotification(index, obj) {
    var stat = 0;
    if(obj.user_notification) {
      stat = 1;
    }
    this.LoopingVar[index][0].email_notification = stat;
    this.LoopingVar[index][0].push_notification = stat;
    this.LoopingVar[index].map((r) => {
      r.user_notification = obj.user_notification;
    });
  }
  SelectNotificationSetting(parent, child, obj) {
    if (!obj.user_notification) {
      this.isNotiSystemAll = false;
      this.LoopingVar[parent][0].user_notification = false;
      this.LoopingVar[parent][child].email_notification = 0;
      this.LoopingVar[parent][child].push_notification = 0;
    } else if (
      (this.LoopingVar[parent].length -1) ===
      this.LoopingVar[parent].filter((r) => {
        return r.user_notification === true;
      }).length
    ) {
      this.LoopingVar[parent][0].user_notification = true;
      this.isNotiSystemAll = true;
    }
  }
  /*Notification System checkbox*/
/**==================================================================== */
  notificationForm;
  notificationSettings = [];
  LoopingVar = [];
  formStatus = new FormStatus();
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.settingsApiService.getNotificationSettings().subscribe(
      (res: any) => {
        if (res.success) {
          if (res.data.menu_previlages.create == 1) {
            this.notificationSettings = res.data.notifications;
            this.addnotification();
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
  initnotificationForm() {
    this.notificationForm = this.fb.group({
      notifications: this.fb.array([]),
    });
  }
  private addnotification() {
    var self = this;
    var formControlKey = -1;
    this.notificationSettings.forEach(function (value, key) {
      var temparr = [];
      formControlKey++;
      var obj = {
        notification_id: value.id,
        title: value.title,
        user_notification: value.user_notification,
        email_notification: value.email_notification,
        push_notification: value.push_notification,
        parent_id: value.parent_id,
        formControlKey: formControlKey,
      };
      self.notificationForm.controls.notifications.push(self.addNotificationFormGroup(obj));
      temparr.push(obj);
      if (value.child_nofications.length > 0) {
        value.child_nofications.forEach(function (child_value, child_key) {
          formControlKey++;
          var obj = {
            notification_id: child_value.id,
            title: child_value.title,
            user_notification: child_value.user_notification,
            email_notification: child_value.email_notification,
            push_notification: child_value.push_notification,
            parent_id: child_value.parent_id,
            formControlKey: formControlKey,
          };
          self.notificationForm.controls.notifications.push(self.addNotificationFormGroup(obj));
          temparr.push(obj);
        });
      }
      self.LoopingVar[key] = temparr;
      //self.newRoleForm.controls.menus.push(temparr);
      //this.push(key + ': ' + value);
    });
    //this.Permissions.forEach((menu) => this.newRoleForm.controls.menus.push(this.addMenuFormGroup(menu)));
  }
  addNotificationFormGroup(data: any = []): FormGroup {
    if (data) {
      return this.fb.group({
        notification_id: [data.notification_id],
        user_notification: [data.user_notification],
        email_notification: [data.email_notification],
        push_notification: [data.push_notification],
        title: [data.title],
        parent_id: [data.parent_id],
        formControlKey: [data.formControlKey],
      });
    }
  }
  saveNotificationSetting(){
    if (!this.notificationForm.valid) {
      //console.log(this.registrationForm.controls.first_name.errors);
      return false;
    } else {
      this.formStatus.onFormSubmitting();
      var postNotifications = [];
      this.notificationForm.value.notifications.forEach(function (value, key) {
        postNotifications.push({
          notification_id: value.notification_id,
          email_notification: value.email_notification,
          push_notification: value.push_notification
        })
      });
      const subs_query_param = this.settingsApiService
        .saveNotificationSettings({notifications: postNotifications})
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
      this.subscriptions.push(subs_query_param);
    }
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
}
