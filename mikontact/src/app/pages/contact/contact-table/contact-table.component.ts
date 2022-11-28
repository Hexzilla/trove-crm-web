import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DateService } from '../../../service/date.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

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
  selector: 'app-contact-table',
  templateUrl: './contact-table.component.html',
  styleUrls: ['./contact-table.component.css']
})
export class ContactTableComponent implements AfterViewInit {
  @Input() propItems
  @Input() selectedItems

  displayedColumns: string[] = ['contact', 'company', 'last', 'since', 'city', 'added', 'type', 'status', 'phone'];
  dataSource
  selectedTh: string = ''

  constructor(private dateService: DateService, private router: Router) {
    this.dataSource = new MatTableDataSource(this.propItems);
  }

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource = new MatTableDataSource(this.propItems)
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
  }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.propItems)
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
    return this.dateService.dateToString(date)
  }

  clickTh(th) {
    this.selectedTh = th
  }

  clickItem(item) {
    this.router.navigate(['/pages/contact_detail'])
  }
}
