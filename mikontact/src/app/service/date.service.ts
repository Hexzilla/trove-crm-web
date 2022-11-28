import { Injectable } from '@angular/core';

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
}
