import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

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
  { avatar: '../../../assets/images/user-sample.png', name: 'Edward James Olmos', description: "description1", stage: 'Qualified', value: 0, day: 1, owner: 'Packet Monster, Inc.' },
  { avatar: '../../../assets/images/user-sample.png', name: 'Edward James Olmos', description: "description2", stage: 'Evolution', value: 400, day: 1, owner: '' },
  { avatar: '../../../assets/images/user-sample.png', name: 'Edward James Olmos', description: "description3", stage: 'Evolution', value: 300, day: 1, owner: '' },
  { avatar: '../../../assets/images/user-sample.png', name: 'Edward James Olmos', description: "description4", stage: 'Evolution', value: 40, day: 1, owner: '' },
  { avatar: '../../../assets/images/user-sample.png', name: 'Edward James Olmos', description: "description5", stage: 'Evolution', value: 2, day: 2, owner: '' },
  { avatar: '../../../assets/images/user-sample.png', name: 'Edward James Olmos', description: "description6", stage: 'Evolution', value: 10000, day: 1, owner: '' },
  { avatar: '../../../assets/images/user-sample.png', name: 'Edward James Olmos', description: "description7", stage: 'Evolution', value: 200, day: 1, owner: '' },
  { avatar: '../../../assets/images/user-sample.png', name: 'Edward James Olmos', description: "description8", stage: 'Evolution', value: 60, day: 3, owner: 'Me' },
] 


@Component({
  selector: 'app-lead-table',
  templateUrl: './lead-table.component.html',
  styleUrls: ['./lead-table.component.css']
})
  
export class LeadTableComponent implements AfterViewInit  {
  displayedColumns: string[] = ['name', 'stage', 'value', 'day', 'owner'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selectedTh = ''

  constructor(private router: Router) { }

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  ngAfterViewInit (): void {
    this.dataSource.sort = this.sort;
  }

  clickRow(row) {
    console.log('row', row)
    this.router.navigate(['/pages/lead_detail']);
  }

  clickTh(type) {
    this.selectedTh = type
    console.log(this.selectedTh)
  }
}
