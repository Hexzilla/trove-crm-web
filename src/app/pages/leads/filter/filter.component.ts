import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { FormControl } from '@angular/forms';
import { map, startWith, take, tap } from 'rxjs/operators';
import { DateService } from '../../../service/date.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Subscription,
  Observable,
  of as observableOf,
  BehaviorSubject,
  combineLatest,
  merge,
} from 'rxjs';
import { SnackBarService } from '../../../shared/snack-bar.service';
import { extractErrorMessagesFromErrorResponse } from 'src/app/services/extract-error-messages-from-error-response';
import * as moment from 'moment';

export interface createContact {
  id: any;
  name: string;
  isChecked?: boolean;
}
export interface createCompany {
  id: any;
  name: string;
  isChecked?: boolean;
}
// multi autocomplete
export class Contact {
  constructor(public name: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}

export interface LeadFilters {
  filterCount: number
  minValue: number,
  highValue: number,
  sourceAll: boolean,
  sources: number[],
  selectedCreatedBy: number[],
  selectedCompany: number[],
  statusType: number,
  dateType: number,
  startDate: Date,
  endDate: Date,
  selectedPipe: string[],
  selectedStages: number[],
}
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit, OnChanges {
  @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;

  // @Input() filterCount:number
  @Output() filterCountChanged: EventEmitter<number> = new EventEmitter();
  @Input() listShow: boolean;
  @Output() closeDialog = new EventEmitter();
  @Output() count = new EventEmitter<any>();
  contactCtrl = new FormControl();
  companyCtrl = new FormControl();
  filteredCont: Observable<createContact[]>;
  filteredComp: Observable<createCompany[]>;
  //selectedCreatedBy: createContact[] = [];
  //selectedCompany: createCompany[] = [];
  //filterCount: number = 0;
  myControl = new FormControl();
  searchOptions: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  @Input() filters:LeadFilters /*= {
    filterCount: 0,
    minValue: 100,
    highValue: 9000,
    sourceAll: false,
    sources: [],
    selectedCreatedBy: [],
    selectedCompany: [],
    statusType: null,
    dateType: -1,
    startDate: null,
    endDate: null,
    selectedPipe: [],
    selectedStages: [],
  }*/
  @Output() filtersChange = new EventEmitter<LeadFilters>();
  dateFormat = 'DD/MM/YYYY'

  //@Output() messageEvent = new EventEmitter<any>();
  //@Output() messageEvent = new EventEmitter<LeadFilters>();

  @Input() filterData:any;

  //dateFrom="";
  //dateTo="";

  //@Output() public notifyParent: EventEmitter<any> = new EventEmitter();


  callParent() {
    //console.log("ok-changed");
    /*let arrSource = []; let arrCompany = []; let arrContacts = []
    this.sources.forEach((e) => {
      e.selected && arrSource.push(e.id);
    });
    this.selectedCreatedBy.forEach((e) => {
      arrContacts.push(e.id);
    });
    this.selectedCompany.forEach((e) => {
      arrCompany.push(e.id);
    });
    let obj = {
      lead_value:{
        min: this.minValue,
        max: this.highValue,
      }
    };
    if(this.listShow){
      obj['pipeline'] = {
        id: this.currentSelectedPipeline,
      }
      if(this.selectedStages.length > 0){
        obj['pipeline']['stages'] = this.selectedStages;
      }
    }
    if(arrSource.length > 0){
      obj['source'] = arrSource;
    }
    if(arrContacts.length > 0){
      obj['contact_users'] = arrContacts;
    }
    if(arrCompany.length > 0){
      obj['contact_organization'] = arrCompany;
    }
    if(this.statusType != "" && typeof this.statusType != 'undefined'){
      obj['status'] = [this.statusType];
    }
    if(this.dateFrom != "" && this.dateTo != ""){
      obj['modified'] = {
        from: moment(this.dateFrom, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        to: moment(this.dateTo, 'DD/MM/YYYY').format('YYYY-MM-DD')
      };
    }*/
    //console.log("Before Emit Object", obj);
    this.filters.filterCount = this.calculateFilterCount()
    this.filtersChange.emit(this.filters);
    //alert("Value Emitted");
  }

  //minValue: number = 100;
  //highValue: number = 9000;
  sliderOptions: Options = {
    floor: 0,
    ceil: 100000,
  };

  contactActive: number = 0;

  //selectedPipe: string[] = [];
  //selectedStages: number[] = [];

  dateTypes: number[] = [0, 1, 2, 3, 4, 5, 6];
  dateTypeString: string[] = [
    'Today',
    'Yesterday',
    'Last Week',
    'This month',
    'Last month',
    'This Quarter',
    'Custom',
  ];
  //dateType: number;

  //statusType: string = '';
  selectedSource: string[] = [];

  //public startDate: Date = null;
  //public endDate: Date = null;

  scrollOptions = { autoHide: true, scrollbarMinSize: 30 };
  @Input() currentSelectedPipeline: number;
  @Output() currentSelectedPipelineChange: EventEmitter<number> = new EventEmitter<number>();
  SelectedPipelineStages = [];
  // multi autocomplete

  //sources = [];
  //sourceAll: boolean = false;

  createdBySelection(contact) {
    if (contact.isChecked) {
      this.filters.selectedCreatedBy = [...this.filters.selectedCreatedBy, contact];
    } else {
      let index = this.filters.selectedCreatedBy.findIndex(
        (c) => c['name'] === contact.name
      );
      this.filters.selectedCreatedBy.splice(index, 1);
    }
    this.callParent();
  }
  companySelection(contact) {
    if (contact.isChecked) {
      this.filters.selectedCompany = [...this.filters.selectedCompany, contact];
    } else {
      let index = this.filters.selectedCompany.findIndex(
        (c) => c['name'] === contact.name
      );
      this.filters.selectedCompany.splice(index, 1);
    }
    this.callParent();
  }

  contacts: createContact[] = [
    {
      id: 0,
      name: 'Arkansas',
    },
    {
      id: 1,
      name: 'California',
    },
    {
      id: 2,
      name: 'Florida',
    },
    {
      id: 3,
      name: 'Texas',
    },
  ];

  companys: createCompany[] = [
    {
      id: 0,
      name: 'Company 1',
    },
    {
      id: 0,
      name: 'Company 2',
    },
    {
      id: 0,
      name: 'Company 3',
    },
    {
      id: 0,
      name: 'Company 4',
    },
  ];

  status: any[] =  [];
  leadValue: any[] = [];
  pipelines: any[] = [];

  constructor(
    private dateService: DateService,
    private sb: SnackBarService,
  ) {
    //console.log("constrctor start");
    //console.log(this.filteredCont);
  }
  ngOnChanges(){
    //console.log("filter ngOnchanges", this.filterData, this.filters);
    this.contacts = [];
    this.filterData.data.contacts.users.forEach(element => {
      this.contacts.push({
        id: element.id,
        name: element.full_name,
      });
    });
    this.companys = this.filterData.data.contacts.organizations;
    this.filters.minValue = this.filterData.data.lead_value.min;
    this.filters.highValue = this.filterData.data.lead_value.max;
    this.filters.sources = this.filterData.data.source;
    this.status = this.filterData.data.status;
    this.leadValue = this.filterData.data.lead_value;
    this.pipelines = this.filterData.data.pipeline;

    let pipelineObj = this.pipelines.find(obj => {
      return obj.id == this.currentSelectedPipeline
    });
    this.SelectedPipelineStages = pipelineObj.stages;

    if(this.filters){
     // console.log("if filters", this.filters);
    } else {
      //console.log("else filters");
    }

    this.filteredCont = this.contactCtrl.valueChanges.pipe(
      startWith(''),
      map((state) =>
        state ? this._filterStates(state) : this.contacts.slice()
      )
    );

    this.filteredComp = this.companyCtrl.valueChanges.pipe(
      startWith(''),
      map((state) =>
        state ? this._filterStatesComp(state) : this.companys.slice()
      )
    );
  }
  ngOnInit(): void {
    //console.log("child_component", this.filterData, this.filters);
  }

  ngAfterViewInit() {
    //console.log('filter ngAfterViewInit');
  }

  onPipelineChange(id){
    this.currentSelectedPipeline = id;
    this.currentSelectedPipelineChange.emit(this.currentSelectedPipeline);
    let pipelineObj = this.pipelines.find(obj => {
      if(obj.id == this.currentSelectedPipeline){
        return obj;
      }
      return false;
    });
    this.SelectedPipelineStages = pipelineObj.stages;
    this.callParent();
  }

  calculateFilterCount(): number {
    this.filters.filterCount = 0;
    if (this.filters.statusType) {
      this.filters.filterCount += 1;
    }
    if (this.filters.selectedCreatedBy.length > 0) {
      this.filters.filterCount += 1;
    }
    if (this.filters.selectedCompany.length > 0) {
      this.filters.filterCount += 1;
    }
    if (this.filters.dateType != -1 && (this.filters.dateType || this.filters.dateType == 0)) {
      this.filters.filterCount += 1;
    }
    if (this.getSelectedSource() != '') {
      this.filters.filterCount += 1;
    }
    if (this.filters.selectedPipe.length > 0) {
      this.filters.filterCount += 1;
    }
    if (this.filters.minValue != null && this.filters.highValue != null) {
      this.filters.filterCount += 1;
    }
    this.count.emit(this.filters.filterCount);
    return this.filters.filterCount;
  }

  clearAll() {
    this.clearStatus('clearAll');
    this.clearCreatedBy('clearAll');
    this.clearCompany('clearAll');
    this.clearDate('clearAll');
    this.clearSource('clearAll');
    this.clearPipe('clearAll');
    this.clearValueClick('clearAll');
    this.callParent();
  }

  public clearSource(type = "") {
    this.filters.sources.forEach((e) => {
      e['selected'] = false;
    });
    this.filters.sourceAll = false;
    if(type == ""){
      this.callParent();
    }
  }
  public clearDate(type = "") {
    this.filters.dateType = -1;
    if(type == ""){
      this.callParent();
    }
  }

  public clearStatus(type = "") {
    this.filters.statusType = undefined;
    if(type == ""){
      this.callParent();
    }
  }

  public clearPipe(type = "") {
    this.filters.selectedPipe = [];
    this.filters.selectedStages = [];
    if(type == ""){
      this.callParent();
    }
  }

  public clearCreatedBy(type = "") {
    this.filters.selectedCreatedBy = [];
    this.filteredCont
      .pipe(
        tap((data) => {
          data.forEach((c) => {
            c.isChecked = false;
          });
        }),
        take(1)
      )
      .subscribe();
      if(type == ""){
        this.callParent();
      }
  }

  public clearCompany(type = "") {
    this.filters.selectedCompany = [];
    this.filteredComp
      .pipe(
        tap((data) => {
          data.forEach((c) => {
            c.isChecked = false;
          });
        }),
        take(1)
      )
      .subscribe();
      if(type == ""){
        this.callParent();
      }
  }

  displayFn(value: Contact[] | string): string | undefined {
    return '';
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.searchOptions.filter(
      (option) => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  public clearValueClick(type="") {
    this.filters.minValue = this.leadValue['min'];
    this.filters.highValue = this.leadValue['max'];
    if(type == ""){
      this.callParent();
    }
  }

  public clickDiscovery(item) {
    //console.log(item);
    const index = this.filters.selectedPipe.indexOf(item.name, 0);
    if (index > -1) {
      this.filters.selectedPipe.splice(index, 1);
      this.filters.selectedStages.splice(index, 1);
    } else {
      this.filters.selectedPipe.push(item.name);
      this.filters.selectedStages.push(item.id);
    }
    this.callParent();
  }

  public checkPipe(item) {
    const index = this.filters.selectedPipe.indexOf(item.name, 0);
    if (index > -1) {
      return true;
    } else {
      return false;
    }
  }

  //source
  public sourceSelect(source) {
    //console.log(source);
    source.selected = false;
    if(source.selected){
      source.selected = true;
    }
    source.selected = !source.selected;
    this.filters.sourceAll =
      this.filters.sources != null && this.filters.sources.every((t) => t['selected']);
    this.callParent();
  }

  //source
  public allSourceSelect(event) {
    const checked = event.checked;
    this.filters.sources.forEach((e) => (e['selected'] = checked));
    this.callParent();
  }

  //source
  getSelectedSource() {
    let arr = [];
    this.filters.sources.forEach((e) => {
      e['selected'] && arr.push(e['name']);
    });
    return this.displayArray(arr);
  }

  public displayArray(arr) {
    let ret = '';
    arr.length == 1 && (ret += arr[0]);
    arr.length == 2 && (ret += arr[0] + ', ' + arr[1]);
    arr.length > 2 && (ret += arr[0] + ', ' + arr[1] + ' +' + (arr.length - 2));
    return ret;
  }

  changeLastmodified(type){
    //alert(this.dateType);
    //alert(type);
    /*if (this.filters.dateType == -1) {
      return '';
    }
    let date = "";
    let dateArray = [];
    switch (type) {
      case 0:
        const today = this.dateService.getToday();
        this.dateFrom = today;
        this.dateTo = today;
        this.callParent();
        return today + ' ~ ' + today;
      case 1:
        const yesterday = this.dateService.getYesterday();
        this.dateFrom = yesterday;
        this.dateTo = yesterday;
        this.callParent();
        return yesterday + ' ~ ' + yesterday;
      case 2:
        date =  this.dateService.getLastWeek();
        dateArray = date.split("~");
        this.dateFrom = dateArray[0];
        this.dateTo = dateArray[1];
        this.callParent();
        return date;
      case 3:
        date = this.dateService.getThisMonth();
        dateArray = date.split("~");
        this.dateFrom = dateArray[0];
        this.dateTo = dateArray[1];
        this.callParent();
        return date;
      case 4:
        date =  this.dateService.getLastMonth();
        dateArray = date.split("~");
        this.dateFrom = dateArray[0];
        this.dateTo = dateArray[1];
        this.callParent();
        return date;
      case 5:
        date =  this.dateService.getThisQuarter();
        dateArray = date.split("~");
        this.dateFrom = dateArray[0];
        this.dateTo = dateArray[1];
        this.callParent();
        return date;
      case 6:
        let firstDay = '',
          lastDay = '';
        this.filters.startDate &&
          (firstDay = this.dateService.dateToString(this.filters.startDate));
        this.filters.endDate && (lastDay = this.dateService.dateToString(this.filters.endDate));
        this.dateFrom = firstDay;
        this.dateTo = lastDay;
        this.callParent();
        return firstDay + ' ~ ' + lastDay;
    }*/
    if (this.filters.dateType == -1) {
      return ''
    }
    if (this.filters.dateType == 6) {
      let firstDay = '', lastDay = ''
      this.filters.startDate && (firstDay = this.dateService.dateToString(this.filters.startDate))
      this.filters.endDate && (lastDay = this.dateService.dateToString(this.filters.endDate))
      return firstDay + ' ~ ' + lastDay
    }
    const {startDate, lastDate} = this.dateService.getDateRange(this.filters.dateType)
    return startDate.format(this.dateFormat) + '~' + lastDate.format(this.dateFormat)
  }

  public getSelectedDate() {
    //console.log(this.dateType);
    if (this.filters.dateType == -1) {
      return '';
    }
    /*switch (this.dateType) {
      case 0:
        const today = this.dateService.getToday();
        return today + ' ~ ' + today;
      case 1:
        const yesterday = this.dateService.getYesterday();
        return yesterday + ' ~ ' + yesterday;
      case 2:
        return this.dateService.getLastWeek();
      case 3:
        return this.dateService.getThisMonth();
      case 4:
        return this.dateService.getLastMonth();
      case 5:
        return this.dateService.getThisQuarter();
      case 6:
        let firstDay = '',
          lastDay = '';
        this.startDate &&
          (firstDay = this.dateService.dateToString(this.startDate));
        this.endDate && (lastDay = this.dateService.dateToString(this.endDate));
        return firstDay + ' ~ ' + lastDay;
    }*/
    if (this.filters.dateType == 6) {
      let firstDay = '', lastDay = ''
      this.filters.startDate && (firstDay = this.dateService.dateToString(this.filters.startDate))
      this.filters.endDate && (lastDay = this.dateService.dateToString(this.filters.endDate))
      return firstDay + ' ~ ' + lastDay
    }
    const {startDate, lastDate} = this.dateService.getDateRange(this.filters.dateType)
    return startDate.format(this.dateFormat) + '~' + lastDate.format(this.dateFormat)
  }

  private _filterStates(value: string): createContact[] {
    const filterValue = value.toLowerCase();

    return this.contacts.filter(
      (state) => state.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filterStatesComp(value: string): createContact[] {
    const filterValue = value.toLowerCase();

    return this.companys.filter(
      (state) => state.name.toLowerCase().indexOf(filterValue) === 0
    );
  }
  triggerSnackBar(message: string, action: string) {
    this.sb.openSnackBarBottomCenter(message, action);
  }

  compareFunction(o1: any, o2: any) {
    return o1 == o2;
  }
}
