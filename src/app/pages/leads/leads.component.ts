import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FormControl } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { LeadApiService } from 'src/app/services/lead-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Subscription,
  Observable,
  of as observableOf,
  BehaviorSubject,
  combineLatest,
  merge,
  Subject,
} from 'rxjs';
import { SnackBarService } from '../../shared/snack-bar.service';
import { extractErrorMessagesFromErrorResponse } from 'src/app/services/extract-error-messages-from-error-response';
import { LeadFilters } from './filter/filter.component';
import { DateService } from '../../service/date.service'
import * as moment from 'moment';
@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css'],
})
export class LeadsComponent implements OnInit, AfterViewInit {
  @ViewChild('drawer') drawer
  filters: LeadFilters = {
    filterCount: 0,
    minValue: null,
    highValue: null,
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
  }
  dateFormat = 'DD/MM/YYYY'
  lastQuery: any = {}

  scrollOptions = { autoHide: true, scrollbarMinSize: 50 };
  showFilter: boolean = false;
  listShow: boolean = false;
  stages: string[] = [
    'Discovery',
    'Qualified',
    'Evolution',
    'Negotiation',
    'Closed',
  ];

  discovery: number[] = [100, 2, 3, 4, 5];
  qualified: number[] = [1, 2];
  evolution: number[] = [1];
  negotiation: number[] = [1];
  closed: number[] = [1, 2, 3];

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  active: number = 1;
  private subscriptions: Subscription[] = [];

  filterCount: number = 0;
  viewLeads = 'pipe1';
  constructor(
    private router: Router,
    private sb: SnackBarService,
    private LeadApiService: LeadApiService,
    private cdref: ChangeDetectorRef,
    private dateService: DateService,
  ) {}

  currentSelectedPipeline:number = 0;
  pipelineMaster = [];
  totalLead = 0;
  totalValue = 0;
  avgValue = 0;

  Leads: Observable<any[]>;
  StagesForDrag = [];
  connectedTo = [];
  canShow = true;
  filterObj$ = {};
  //filterObj$ = new BehaviorSubject<any>({});
  searchValue = '';

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  pageSize = 10
  recordsTotal = 0
  items = []
  allItems = []

  filterData;

  ngOnChanges() {
    //console.log('grid ngOnChanges');
    //console.log(this.child.minValue);
  }
  ngAfterViewInit() {
    //console.log('ngAfterViewInit');
    //setInterval(function(){  }, 3000);
  }

  ngOnInit(): void {
    //this.triggerSnackBar('ngOninit', 'Close');
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    const subs_query_param = this.LeadApiService.getFilterValues().subscribe(
      (res: any) => {
        if (res.success) {
          //console.log("getFilterValues", res);
          this.filterData = res;
          this.pipelineMaster = res.data.pipeline;
          this.currentSelectedPipeline = this.pipelineMaster[0].id;
          //this.fetchLeadGridView();
          this.applyFilter();
          //this.triggerSnackBar(res.message, 'Close');
        } else {
          this.triggerSnackBar(res.message, 'Close');
        }
      },
      (errorResponse: HttpErrorResponse) => {
        const messages = extractErrorMessagesFromErrorResponse(errorResponse);
        this.triggerSnackBar(messages.toString(), 'Close');
      }
    );
    this.subscriptions.push(subs_query_param);
  }
  /*async getFilterData(){
    console.log("getFiltersValue");
    const subs_query = this.LeadApiService.getFilterValues().subscribe(
      (res: any) => {
        console.log("getFilterResult",res);
        if (res.success) {
          this.outputFilterData = res;
          return true;
        } else {
          this.triggerSnackBar(res.message, 'Close');
        }
        return false;
      },
      (errorResponse: HttpErrorResponse) => {
        const messages = extractErrorMessagesFromErrorResponse(errorResponse);
        this.triggerSnackBar(messages.toString(), 'Close');
        return false;
      }
    );
    this.subscriptions.push(subs_query);
  }*/
  receivefilters(filters: LeadFilters) {
    this.filters = filters;
    //console.log("receivedFilters", filters);
    this.applyFilter();
    //this.fetchLeadGridView();
  }

  update() {
    this.lastQuery = {}
    this.listShow ? this.showList() : this.showGrid()
  }

  applyFilter() {
    let query = { }
    if (this.searchValue) {
      query['search'] = this.searchValue
    }
    if(this.listShow){
      query['pipeline'] = {
        id: this.currentSelectedPipeline,
      }
    } else {
      query['pipeline_id'] = this.currentSelectedPipeline
    }

    const filters = this.filters
    if (filters) {
      let arrSource = []; let arrCompany = []; let arrContacts = []
      this.filters.sources.forEach((e) => {
        e['selected'] && arrSource.push(e['id']);
      });
      this.filters.selectedCreatedBy.forEach((e) => {
        arrContacts.push(e['id']);
      });
      this.filters.selectedCompany.forEach((e) => {
        arrCompany.push(e['id']);
      });
      if(this.filters.minValue && this.filters.highValue){
        query['lead_value'] = {
            min: this.filters.minValue,
            max: this.filters.highValue,
        };
      }

      if(this.listShow){
        if(this.filters.selectedStages.length > 0){
          query['pipeline']['stages'] = this.filters.selectedStages;
        }
      }
      if(arrSource.length > 0){
        query['source'] = arrSource;
      }
      if(arrContacts.length > 0){
        query['contact_users'] = arrContacts;
      }
      if(arrCompany.length > 0){
        query['contact_organization'] = arrCompany;
      }
      if (filters.dateType >= 0) {
        let startDate = null, lastDate = null
        if (filters.dateType == 6) {
          startDate = moment(this.filters.startDate, this.dateFormat).format('YYYY-MM-DD')
          lastDate = moment(this.filters.endDate, this.dateFormat).format('YYYY-MM-DD')
        }
        else {
          const dateRange = this.dateService.getDateRange(this.filters.dateType)
          startDate = moment(dateRange.startDate, this.dateFormat).format('YYYY-MM-DD')
          lastDate = moment(dateRange.lastDate, this.dateFormat).format('YYYY-MM-DD')
        }
        query['modified'] = {from: startDate, to: lastDate}
      }
      if(this.filters.statusType && typeof this.filters.statusType != 'undefined'){
        query['status'] = [this.filters.statusType];
      }
      console.log('Lead - applyFilter', filters, "Query=", query);
    }

    //console.log('Lead - applyFilter, query=', query, this.lastQuery)

    // Compare query
    if (!this.compareQuery(this.lastQuery, query)) {
      //console.log("Query and Last query not same", query, this.lastQuery);
      this.lastQuery = query
      this.items = []
      if (this.listShow) this.fetchLeadListView(query)
      else this.fetchLeadGridView(query)
    }
  }

  compareQuery(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
    return true;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(
      (option) => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  public activeClass(num) {
    if (num == this.active) return 'activeBtn';
    else return '';
  }

  public setActive(num) {
    //'set active', num);
    this.active = num;
    if (num == 1) {
      this.options = ['One', 'Two', 'Three'];
    } else if (num == 2) {
      this.options = ['Four', 'Five', 'Six'];
    } else if (num == 3) {
      this.options = ['Seven', 'Eight', 'Nine'];
    }
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  public onSelectionChange(event) {
    //console.log(event.option.value);
  }

  showList() {
    this.listShow = true;
    this.applyFilter();
    //this.fetchLeadListView();
  }

  showGrid() {
    this.listShow = false;
    this.showFilter = false;
    this.applyFilter();
    //this.fetchLeadGridView();
  }

  dropped(id, event: CdkDragDrop<string[]>) {
    //alert(id);
    //console.log(event);
    //console.log(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      //console.log('else');
      /*console.log(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      console.log(
        'Moved Data is',
        event.previousContainer.data[event.currentIndex]
      );*/
      let lead_id = event.previousContainer.data[event.currentIndex]['id'];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const subs_query_param = this.LeadApiService.changeLeadStage(lead_id, id).subscribe(
        (res: any) => {
          if (res.success) {
            //console.log(res);
            this.triggerSnackBar(res.message, 'Close');
          } else {
            this.triggerSnackBar(res.message, 'Close');
          }
        },
        (errorResponse: HttpErrorResponse) => {
          const messages = extractErrorMessagesFromErrorResponse(errorResponse);
          this.triggerSnackBar(messages.toString(), 'Close');
        }
      );
      this.subscriptions.push(subs_query_param);
    }
  }

  clickCard() {
    this.router.navigate(['/pages/lead_detail']);
  }

  filterCountChangedHandler(e) {
    //alert('filterCountChangedHandler');
    this.filterCount = e;
    //alert(this.child.minValue);
  }

  async clickFilter() {
    //let isData = await this.getFilterData();
    //console.log(this.filterData);
    this.showFilter = true;
  }

  onPipelineChange() {
    this.applyFilter();
  }

  search(searchvalue: string) {
    this.applyFilter();
  }

  fetchLeadGridView(query) {
    //alert("fetchLeadGridView");
    this.StagesForDrag = [];
    //console.log(this.filterObj$);
    /*this.Leads = combineLatest(this.filterObj$)
      .pipe(
        // startWith([undefined, ]),
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          alert("Yen call agala?");
          return this.LeadApiService.listLeadGridView(this.filterObj$);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.data.recordsTotal;
          this.triggerSnackBar(data.message, 'Close');
          if(data.data.data.length > 0){
            this.canShow = true;
            console.log("listLeadGridView");
            console.log(data);
            console.log(this.Leads);
            this.totalLead = data.data.summary.total_leads;
            this.totalValue = data.data.summary.total_value;
            this.avgValue = data.data.summary.lead_average;
          } else {
            this.canShow = false;
            this.triggerSnackBar('No Records found', 'Close');
          }

          return data.data.data;
        }),
        catchError((err) => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          console.log(err);
          return observableOf([]);
        })
    );*/

    //this.filterObj$['pipeline_id'] = this.currentSelectedPipeline;
    //this.filterObj$['search'] = this.searchValue;
    this.LeadApiService.listLeadGridView(query).subscribe(
      (res: any) => {
        if (res.success) {
          if (res.data.data.length > 0) {
            this.Leads = res.data.data;
            //console.log('listLeadGridView');
            //console.log(res);
            //console.log(this.Leads);
            this.totalLead = res.data.summary.total_leads;
            this.totalValue = res.data.summary.total_value;
            this.avgValue = res.data.summary.lead_average;
            this.Leads.forEach((e) => {
              let leadList = [];
              e['leads'].forEach((element) => {
                leadList.push({
                  id: element.id,
                  name: element.name,
                  organizations_name: element.organizations.name,
                  currency_symbol: element.currency.symbol,
                  currency_value: element.currency_value,
                  owner_full_name: element.owner.full_name,
                  created_at: element.created_at,
                });
              });
              this.StagesForDrag.push({
                id: e['id'],
                idref: 'Lead-' + e['id'],
                name: e['name'],
                lead_list: leadList,
              });
            });
            for (let stage of this.StagesForDrag) {
              this.connectedTo.push(stage.idref);
            }
            this.canShow = true;
            //console.log('stagesList');
            //console.log(this.StagesForDrag);
          } else {
            this.canShow = false;
            this.triggerSnackBar('No Records found', 'Close');
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

  private fetchLeadListView(query) {
    this.items = [];
    const subs_query_param = this.LeadApiService
      .getLeadList(query)
      .subscribe((res: any) => {
        //console.log('fetchLeadListView', res)
        if (!res.success) {
          this.triggerSnackBar(res.message, 'Close')
          return
        }
        this.recordsTotal = res.data.recordsTotal
        const items = res.data.data.map(item => {
          return {...item, Lead: true}
        })
        this.items = this.items.concat(items)
        this.allItems = this.items
        //this.updateOwners()
      },
      err => {
        this.triggerSnackBar(err.error.message, 'Close')
      })
      this.subscriptions.push(subs_query_param);
  }

  triggerSnackBar(message: string, action: string) {
    this.sb.openSnackBarBottomCenter(message, action);
  }

  compareFunction(o1: any, o2: any) {
    return o1 == o2;
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
