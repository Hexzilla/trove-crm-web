import { Component, OnInit, ViewChildren, QueryList, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Options } from "@angular-slider/ngx-slider";
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith,take, tap  } from 'rxjs/operators';
import { DateService } from '../../../service/date.service'
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

export class Source {
  constructor(public name: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}
@Component({
  selector: 'app-monthlychart-filter',
  templateUrl: './monthlychart-filter.component.html',
  styleUrls: ['./monthlychart-filter.component.css']
})
export class MonthlychartFilterComponent implements OnInit {


  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>

  // @Input() filterCount:number
  @Output() filterCountChanged: EventEmitter<number> = new EventEmitter();
  // @Input() listShow:boolean
  @Output() closeDialog = new EventEmitter();
  @Output() count = new EventEmitter<any>();
  contactCtrl = new FormControl();
  companyCtrl = new FormControl();
  filteredCont: Observable<createContact[]>;
  filteredComp: Observable<createCompany[]>;
  selectedCreatedBy: createContact[] = [];
  selectedCompany: createCompany[] = [];
  filterCount: number = 0
  myControl = new FormControl();
  searchOptions: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  minValue: number = 100;
  highValue: number = 9000;
  sliderOptions: Options = {
    floor: 0,
    ceil: 100000
  }

  contactActive: number = 0

  selectedPipe: string[] = []

  dateTypes: number[] = [0, 1, 2, 3, 4, 5, 6]
  dateTypeString: string[] = ['Today', 'Yesterday', 'Last Week', 'This month', 'Last month', 'This Quarter', 'Custom']
  dateType: number

  statusType: string = ''
  selectedSource: string[] = []

  public startDate: Date = null
  public endDate: Date = null

  scrollOptions = { autoHide: true, scrollbarMinSize: 30 }
  selectedDisplay = "pipe1"
  // multi autocomplete

  sources = [
    new Source('SMS'),
    new Source('Website'),
    new Source('News'),
    new Source('Test1'),
    new Source('Test2'),
  ]
  sourceAll: boolean = false

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

  calculateFilterCount(): number {
    this.filterCount = 0;
    if(this.statusType) {
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
     if(this.getSelectedSource() != '') {
       this.filterCount += 1;
    }
     if(this.selectedPipe.length > 0){
       this.filterCount += 1;
     }
     if(this.minValue != null && this.highValue != null){
       this.filterCount += 1;
     }
    this.count.emit(this.filterCount);
    return this.filterCount;
  }

  clearAll() {
    this.clearStatus();
    this.clearCreatedBy();
    this.clearCompany();
    this.clearDate();
    this.clearSource();
    this.clearPipe();
    this.clearValueClick();
  }

  public clearSource() {
    this.sources.forEach(e => {
      e.selected = false;
    })
    this.sourceAll= false
  }
  public clearDate() {
    this.dateType = -1
  }

  public clearStatus() {
    this.statusType = undefined;
  }

  public clearPipe() {
    this.selectedPipe = [];
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

  displayFn(value: Contact[] | string): string | undefined {
    return ""

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.searchOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  public clearValueClick() {
    this.minValue = null
    this.highValue = null
  }

  public clickDiscovery(item) {
    const index = this.selectedPipe.indexOf(item, 0);
    if (index > -1) {
      this.selectedPipe.splice(index, 1);
    } else {
      this.selectedPipe.push(item)
    }
  }

  public checkPipe(item) {
    const index = this.selectedPipe.indexOf(item, 0);
    if (index > -1) {
      return true
    } else {
      return false
    }
  }

  //source
  public sourceSelect(source) {
    source.selected = !source.selected
    this.sourceAll = this.sources != null && this.sources.every(t => t.selected);
  }

  //source
  public allSourceSelect(event) {
    const checked = event.checked
    this.sources.forEach(e => e.selected = checked)
  }

  //source
  getSelectedSource() {
    let arr = []
    this.sources.forEach(e => {
      e.selected && arr.push(e.name)
    })
    return this.displayArray(arr)
  }

  public displayArray(arr) {
    let ret = ''
    arr.length == 1 && (ret += arr[0])
    arr.length == 2 && (ret += arr[0] + ', ' + arr[1])
    arr.length > 2 && (ret += arr[0] + ', ' + arr[1] + ' +' + (arr.length - 2))
    return ret
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

  private _filterStates(value: string): createContact[] {
    const filterValue = value.toLowerCase();

    return this.contacts.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterStatesComp(value: string): createContact[] {
    const filterValue = value.toLowerCase();

    return this.companys.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }

}
