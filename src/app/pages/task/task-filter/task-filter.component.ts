import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
import { DateService } from '../../../service/date.service'
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, take, tap } from 'rxjs/operators';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class Type {
  constructor(public name: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}
export interface createContact {
  name: string;
  isChecked?: boolean;
}
export interface createCompany {
  name: string;
  isChecked?: boolean;
}
// multi autocomplete
export class Contact {
  constructor(public name: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}

@Component({
  selector: 'app-task-filter',
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.css']
})
export class TaskFilterComponent implements OnInit {
  @Output() closeDialog = new EventEmitter();
  @Output() count = new EventEmitter<any>();
  contactCtrl = new FormControl();
  companyCtrl = new FormControl();
  filteredCont: Observable<createContact[]>;
  filteredComp: Observable<createCompany[]>;
  selectedCreatedBy: createContact[] = [];
  selectedCompany: createCompany[] = [];
  status: string
  statusTypes: string[] = ['All', 'Active', 'Inactive']
  filterCount: number = 0
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }
  createdBySelection(contact: createContact){
    if(contact.isChecked) {
      this.selectedCreatedBy = [...this.selectedCreatedBy, contact]
    }else {
      let index = this.selectedCreatedBy.findIndex(c => c.name === contact.name);
      this.selectedCreatedBy.splice(index,1);
    }
  }
  companySelection(contact: createCompany){
    if(contact.isChecked) {
      this.selectedCompany = [...this.selectedCompany, contact]
    }else {
      let index = this.selectedCompany.findIndex(c => c.name === contact.name);
      this.selectedCompany.splice(index,1);
    }
  }

  dateTypes: number[] = [0, 1, 2, 3, 4, 5, 6]
  dateTypeString: string[] = ['Today', 'Yesterday', 'Last Week', 'This month', 'Last month', 'This Quarter', 'Custom']
  dateType: number
  startDate: Date = null
  endDate: Date = null

  addDateTypes: number[] = [0, 1, 2, 3, 4, 5, 6]
  addDateTypeString: string[] = ['Today', 'Yesterday', 'Last Week', 'This month', 'Last month', 'This Quarter', 'Custom']
  addDateType: number
  addStartDate: Date = null
  addEndDate: Date = null

  dueDateTypes: number[] = [0, 1, 2, 3, 4]
  dueDateTypeString: string[] = ['Today', 'Tomorrow', 'Next 7 days', 'Overdue', 'Custom']
  dueDateType: number
  dueStartDate: Date = null
  dueEndDate: Date = null

  contactType: string = 'contact'

  contacts: createContact[] = [
    {
      name: 'Arkansas',
    },
    {
      name: 'California'
    },
    {
      name: 'Florida'
    },
    {
      name: 'Texas'
    }
  ];

  companys: createCompany[] = [
    {
      name: 'Company 1',
    },
    {
      name: 'Company 2'
    },
    {
      name: 'Company 3'
    },
    {
      name: 'Company 4'
    }
  ];

  types: Type[] = [
    new Type('Added by user'),
    new Type('Import from CSV'),
    new Type('Google contacts'),
    new Type('Twitter contacts'),
    new Type('Outlook contacts')
  ]

  // multi autocomplete

  constructor(private dateService: DateService) {
    this.filteredCont = this.contactCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.contacts.slice())
      );
      this.filteredComp = this.companyCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStatesComp(state) : this.companys.slice())
      );
  }


  ngOnInit(): void {

  }


  public displayArray(arr) {
    let ret = ''
    arr.length == 1 && (ret += arr[0])
    arr.length == 2 && (ret += arr[0] + ', ' + arr[1])
    arr.length > 2 && (ret += arr[0] + ', ' + arr[1] + ' +' + (arr.length - 2))
    return ret
  }

  clickType(e, type) {
    type.selected = e.checked
  }

  displaySelectedTypes() {
    let arr = []
    this.types.forEach(e => {
      e.selected && arr.push(e.name)
    })
    return this.displayArray(arr)
  }

  public getSelectedDate() {
    if (this.dateType == -1) {
      return ''
    }
    switch (this.dateType) {
      case 0:
        const today = this.dateService.getToday()
        return today + ' ~ ' + today
      case 1:
        const yesterday = this.dateService.getYesterday()
        return yesterday + ' ~ ' + yesterday
      case 2:
        return this.dateService.getLastWeek()
      case 3:
        return this.dateService.getThisMonth()
      case 4:
        return this.dateService.getLastMonth()
      case 5:
        return this.dateService.getThisQuarter()
      case 6:
        let firstDay = '', lastDay = ''
        this.startDate && (firstDay = this.dateService.dateToString(this.startDate))
        this.endDate && (lastDay = this.dateService.dateToString(this.endDate))
        return firstDay + ' ~ ' + lastDay
    }
  }

  public getAddSelectedDate() {
    if (this.addDateType == -1) {
      return ''
    }
    switch (this.addDateType) {
      case 0:
        const today = this.dateService.getToday()
        return today + ' ~ ' + today
      case 1:
        const yesterday = this.dateService.getYesterday()
        return yesterday + ' ~ ' + yesterday
      case 2:
        return this.dateService.getLastWeek()
      case 3:
        return this.dateService.getThisMonth()
      case 4:
        return this.dateService.getLastMonth()
      case 5:
        return this.dateService.getThisQuarter()
      case 6:
        let firstDay = '', lastDay = ''
        this.addStartDate && (firstDay = this.dateService.dateToString(this.addStartDate))
        this.addEndDate && (lastDay = this.dateService.dateToString(this.addEndDate))
        return firstDay + ' ~ ' + lastDay
    }
  }

  public getDueSelectedDate() {
    if (this.dueDateType == -1) {
      return ''
    }
    switch (this.dueDateType) {
      case 0:
        const today = this.dateService.getToday()
        return today + ' ~ ' + today
      case 1:
        const tomorrow =  this.dateService.getTomorrow();
        return tomorrow + ' ~ ' + tomorrow
      case 2:
          return this.dateService.getNext7Days()
      case 3:
        const yesterday = this.dateService.getYesterday()
        return yesterday
      case 4:
        let firstDay = '', lastDay = ''
        this.dueStartDate && (firstDay = this.dateService.dateToString(this.dueStartDate))
        this.dueEndDate && (lastDay = this.dateService.dateToString(this.dueEndDate))
        return firstDay + ' ~ ' + lastDay
    }
  }

  calculateFilterCount(): number {
    this.filterCount = 0;
    if(this.status) {
      this.filterCount += 1;
    }
    if(this.selectedCreatedBy.length > 0) {
      this.filterCount += 1;
    }
    if(this.selectedCompany.length > 0) {
      this.filterCount += 1;
    }
    if(this.dateType != -1 && (this.dateType || this.dateType == 0)) {
      this.filterCount += 1;
    }
    if(this.addDateType != -1 && (this.addDateType || this.addDateType == 0)) {
      this.filterCount += 1;
    }
    if(this.dueDateType != -1 && (this.dueDateType || this.dueDateType == 0)) {
      this.filterCount += 1;
    }
    if(this.displaySelectedTypes() != '') {
      this.filterCount += 1;
    }
    this.count.emit(this.filterCount);
    return this.filterCount;
  }

  clearAll() {
    this.clearType();
    this.clearStatus();
    this.clearCreatedBy();
    this.clearCompany();
    this.clearDate();
    this.clearAddDate();
    this.clearDueDate();
  }

  clearType() {
    this.types.forEach(e => {
      e.selected = false;
    })
  }

  public clearStatus() {
    this.status = undefined;
  }

  public clearCreatedBy() {
    this.selectedCreatedBy = [];
    this.filteredCont.pipe(
      tap(data => {
        data.forEach(c => {
          c.isChecked = false;
        })
      }),
      take(1)
    ).subscribe();
  }

  public clearCompany() {
    this.selectedCompany = [];
    this.filteredComp.pipe(
      tap(data => {
        data.forEach(c => {
          c.isChecked = false;
        })
      }),
      take(1)
    ).subscribe();
  }

  public clearDate() {
    this.dateType = -1
  }

  public clearAddDate() {
    this.addDateType = -1
  }

  public clearDueDate() {
    this.dueDateType = -1
  }



  private _filterStates(value: string): createContact[] {
    const filterValue = value.toLowerCase();

    return this.contacts.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterStatesComp(value: string): createContact[] {
    const filterValue = value.toLowerCase();

    return this.companys.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }

  filterCountChangedHandler(e) {
    this.filterCount = e
  }
}
