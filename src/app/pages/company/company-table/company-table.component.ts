import { Component, OnInit, Input, AfterViewInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DateService } from '../../../service/date.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SettingsApiService } from 'src/app/services/settings-api.service';
import * as moment from 'moment';

export interface item {
  name: string;
  owner: string;
  contactCount: number;
  email: string;
  companyName: string;
  company: boolean;
  last: Date;
}
@Component({
  selector: 'app-company-table',
  templateUrl: './company-table.component.html',
  styleUrls: ['./company-table.component.css']
})
export class CompanyTableComponent implements AfterViewInit {
 
  @Input() length
  @Input() pageSize
  @Input() propItems
  @Input() selectedItems
  @Output() pagination = new EventEmitter();

  displayedColumns: string[] = ['contact', 'mobile', 'email', 'city', 'state', 'ownerName', 'last_activity', 'contacts_count', 'status', 'created_at', 'updated_at'];
  dataSource
  selectedTh: string = ''
  items = []
  page = null

  constructor(
    private settingsApiService: SettingsApiService,
    private dateService: DateService, 
    private router: Router) {
      
  }

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit(): void {
      
  }

  ngOnChanges() {
    this.items = [...this.propItems].map(it => {
      return {...it, ownerName: it.owner.full_name, last_activity: it.updated_at}
    })
    console.log('ngOnChanges', this.items)
    if (this.items.length > 0 && this.items.length < this.length) {
      const displayItems = this.items.length % this.pageSize;
      if (displayItems == this.pageSize - 1) {
        this.items.push({}) //for pagination
      }
    }
    this.dataSource = new MatTableDataSource(this.items)
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
  }

  clickCheck(event, item) {
    event.preventDefault()
    const index = this.selectedItems.indexOf(item, 0);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item)
    }
    console.log(this.selectedItems)
  }

  setCheckStatus(item) {
    const index = this.selectedItems.indexOf(item, 0);
    if (index > -1) {
      return true
    } else {
      return false
    }
  }

  dateToString(date) {
    const dateFormat = this.settingsApiService.getDateFormat()
    const format = this.dateService.getDateFormat(dateFormat)
    return moment(date).format(format);
  }

  clickTh(th) {
    this.selectedTh = th
  }

  clickItem(item) {
    this.router.navigate(['/pages/company_detail'])
  }
  
  pageChanged(event) {
    this.page = event
    this.pagination.emit(event)
  }
}
