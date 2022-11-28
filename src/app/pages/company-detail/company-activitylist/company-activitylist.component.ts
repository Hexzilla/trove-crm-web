import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SnackBarService } from '../../../shared/snack-bar.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DateService } from 'src/app/service/date.service';
import { SettingsApiService } from 'src/app/services/settings-api.service';
import * as moment from 'moment'
import { ContactApiService } from 'src/app/services/contact-api.service';

@Component({
  selector: 'app-company-activitylist',
  templateUrl: './company-activitylist.component.html',
  styleUrls: ['./company-activitylist.component.css'],
})
export class CompanyActivitylistComponent implements OnInit {
  @Input() organization = null
  @Input() activities = []
  @Output() editActivityEvent = new EventEmitter()
  activityType = 'all';

  constructor(
    private dateService: DateService,
    private settingsApiService: SettingsApiService,
    private contactService: ContactApiService,
    private modalService: NgbModal, 
    private sb: SnackBarService) {
  }
  
  ngOnInit(): void {
    console.log('activityList', this.activities, this.organization)
  }

  triggerSnackBar(message: string, action: string) {
    this.sb.openSnackBarBottomCenter(message, action);
  }

  getAssociateName(activity) {
    let name = ''
    if (activity.associate_names.length > 0) {
      name = activity.associate_names[0]
    }
    if (activity.associate_names.length > 1) {
      name += ` +${activity.associate_names.length - 1}`
    }
    return name
  }

  getActivityDate(activity) {
    const date = moment(activity.created_at)
    const dateformat = this.getDateFormat()
    const timeformat = this.getTimeFormat()
    return date.format(`${dateformat} ${timeformat}`)
  }

  getDateFormat() {
    const dateFormat = this.settingsApiService.getDateFormat()
    return this.dateService.getDateFormat(dateFormat)
  }

  getTimeFormat() {
    const dateFormat = this.settingsApiService.getTimeFormat()
    return this.dateService.getTimeFormat(dateFormat)
  }

  deleteActivity(activity) {
    const payload = {
      module_id: this.organization.id,
      type: activity.activity_name,
      id: activity.id
    }
    this.contactService
      .deleteActivity('organizations', payload)
      .subscribe((res: any) => {
        console.log('deleteActivity', res);
        this.triggerSnackBar(res.message, 'Close')
        if (res.success) {
          this.contactService.notifyCompanyDetail()
        }
      },
      err => {
        this.triggerSnackBar(err.error.message, 'Close')
      })
  }

  editActivity(activity) {
    this.editActivityEvent.emit(activity)
  }

  openModal(content, activity) {
    this.modalService
      .open(content, { ariaLabelledBy: 'dialog001' })
      .result.then(
        (result) => {
          result == 'confirm' && this.deleteActivity(activity)
        },
        (reason) => {
          console.log(`Dismissed ${reason}`)
        }
      );
  }
}
