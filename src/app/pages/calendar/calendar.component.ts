import { Component, OnInit, Inject, ViewChild, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FullCalendarComponent, CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventMountArg } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import { AppointDialog, Appointment } from '../detail/appoint-dialog/appoint-dialog';
import { TaskDialog, NTask } from '../detail/task-dialog/task-dialog';
import { INITIAL_TASKS, createEventId } from './event-utils';
import * as moment from 'moment';

export interface Reminder {
  count: number,
  title: string,
  date: moment.Moment,
  time: string,
  tasks: any[]
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  calendarOptions: CalendarOptions = {
    plugins: [ timeGridPlugin ],
    headerToolbar: {
        left: '',
        center:'',
        right: '',
    },
    initialView: 'dayGridMonth',
    firstDay: 1,
    weekends: true,
    dayMaxEvents: 4,
    allDaySlot: false,
    slotDuration: '01:00:00',
    fixedWeekCount: false,
    aspectRatio: 2.0,
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventContent: this.handleEventContent.bind(this),
    eventDidMount: this.handleEventDidMount.bind(this),
    eventWillUnmount: this.handleEventWillUnmount.bind(this),
  }
  tasks: NTask[] = []
  appointments: Appointment[] = []
  currentEvents: EventApi[] = [];
  title = moment().format('MMM YYYY')
  filters = {
      all: true,
      task: true,
      appoint: true,
      reminder: true
  }
  dialogOpened = false;
  reminderTitle = ''
  reminderEvents = []

  constructor(
    public dialog: MatDialog,
    private renderer: Renderer2,
    private router: Router) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    INITIAL_TASKS.forEach(task => {
      this.addTask(task)
    })

    const appoint: Appointment = {
      id: undefined,
      title: 'New android phone presentation',
      location: '',
      description: '',
      start_date: moment('2021-06-09'),
      start_time: '10:00 AM',
      end_date: moment('2021-06-12'),
      end_time: '11:00 AM',
      contact: '',
      reminder_date: undefined,
      reminder_time: undefined,
    };
    this.addAppointment(appoint)
  }

  updateTitle() {
    const calendarApi = this.calendarComponent.getApi();
    if (calendarApi.view.type === 'dayGridMonth') {
      this.title = calendarApi.getCurrentData().viewTitle
    }
    else {
      const date = moment(calendarApi.getDate())
      this.title = `W${date.week()}-${date.format('MMM YYYY')}`
    }
  }

  openAppointDialog(isEdit: boolean, appoint: Appointment) {
    if (this.dialogOpened) return
    this.dialogOpened = true

    const dialogRef = this.dialog.open(AppointDialog, {
      width: '740px',
      data : { isEdit: isEdit, appointment: appoint }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog sent: ${result}`);
      this.dialogOpened = false
      if (result) {
        if (result.action == 'delete') {
          this.deleteAppointment(result.appointment)
        }
        else {
          this.addAppointment(result.appointment)
        }
      }
    })
  }

  openTaskDialog(isEdit: boolean, task: NTask) {
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '405px',
      data : { isEdit: isEdit, task: task }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog sent: ${result}`);
      this.dialogOpened = false
      if (result) {
        if (result.action == 'delete') {
          this.deleteTask(result.task)
        }
        else {
          this.addTask(result.task)
        }
      }
    })
  }

  private getEventDate(day: moment.Moment, time: string) {
    const date = day ? moment(day) : moment()
    if (time) {
      var tm = moment(time, ["h:mm A"])
      date.add(tm.hours(), 'hours').add(tm.minutes(), 'minutes')
    }
    return date.toDate()
  }

  private addAppointment(appoint: Appointment) {
    //console.log('addAppointment:', appoint);
    const calendarApi = this.calendarComponent.getApi()

    if (appoint.id) {
      const event = calendarApi.getEventById(appoint.id)
      event.setProp('title', appoint.title)
      event.setStart(this.getEventDate(appoint.start_date, appoint.start_time))
      event.setEnd(this.getEventDate(appoint.end_date, appoint.end_time))
      event.setExtendedProp('appointment', appoint)
      this.updateEventDuration()
    }
    else {
      appoint.id = createEventId()
      this.appointments.push(appoint)
      this.addAppointmentEvent(appoint, false)
    }
    this.updateReminders()
  }

  private addAppointmentEvent(appoint: Appointment, group: boolean) {
    const calendarApi = this.calendarComponent.getApi()
    calendarApi.unselect();

    let title = (appoint.start_time) ? `${appoint.start_time} ${appoint.title}` : appoint.title
    let startTime = this.getEventDate(appoint.start_date, appoint.start_time)
    let endTime = this.getEventDate(appoint.end_date, appoint.end_time)
    if (calendarApi.view.type === 'timeGridWeek') {
      endTime = moment(startTime).add(1, 'minute').toDate()
    }

    calendarApi.addEvent({
      id: appoint.id,
      title: title,
      start: startTime,
      end: endTime,
      extendedProps: {
        'appointment': appoint,
        'group': group
      },
      className: ['event-appoint']
    })
  }

  private deleteAppointment(appointment: Appointment) {
    if (appointment.id) {
      const calendarApi = this.calendarComponent.getApi()
      const event = calendarApi.getEventById(appointment.id)
      event.remove()
    }
    const index = this.appointments.indexOf(appointment)
    index >= 0 && this.appointments.splice(index, 1)
    this.updateReminders()
  }

  private addTask(task: NTask) {
    //console.log('addTask:', task);
    const calendarApi = this.calendarComponent.getApi()

    if (task.id) {
      const event = calendarApi.getEventById(task.id)
      event.setProp('title', task.title)
      event.setStart(this.getEventDate(task.due_date, task.due_time))
      event.setExtendedProp('task', task)
    }
    else {
      task.id = createEventId()
      this.tasks.push(task)
      this.addTaskEvent(task, false)
    }
    this.updateReminders()
  }

  private addTaskEvent(task: NTask, group: boolean) {
    const calendarApi = this.calendarComponent.getApi()
    calendarApi.unselect();

    const className = task.due_date <= moment() ? 'event-overdue' : 'event-future'
    calendarApi.addEvent({
      id: task.id,
      title: task.title,
      date: this.getEventDate(task.due_date, task.due_time),
      extendedProps: {
        'task': task,
        'group': group
      },
      className: [className]
    })
  }

  private deleteTask(task: NTask) {
    if (task.id) {
      const calendarApi = this.calendarComponent.getApi()
      const event = calendarApi.getEventById(task.id)
      event.remove()
    }
    const index = this.tasks.indexOf(task)
    index >= 0 && this.tasks.splice(index, 1)
    this.updateReminders()
  }

  prev() {
    this.reset()
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.prev();
    this.updateTitle();
  }

  next() {
    this.reset()
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
    this.updateTitle();
  }

  weekView() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.changeView('timeGridWeek');
    this.updateTitle()
    this.resetEvents()
    this.updateEventDuration()
    this.updateWeekViewEvents()
  }

  monthView() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.changeView('dayGridMonth');
    this.updateTitle()
    this.resetEvents()
    this.updateEventDuration()
  }

  private resetEvents() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.removeAllEvents()

    const tazks = [...this.tasks]
    this.tasks = []
    tazks.forEach(each => {
      each.id = undefined
      this.addTask(each)
    })

    const appoints = [...this.appointments]
    this.appointments = []
    appoints.forEach(each => {
      each.id = undefined
      this.addAppointment(each)
    })
  }

  handleEventClick(arg: EventClickArg) {
    if (arg.event.extendedProps.reminder) {
      const reminder: Reminder = arg.event.extendedProps.reminder;
      this.reminderTitle = reminder.date.format('MMM DD dddd');
      this.reminderEvents = reminder.tasks

      const reminderButton: HTMLElement = document.getElementById('reminderButton');
      this.renderer.setStyle(reminderButton, 'left', `${arg.jsEvent.x}px`);
      this.renderer.setStyle(reminderButton, 'top', `${arg.jsEvent.pageY - 46}px`);
      reminderButton.click();
      return
    }

    if (arg.event.extendedProps.group) {
      return
    }

    if (arg.event.extendedProps.task) {
      const target = arg.jsEvent.target;
      if (target['tagName'] === 'INPUT' || target['className'] === 'event-checkmark') {
        console.log('checkbox is clicked');
        return;
      }
      this.openTaskDialog(true, arg.event.extendedProps.task)
    }
    else if (arg.event.extendedProps.appointment) {
      this.openAppointDialog(true, arg.event.extendedProps.appointment)
    }
  }

  eventClicked(task) {
    if (!this.dialogOpened) {
      this.dialogOpened = true;

      if (task as NTask) {
        this.openTaskDialog(true, task as NTask)
      }
      else if (task as Appointment) {
        this.openAppointDialog(true, task as Appointment)
      }
    }
  }

  private eventElements = []
  private reset() {
    this.eventElements = []
  }

  handleEventDidMount(arg: EventMountArg) {
    if (arg.view.type == 'timeGridWeek') {
      const parentNode = arg.el.parentNode as HTMLElement
      this.eventElements.push({
        node: parentNode,
        event: arg.event
      })
    }
  }

  handleEventWillUnmount(arg: EventMountArg) {
    if (arg.view.type == 'timeGridWeek') {
      const parentNode = arg.el.parentNode as HTMLElement
      const index = this.eventElements.findIndex(el => el['node'] == parentNode)
      index >= 0 && this.eventElements.splice(index, 1)
    }
  }

  private updateWeekViewEvents() {
    //console.log('updateWeekViewEvents', this.eventElements)
    const positions = {}
    for (let each of this.eventElements) {
      const element = each['node'] as HTMLElement;
      const values = element.style['inset'].split(' ');

      let insetTop = 0;
      const event = each['event'] as EventApi;
      if (event.extendedProps.appointment) {
        const appoint: Appointment = event.extendedProps.appointment;
        if (appoint.start_date && appoint.end_date) {
          const delta = appoint.end_date.diff(appoint.start_date, 'day');
          if (delta > 1) {
            insetTop = -105 * delta;
          }
        }
      }

      let insetLeft = parseInt(values[0].replace('px', ''));
      if (positions.hasOwnProperty(insetLeft)) {
        const key = insetLeft;
        insetLeft += positions[key] * 26;
        positions[key]++;
      } else {
        positions[insetLeft] = 1;
      }

      const insetStyle = `${insetLeft}px ${insetTop}% 0% 0%`;
      element.setAttribute('style', `inset: ${insetStyle}; z-index: 1;`);
    }
  }

  private updateEventDuration() {
    const calendarApi = this.calendarComponent.getApi();
    const viewType = calendarApi.view.type
    //console.log('updateEventDuration', viewType)

    if (viewType === 'timeGridWeek') {
      [...this.currentEvents].forEach(event => {
        const appoint = event.extendedProps.appointment as Appointment;
        if (appoint) {
          const date = this.getEventDate(appoint.start_date, appoint.start_time);
          event.setEnd(moment(date).add(1, 'minute').toDate());
        }
      })
    }
    else {
      [...this.currentEvents].forEach(event => {
        const appoint = event.extendedProps.appointment as Appointment;
        if (appoint) {
          const date = this.getEventDate(appoint.end_date, appoint.end_time);
          event.setEnd(date);
        }
      })
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    //console.log('currentEvents', this.currentEvents, this.eventElements)

    const calendarApi = this.calendarComponent.getApi()
    if (calendarApi.view.type === 'timeGridWeek') {
      this.updateWeekViewEvents()
    }
  }

  handleEventContent(arg) {
    const divEl = document.createElement('label')
    divEl.className = 'event-content'

    if (arg.event.extendedProps.task) {
      const task: NTask = arg.event.extendedProps.task
      const inputClass = task.due_date < moment() ? 'overdue' : 'upcoming'
      if (arg.event.extendedProps.group) {
        divEl.innerHTML = `<span class='event-taskgroup'>${arg.event.title}</span>`
      }
      else {
        divEl.innerHTML = `<input type='checkbox' class='${inputClass}'><span class='event-checkmark'></span>`
        const div2 = document.createElement('label')
        div2.className = 'event-content'
        div2.innerHTML = `<span>${arg.event.title}</span>`
        return { domNodes: [ divEl, div2 ] }
      }
    }

    if (arg.event.extendedProps.reminder) {
      divEl.innerHTML = `<mat-icon role='img' class='mat-icon notranslate material-icons mat-icon-no-color reminder-icon' aria-hidden='true' data-mat-icon-type='font'>notifications</mat-icon><span class='event-checkmark'>${arg.event.title}</span>`
    }
    else if (arg.event.extendedProps.appointment) {
      divEl.innerHTML = `<span class='event-checkmark'>${arg.event.title}</span>`
    }

    return { domNodes: [ divEl ] }
  }

  showAllEvents() {
    if (this.filters.all) {
      this.filters.task = this.filters.appoint = this.filters.reminder = true
    }
    this.filterEvents()
  }

  updateFilter() {
    this.filters.all = (this.filters.task && this.filters.appoint && this.filters.reminder)
    this.filterEvents()
  }

  private filterEvents() {
    this.currentEvents.forEach(e => {
      if (e.extendedProps.task) {
        e.setProp('display', (this.filters.all || this.filters.task) ? 'auto' : 'none')
      }
      else if (e.extendedProps.appointment) {
        e.setProp('display', (this.filters.all || this.filters.appoint) ? 'auto' : 'none')
      }
      else if (e.extendedProps.reminder) {
        e.setProp('display', (this.filters.all || this.filters.reminder) ? 'auto' : 'none')
      }
    })
  }

  private updateReminders() {
    // First, remove reminders
    [...this.currentEvents].forEach(e => {
      if (e.extendedProps.reminder || e.extendedProps.group) {
        e.remove()
      }
    })

    const reminders = {}
    const addReminder = function(date: moment.Moment, time: string, task: any, isTask: boolean) {
      const title = date.format('YYYY-MM-DD')
      if (title in reminders) {
        const reminder: Reminder = reminders[title]
        reminder.count++
        reminder.tasks.push({...task, isTask: isTask})
      }
      else {
        const reminder: Reminder = {
          count: 1,
          title: title,
          date: date,
          time: time,
          tasks: [{...task, isTask: isTask}]
        }
        reminders[title] = reminder
      }
    }


    this.tasks.forEach(task => {
      task.reminder_date && addReminder(task.reminder_date, task.reminder_time, task, true)
    })
    this.appointments.forEach(appoint => {
      appoint.reminder_date && addReminder(appoint.reminder_date, appoint.reminder_time, appoint, false)
    })

    // Add reminders
    if (Object.keys(reminders).length > 0) {
      const calendarApi = this.calendarComponent.getApi()
      calendarApi.unselect();

      for (const key in reminders) {
        const reminder = reminders[key] as Reminder
        const date = this.getEventDate(reminder.date, reminder.time)
        const eventId = createEventId()
        calendarApi.addEvent({
          id: eventId,
          title: `${reminder.count} Reminders`,
          date: date,
          extendedProps: {
            'reminder': reminder
          },
          className: ['event-reminder']
        })
      }

      if (calendarApi.view.type === 'dayGridMonth') {
        for (const key in reminders) {
          const reminder = reminders[key] as Reminder
          //console.log('reminder', reminder)
          if (reminder.count < 3) {
            continue;
          }

          const items = this.currentEvents
            .filter(e => e.extendedProps.task || e.extendedProps.appointment)
            .filter(e => moment(e.start).dayOfYear() == reminder.date.dayOfYear())
          if (items && items.length > 0) {
            items.forEach(e => e.remove())
          }

          const tazks = reminder.tasks.filter((t) => t.isTask);
          if (tazks && tazks.length > 0) {
            this.addTaskEvent({
              id: null,
              title: `${tazks.length} Tasks`,
              content: '',
              due_date: reminder.date,
              due_time: undefined,
              reminder_date: undefined,
              reminder_time: undefined,
              owner_id: 0,
            }, true);
          }

          const appoints = reminder.tasks.filter((t) => !t.isTask);
          if (appoints && appoints.length > 0) {
            this.addAppointmentEvent({
              id: null,
              title: `${appoints.length} Appointments`,
              location: '',
              description: '',
              start_date: reminder.date,
              start_time: undefined,
              end_date: reminder.date,
              end_time: undefined,
              contact: '',
              reminder_date: undefined,
              reminder_time: undefined,
            }, true);
          }
        }
      }
    }
  }
}
