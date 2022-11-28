import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import * as moment from 'moment';
import { DateService } from 'src/app/service/date.service';
import { SettingsApiService } from 'src/app/services/settings-api.service';

export class File {
  constructor(public name: string, public url: string, public description: string) {
  }
}

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit {
  @Output() addTaskClicked = new EventEmitter()
  @Output() addAppointClicked = new EventEmitter()
  @Output() appointStateChanged = new EventEmitter()
  @Output() taskStateChanged = new EventEmitter()
  @Input() leads_value
  @Input() associate_members
  @Input() user_files = []
  @Input() appointments = []
  @Input() tasks = []

  files: File[] = []

  constructor(
    private dateService: DateService,
    private settingsApiService: SettingsApiService,
  ) { 
    this.associate_members = {
      contacts: [],
      organizations: [],
      leads: []
    }
  }

  ngOnInit(): void {
    if (this.user_files) {
      this.files = this.user_files.map(url => {
        const filename = decodeURI(url.substring(url.lastIndexOf('/')+1))
        return new File(filename, url, '')
      })
    }
  }

  getFileIcon(filename: string) {
    const ext = filename.substring(filename.lastIndexOf('.')+1)
    switch (ext) {
      case 'doc': case 'docx':
        return '/assets/images/word-icon.svg';
      case 'xls': case 'xlsx':
        return '/assets/images/excel-icon.svg';
      case 'pdf':
        return '/assets/images/pdf-icon.svg';
      case 'jpg': case 'jpeg':
      case 'png': case 'bmp':
      case 'svg':
        return '/assets/images/pdf-icon.svg';
      default:
        return '/assets/images/pdf-icon.svg';
    }
  }

  downloadFile(file: File) {
    console.log('downloadfile', file)
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', file.url);
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  addAppoint() {
    console.log('add appoint')
    this.addAppointClicked.emit()
  }

  editAppoint(appoint) {
    console.log('Edit appoint', appoint)
    this.addAppointClicked.emit(appoint)
  }

  addTask() {
    console.log('add task')
    this.addTaskClicked.emit()
  }

  editTask(task) {
    console.log('edit task', task)
    this.addTaskClicked.emit(task)
  }

  changeAppointState(appoint, event: MatCheckboxChange) {
    this.appointStateChanged.emit({
      appointment: appoint,
      checked: event.checked
    })
  }

  changeTaskState(task, event: MatCheckboxChange) {
    console.log('changeTaskState', event);
    this.taskStateChanged.emit({
      task: task,
      checked: event.checked
    })
  }

  isPastDateAppoint(appoint) {
    const endDate = moment(appoint.end_date_time)
    return endDate < moment()
  }

  upcomingNotification(appoint) {
    const reminderDate = moment(appoint.reminder_date_time)
    return reminderDate.diff(moment(), 'seconds') > 0
  }

  getAppointmentIcon(appoint) {
    if (this.upcomingNotification(appoint)) {
      return 'notification_important'
    }
    return 'calendar_today'
  }

  getAppointDate(appoint) {
    let dateTime = moment(appoint.start_date_time)
    if (this.upcomingNotification(appoint)) {
      dateTime = moment(appoint.reminder_date_time)
    }

    const timeformat = this.getTimeFormat()
    const dateformat = this.getDateFormat()

    if (moment().isSame(dateTime, 'date')) {
      return `Today at ${dateTime.format(timeformat)}`
    }
    if (moment().add(1, 'days').isSame(dateTime, 'd')) {
      return `Tomorrow at ${dateTime.format(timeformat)}`
    }
    return moment(appoint.start_date).format(dateformat)
  }

  isPastDateTask(task) {
    const endDate = moment(task.due_date_time)
    return endDate < moment()
  }

  getTaskDate(appoint) {
    let dateTime = moment(appoint.due_date_time)
    if (this.upcomingNotification(appoint)) {
      dateTime = moment(appoint.reminder_date_time)
    }

    const timeformat = this.getTimeFormat()
    const dateformat = this.getDateFormat()

    if (moment().isSame(dateTime, 'date')) {
      return `Today at ${dateTime.format(timeformat)}`
    }
    if (moment().add(1, 'days').isSame(dateTime, 'd')) {
      return `Tomorrow at ${dateTime.format(timeformat)}`
    }
    return moment(appoint.due_date_time).format(dateformat)
  }

  private getTimeFormat() {
    const timeformat = this.settingsApiService.getTimeFormat()
    return this.dateService.getTimeFormat(timeformat) 
  }

  private getDateFormat() {
    const dateformat = this.settingsApiService.getDateFormat()
    return this.dateService.getDateFormat(dateformat)
  }

  getLeadsTotalValue() {
    return (this.leads_value?.total_value | 0.0).toFixed(2)
  }

  getLeadsExpectValue() {
    return (this.leads_value?.expected_value | 0.0).toFixed(2)
  }
}
