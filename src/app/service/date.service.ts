import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  leftpad(val, resultLength = 2, leftpadChar = '0'): string {
    return (String(leftpadChar).repeat(resultLength)
          + String(val)).slice(String(val).length);
  }

  dateToString(date) {
    return this.leftpad(date.getDate(), 2) + '/' + this.leftpad(date.getMonth() + 1, 2) + '/' + date.getFullYear();
  }

  getToday() {
    return this.dateToString(new Date())
  }

  getTomorrow() {
    let date = new Date();
    date.setDate(date.getDate() + 1);
    return this.dateToString(date)
  }

  getYesterday() {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    return this.dateToString(date)
  }

  getLastWeek() {
    let curr = new Date; // get current date
    let first = curr.getDate() - curr.getDay() - 7 // First day is the day of the month - the day of the week
    let last = first + 6; // last day is the first day + 6

    let firstDay = this.dateToString(new Date(curr.setDate(first)))
    let lastDay = this.dateToString(new Date(curr.setDate(last)))

    return firstDay + ' ~ ' + lastDay
  }

  getNext7Days() {
    let curr = new Date; // get current date
    curr.setDate(curr.getDate() + 1);
    let last = new Date; // get current date
    last.setDate(curr.getDate() + 6);
    let firstDay = this.dateToString(curr)
    let lastDay = this.dateToString(last)
    return firstDay + ' ~ ' + lastDay
  }

  getThisMonth() {
    let date = new Date()
    let firstDay = this.dateToString(new Date(date.getFullYear(), date.getMonth(), 1))
    let lastDay = this.dateToString(new Date(date.getFullYear(), date.getMonth() + 1, 0))
    return firstDay + ' ~ ' + lastDay
  }

  getLastMonth() {
    let date = new Date()
    let firstDay = this.dateToString(new Date(date.getFullYear(), date.getMonth() - 1, 1))
    let lastDay = this.dateToString(new Date(date.getFullYear(), date.getMonth(), 0))
    return firstDay + ' ~ ' + lastDay
  }

  getThisQuarter() {
    let d = new Date()
    let quarter = Math.floor((d.getMonth() / 3))
    let firstDate = new Date(d.getFullYear(), quarter * 3, 1)
    let endDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + 3, 0)

    let firstDay = this.dateToString(firstDate)
    let lastDay = this.dateToString(endDate)
    return firstDay + ' ~ ' + lastDay
  }

  getDateRange(index): { startDate: moment.Moment, lastDate: moment.Moment} {
    let startDate = null, lastDate = null
    switch (index) {
      case 0://Today
          startDate = lastDate = moment()
          break
      case 1://Yesterday
          startDate = lastDate = moment().subtract(1, 'days')
          break
      case 2://Last Week
          startDate = moment().subtract(1, 'weeks').startOf('week')
          lastDate = moment().subtract(1, 'weeks').endOf('week')
          break
      case 3://This Month
          startDate = moment().clone().startOf('month')
          lastDate = moment().clone().endOf('month')
          break
      case 4://Last Month
          startDate = moment().subtract(1, 'months').startOf('month')
          lastDate = moment().subtract(1, 'months').endOf('month')
          break
      case 5://This Quarter
          startDate = moment().quarter(moment().quarter()).startOf('quarter');
          lastDate = moment().quarter(moment().quarter()).endOf('quarter');
          break
    }
    return {startDate, lastDate}
  }

  getEventTime(day: moment.Moment, time: string) {
    const date = day ? moment(day) : moment()
    if (time) {
      var tm = moment(time, ["h:mm A"])
      date.add(tm.hours(), 'hours').add(tm.minutes(), 'minutes') 
    }
    return date
  }

  getEventDate(day: moment.Moment, time: string) {
    return this.getEventTime(day, time).toDate()
  }

  private dateFormats = [
    {key: 'd-m-Y', value: 'DD-MM-YYYY'},
    {key: 'm-d-Y', value: 'MM-DD-YYYY'},
    {key: 'Y-m-d', value: 'YYYY-MM-DD'},
    {key: 'Y-d-m', value: 'YYYY-DD-MM'},
    {key: 'd M Y', value: 'DD MMM YYYY'},
    {key: 'M d Y', value: 'MMM DD YYYY'},
    {key: 'd F Y', value: 'DD MMM YYYY'},
    {key: 'F d Y', value: 'MMM DD YYYY'},
    {key: 'm\/d\/Y', value: 'MM/DD/YYYY'},
  ]
  getDateFormat(dateformat: string) {
    const format = this.dateFormats.find(it => it.key == dateformat)
    if (format) return format.value
    return 'DD MMM YYYY'
  }

  getTimeFormat(timeformat: string) {
    if (timeformat === '24-hours') {
      return 'HH:mm'
    }
    return 'hh:mm A'
  }
}
