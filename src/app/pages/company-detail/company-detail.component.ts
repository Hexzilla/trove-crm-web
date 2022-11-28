import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog} from '@angular/material/dialog';
import { CompanyDialog } from 'src/app/shared/header/header.component';
import { TaskDialog } from '../detail/task-dialog/task-dialog';
import { AppointDialog } from '../detail/appoint-dialog/appoint-dialog';
import { SnackBarService} from 'src/app/shared/snack-bar.service'
import { ContactApiService } from 'src/app/services/contact-api.service';
import { SettingsApiService } from 'src/app/services/settings-api.service';
import { DateService } from 'src/app/service/date.service';
import * as moment from 'moment'
import sample from './sample.company'

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css'],
})
export class CompanyDetailComponent implements OnInit {
  @Input() company = null;
  @Output() backEvent = new EventEmitter()

  organization = null;
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 };
  status = 'active';
  selectedActivity = null

  constructor(
    private dateService: DateService,
    private settingsApiService: SettingsApiService,
    private contactService: ContactApiService,
    private sb: SnackBarService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.setCompany(sample)
  }

  ngOnInit(): void {
    this.contactService.companyDetailObserver.subscribe(() => this.update());
    this.organization = this.company.organization;
  }

  triggerSnackBar(message: string) {
    this.sb.openSnackBarBottomCenter(message, 'Close');
  }

  setCompany(data: any) {
    this.company = data;
    this.organization = this.company.organization;
  }

  update() {
    this.contactService
      .getCompanyDetial(this.organization.id)
      .subscribe((res: any) => {
        console.log('refresh', res);
        if (res.success) {
          this.setCompany(res.data)
        }
      });
  }

  goToList() {
    //this.router.navigate(['/pages/company']);
    this.backEvent.emit()
  }

  getFullAddress() {
    const c = this.organization;
    const address = [c.address, c.city, c.state, c.country_id?.name].filter(i => i).join(', ');
    return address || '-';
  }

  getCreatedDate() {
    const dateFormat = this.settingsApiService.getDateFormat()
    const format = this.dateService.getDateFormat(dateFormat)
    const date = moment(this.organization.created_at);
    return date.format(format);
  }

  openTaskDialog(isEdit: boolean, task?: any) {
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '420px',
      data: {
        isEdit: isEdit,
        task: task,
        associate_members: this.company.associate_members,
        associate_to: { id: this.organization.id, type: 'company'},
        owners: this.company.owner,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      console.log('Dialog sent', res);
      if (res) {
        if (res.state == 'deleted') this.taskDeleted(res.task)
        else this.contactService.notifyCompanyDetail()
      }
    });
  }

  openAppointDialog(isEdit: boolean, appointment?: any) {
    const dialogRef = this.dialog.open(AppointDialog, {
      width: '740px',
      data: {
        isEdit: isEdit,
        appointment: appointment,
        associate_members: this.company.associate_members,
        associate_to: { id: this.organization.id, type: 'company'}
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      console.log('Dialog sent', res);
      if (res) {
        if (res.state == 'deleted') this.appointDeleted(res.appoint)
        else this.contactService.notifyCompanyDetail()
      }
    });
  }

  addAppointClicked(appoint) {
    const isEdit: boolean = (appoint !== undefined)
    this.openAppointDialog(isEdit, appoint)
  }

  appointDeleted(appoint) {
    const index = this.company.appointments.findIndex(it => it.id === appoint.id)
    index >= 0 && this.company.appointments.splice(index, 1)
  }

  addTaskClicked(task) {
    const isEdit: boolean = (task !== undefined)
    this.openTaskDialog(isEdit, task)
  }

  taskDeleted(task) {
    const index = this.company.tasks.findIndex(it => it.id === task.id)
    index >= 0 && this.company.tasks.splice(index, 1)
  }

  appointStateChanged({appointment, checked}) {
    const payload = {
      id: appointment.id,
      associate_id: this.organization.id,
      status: checked ? 1 : 0,
    }
    this.contactService
      .updateAppointmentState(appointment.id, payload)
      .subscribe((res: any) => {
        console.log('appointStateChanged', res);
        if (res.success) {

        }
      });
  }

  taskStateChanged({task, checked}) {
    const payload = {
      id: task.id,
      associate_id: this.organization.id,
      status: checked ? 1 : 0,
    }
    this.contactService
      .updateTaskState(task.id, payload)
      .subscribe((res: any) => {
        console.log('appointStateChanged', res);
        if (res.success) {

        }
      });
  }

  editCompany() {
    const openCreateCompanyDialog = () => {
      const dialogRef = this.dialog.open(CompanyDialog, {
        width: '560px',
        autoFocus: false,
        data: { isEdit: true, company: this.organization },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (result.state == 'deleted') {
            this.contactService.notifyCompany();
            this.goToList();
          } else {
            this.company.organization = result.company;
            this.organization = result.company;
          }
        }
      });
    };

    if (this.contactService.companyData) {
      openCreateCompanyDialog();
      return;
    }

    this.contactService.getCompanies().subscribe((res: any) => {
      if (!res.success) {
        this.triggerSnackBar(res.message)
        return;
      }
      if (res.data.menu_previlages.create !== 1) {
        this.triggerSnackBar("You don't have permission")
        return;
      }
      this.contactService.companyData = res.data;
      openCreateCompanyDialog();
    });
  }

  companyStatusChanged(value) {
    const payload = {
      id: this.organization.id,
      status_id: (value === 'Active') ? 1 : 2
    }
    this.contactService
      .updateCompanyState(this.organization.id, payload)
      .subscribe((res: any) => {
        this.triggerSnackBar(res.message)
      })
  }

  editActivity(activity) {
    this.selectedActivity = activity
  }

  addActivityEvent(event) {
    console.log('addActivity', event)
    
    const payload = this.addOrganizationId(event.data)
    console.log('addActivity.payload', payload)

    let observer = null
    if (event.type === 'note') observer = this.contactService.createCompanyNote(payload)
    else if (event.type === 'email') observer = this.contactService.createCompanyEmail(payload)
    else if (event.type === 'call') observer = this.contactService.createCompanyCall(payload)

    observer.subscribe((res: any) => {
      console.log('addActivity', res);
      this.triggerSnackBar(res.message)
      if (res.success) {
        this.contactService.notifyCompanyDetail()
      }
    });
  }

  private addOrganizationId(data) {
    const payload = {...data}
    console.log('createNote.organization', this.organization)

    const notes_to = payload.notes_to
    if (notes_to.organizations) {
      if (!notes_to.organizations.find(it => it == this.organization.id)) {
        notes_to.organizations.push(this.organization.id)
      }
    }
    else {
      notes_to['organizations'] = [this.organization.id]
    }

    return payload
  }
}
