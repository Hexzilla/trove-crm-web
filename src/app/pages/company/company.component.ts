import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { SnackBarService} from '../../shared/snack-bar.service'
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ContactApiService } from '../../services/contact-api.service';
import { CompanyFilters, CompanyOwner } from './filter/filter.component';
import { DateService } from '../../service/date.service'
import * as moment from 'moment';
import { SettingsApiService } from 'src/app/services/settings-api.service';
import { HttpErrorResponse } from '@angular/common/http';

export interface item {
  id: number;
  name: string;
  owner: string;
  contactCount: number;
  email: string;
  companyName: string;
  company: boolean;
  last: Date;
  city: string;
}

export interface selectedData {
  items: item[]
}

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  @ViewChild('drawer') drawer

  showFilter:boolean = false
  filters: CompanyFilters = null
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }
  hoveredItem = null

  pageSize = 10
  recordsTotal = 0
  items = []
  companyOwners: CompanyOwner[] = []
  selectedItems: item[] = []
  currentCategory = null
  lastQuery: any = {}

  listShow: boolean = false
  closeResult = '';

  showDetails = false
  companyDetails = null
  subscriptions: Subscription[] = [];

  constructor(
    private modalService: NgbModal,
    private settingsApiService: SettingsApiService,
    private contactService: ContactApiService,
    public dialog: MatDialog,
    private router: Router,
    private dateService: DateService,
    private sb: SnackBarService) {
      const m = moment('2021-07-29 15:20:40')
      console.log('test', m.format('DD MMM YYYY HH:mm'))
  }

  triggerSnackBar(message:string, action:string) {
    this.sb.openSnackBarBottomCenter(message, action);
  }

  ngOnInit(): void {
    this.subscriptions.push(this.contactService.companyObserver.subscribe(() => this.update()))
    this.showGrid()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  private update() {
    this.lastQuery = {}
    this.listShow ? this.showList() : this.showGrid()
  }

  showList() {
    this.listShow = true
    this.selectedItems = []
    this.items = []
    this.applyFilter()
  }

  showGrid() {
    this.listShow = false
    this.selectedItems = []
    this.applyFilter()
  }

  private fetchListView(query) {
    this.contactService
      .getCompanyList(query)
      .subscribe((res: any) => {
        console.log('fetchListView', res)
        if (!res.success) {
          this.triggerSnackBar(res.message, 'Close')
          return
        }
        this.recordsTotal = res.data.recordsFiltered
        const items = res.data.data.map(item => {
          return {...item, company: true}
        })
        this.items = this.items.concat(items)
        this.updateOwners()
        this.getPreference()
      },
      err => {
        this.triggerSnackBar(err.error.message, 'Close')
      })
  }

  private fetchGridView(query) {
    this.contactService
      .getCompanyList(query)
      .subscribe((res: any) => {
        console.log('fetchGridView', res)
        if (!res.success) {
          this.triggerSnackBar(res.message, 'Close')
          return
        }
        this.items = []
        const data = res.data.data
        for (const activity in data) {
          const companies: any[] = data[activity]
          companies.map((company, index) => {
            this.items.push({...company, category: activity, company: true})
          })
        }
        this.updateOwners()
        this.getPreference()
      },
      err => {
        this.triggerSnackBar(err.error.message, 'Close')
      })
  }

  private updateOwners() {
    this.companyOwners = this.items
      .map(item => item.owner)
      .filter((item, index, array) => array.findIndex((t) => t.id === item.id) === index)
    console.log('updateOwners', this.companyOwners)
  }

  pageChanged(e) {
    console.log('pageChanged', e)
    if (this.items.length >= e.length) {
      return
    }
    const start = e.pageIndex * e.pageSize
    const query = { view_type: 'list', draw: 0, start: start, length: e.pageSize }
    this.fetchListView(query)
  }

  clickCard(item) {
    this.contactService
      .getCompanyDetial(item.id)
      .subscribe((res: any) => {
        console.log('refresh', res);
        if (res.success) {
          this.companyDetails = res.data
          this.showDetails = true
        }
        else {
          //TODO
        }
      });
  }

  onHideDetails() {
    this.showDetails = false
    this.companyDetails = null
  }

  clickContactPage() {
    this.router.navigate(['/pages/contact'])
  }

  clickCheck(e, item) {
    e.preventDefault()
    const index = this.selectedItems.indexOf(item, 0)
    if (index > -1) {
      this.selectedItems.splice(index, 1)
    } else {
      this.selectedItems.push(item)
    }
  }

  setCheckStatus(item) {
    const index = this.selectedItems.indexOf(item, 0)
    if (index > -1) {
      return true
    } else {
      return false
    }
  }

  showCardCheckBox(item) {
    const index = this.selectedItems.indexOf(item, 0);
    if (this.hoveredItem == item || index > -1)
      return true
    return false
  }

  setHoveredItem(item) {
    this.hoveredItem = item
  }

  clickEmptyCheck() {
    this.selectedItems = [...this.items]
  }

  clickIndeterminate() {
    this.selectedItems = []
  }

  clickEmail() {
    const dialogRef = this.dialog.open(CompanyMailDialog, {
      width: '745px',
      autoFocus: false,
      data: {items: this.selectedItems}
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('result ', result)
      // if (result && result.data && result.data == 'delete') {
      //   this.openConfirmDialog()
      // }
    })
  }

  filterClosedStart() {
    setTimeout(() => this.applyFilter(), 10)
  }

  setFilter(filters: CompanyFilters) {
    this.filters = filters
  }

  applyFilter() {
    let query = { }
    if (this.contactService.searchText) {
      query['search'] = this.contactService.searchText
    }

    const filters = this.filters
    if (filters) {
      console.log('applyFilter', filters)
      if (filters.owners.length > 0) {
        query['created_user'] = filters.owners
      }
      if (filters.addedon >= 0) {
        let startDate = null, lastDate = null
        if (filters.activity == 6) {
          startDate = moment(this.filters.addedonStartDate)
          lastDate = moment(this.filters.addedonEndDate)
        }
        else {
          const dateRange = this.dateService.getDateRange(this.filters.addedon)
          startDate = dateRange.startDate?.format('DD-MM-YYYY')
          lastDate = dateRange.lastDate?.format('DD-MM-YYYY')
        }
        query['added'] = {from: startDate, to: lastDate}
      }

      if (filters.activity >= 0) {
        let startDate = null, lastDate = null
        if (filters.activity == 6) {
          startDate = moment(this.filters.activityStartDate)
          lastDate = moment(this.filters.activityEndDate)
        }
        else {
          const dateRange = this.dateService.getDateRange(this.filters.activity)
          startDate = dateRange.startDate?.format('DD-MM-YYYY')
          lastDate = dateRange.lastDate?.format('DD-MM-YYYY')
        }
        query['modified'] = {from: startDate, to: lastDate}
      }
      if (filters.status && filters.status !== 'All') {
        query['status'] = filters.status == 'Active' ? 1 : 2
      }
    }

    query['view_type'] = this.listShow? 'list' : 'grid'
    console.log('applyFilter, query=', query, this.lastQuery)

    // Compare query
    if (!this.compareQuery(this.lastQuery, query)) {
      this.lastQuery = query;
      this.items = [];
      this.listShow ? this.fetchListView(query) : this.fetchGridView(query)
    }
  }

  private compareQuery(object1, object2) {
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

  clickFilter() {
    this.drawer.toggle()
    this.showFilter = true
  }

  checkCategory(item) {
    if (item == null) {
      this.currentCategory = null
      return false
    }
    if (item.category && item.category != this.currentCategory) {
      this.currentCategory = item.category
      return true
    }
    return false
  }

  deleteItem(e) {
    console.log('deleteCompnay', this.selectedItems)
    const companyIds = this.selectedItems.map(item => item.id)
    this.contactService
      .deleteCompany(companyIds)
      .subscribe((res: any) => {
        if (res.success) {
          this.deleteSelectedItems()
          this.triggerSnackBar(res.message, 'Close')
        }
      },
      err => {
        this.triggerSnackBar(err.error.message, 'Close')
      })
  }

  deleteSelectedItems() {
    console.log('deleteSelectedItems', this.selectedItems)
    this.selectedItems.forEach(item => {
      const index = this.items.indexOf(item)
      index >= 0 && this.items.splice(index, 1)
    })
    this.selectedItems = []
  }

  private getPreference() {
    const item = this.settingsApiService.getDateFormat()
    if (!item || item === 'undefined') {
      this.settingsApiService.preferenceMe().subscribe(
        (res: any) => {
          console.log('getPreference', res);
          if (res.success) {
            const dateformat = res.data.deteformats.find(it => it.id === res.data.preference.dateformat_id)
            const timeformat = res.data.timeformats.find(it => it.id === res.data.preference.timeformat_id)
            this.settingsApiService.setDateFormat(dateformat.dateformat)
            this.settingsApiService.setTimeFormat(timeformat.timeformat)
            console.log('dateformat', dateformat, timeformat);
          }
        },
        (error: HttpErrorResponse) => {}
      );
    }
  }

  /*Modal dialog*/
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'dialog001'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  /*Modal dialog*/
}

@Component({
  selector: 'mail-dialog',
  templateUrl: 'mail-dialog/mail-dialog.html',
  styleUrls: ['mail-dialog/mail-dialog.css']
})
export class CompanyMailDialog {
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }

  activeTabIndex = 0
  items: selectedData
  constructor(
    public dialogRef: MatDialogRef<CompanyMailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: selectedData
  ) {
    this.items = data
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public handleTabChange(e: MatTabChangeEvent) {
    this.activeTabIndex = e.index
    console.log(this.items)
  }

  public titleOptions1: Object = {
    // placeholderText: 'Edit Your Content Here!',
    // charCounterCount: false,
    // toolbarInline: true,
    key:'cJC7bA5D3G2F2C2G2yQNDMIJg1IQNSEa1EUAi1XVFQd1EaG3C2A5D5C4E3D2D4D2B2==',
    toolbarBottom: true,
    events: {
      "initialized": () => {
        console.log('initialized');
      },
      "contentChanged": () => {
        console.log("content changed");
      }
    }
  }

  public titleOptions2: Object = {
    // placeholderText: 'Edit Your Content Here!',
    // charCounterCount: false,
    // toolbarInline: true,
    key:'cJC7bA5D3G2F2C2G2yQNDMIJg1IQNSEa1EUAi1XVFQd1EaG3C2A5D5C4E3D2D4D2B2==',
    toolbarBottom: true,
    events: {
      "initialized": () => {
        console.log('initialized');
      },
      "contentChanged": () => {
        console.log("content changed");
      }
    }
  }

  public titleOptions3: Object = {
    // placeholderText: 'Edit Your Content Here!',
    // charCounterCount: false,
    // toolbarInline: true,
    key:'cJC7bA5D3G2F2C2G2yQNDMIJg1IQNSEa1EUAi1XVFQd1EaG3C2A5D5C4E3D2D4D2B2==',
    toolbarBottom: true,
    events: {
      "initialized": () => {
        console.log('initialized');
      },
      "contentChanged": () => {
        console.log("content changed");
      }
    }
  }

  public deleteSelected(item) {
    const index = this.items.items.indexOf(item)
    this.items.items.splice(index, 1)
  }
}
