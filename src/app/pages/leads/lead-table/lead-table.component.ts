import { element } from 'protractor';
import {
  Component,
  AfterViewInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DateService } from '../../../service/date.service';
import { Subscription } from 'rxjs';

export interface PeriodicElement {
  avatar: string;
  name: string;
  description: string;
  stage: string;
  value: number;
  day: number;
  owner: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    avatar: '../../../assets/images/user-sample.png',
    name: 'Edward James Olmos',
    description: 'description1',
    stage: 'Qualified',
    value: 0,
    day: 1,
    owner: 'Packet Monster, Inc.',
  },
  {
    avatar: '../../../assets/images/user-sample.png',
    name: 'Edward James Olmos',
    description: 'description2',
    stage: 'Evolution',
    value: 400,
    day: 1,
    owner: '',
  },
  {
    avatar: '../../../assets/images/user-sample.png',
    name: 'Edward James Olmos',
    description: 'description3',
    stage: 'Evolution',
    value: 300,
    day: 1,
    owner: '',
  },
  {
    avatar: '../../../assets/images/user-sample.png',
    name: 'Edward James Olmos',
    description: 'description4',
    stage: 'Evolution',
    value: 40,
    day: 1,
    owner: '',
  },
  {
    avatar: '../../../assets/images/user-sample.png',
    name: 'Edward James Olmos',
    description: 'description5',
    stage: 'Evolution',
    value: 2,
    day: 2,
    owner: '',
  },
  {
    avatar: '../../../assets/images/user-sample.png',
    name: 'Edward James Olmos',
    description: 'description6',
    stage: 'Evolution',
    value: 10000,
    day: 1,
    owner: '',
  },
  {
    avatar: '../../../assets/images/user-sample.png',
    name: 'Edward James Olmos',
    description: 'description7',
    stage: 'Evolution',
    value: 200,
    day: 1,
    owner: '',
  },
  {
    avatar: '../../../assets/images/user-sample.png',
    name: 'Edward James Olmos',
    description: 'description8',
    stage: 'Evolution',
    value: 60,
    day: 3,
    owner: 'Me',
  },
];

@Component({
  selector: 'app-lead-table',
  templateUrl: './lead-table.component.html',
  styleUrls: ['./lead-table.component.css'],
})
export class LeadTableComponent implements AfterViewInit {
  @Input() length;
  @Input() pageSize;
  @Input() propItems;
  @Output() pagination = new EventEmitter();
  private subscriptions: Subscription[] = [];

  displayedColumns: string[] = ['name', 'stage', 'value', 'day', 'owner'];
  dataSource;
  selectedTh = '';
  items = [];
  page = null;

  constructor(private dateService: DateService, private router: Router) {}

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
    this.items = [];
    //console.log('table view ngOnChanges', [...this.propItems]);
    this.items = [...this.propItems];
    if (this.items.length > 0 && this.items.length < this.length) {
      //this.items.push({});
    }
    console.log("this.items", this.items);
    this.dataSource = new MatTableDataSource(this.items);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  clickRow(row) {
    //console.log('row', row);
    this.router.navigate(['/pages/lead_detail']);
  }

  clickTh(type) {
    this.selectedTh = type;
    //console.log(this.selectedTh);
  }
  pageChanged(event) {
    this.page = event;
    this.pagination.emit(event);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
