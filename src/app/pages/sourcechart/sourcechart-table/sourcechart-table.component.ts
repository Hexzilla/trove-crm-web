import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
export interface PeriodicElement {
  avatar: string;
  name: string;
  description: string;
  value: number;
  stage: string;
  contact: any;
  owner: string;
  company: string;
  source: string;
  closedate: string;
  category: string;
  addedon: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { avatar: '../../../assets/images/user-sample.png', name: 'Edward James Olmos', description: "description1", stage: 'Qualified', value: 0, contact: '8006589521', owner: 'Packet Monster, Inc.',
    company: 'Company 1' , source: 'Source 1', closedate: '22/05/2021', category: 'Category 1', addedon: '12/04/2021'
  },
  { avatar: '../../../assets/images/user-sample.png', name: 'Edward James Olmos', description: "description2", stage: 'Evolution', value: 400, contact: '8006589526', owner: '',
  company: 'Company 1' , source: 'Source 1', closedate: '22/05/2021', category: 'Category 2', addedon: '12/03/2021'

   },
  { avatar: '../../../assets/images/user-sample.png', name: 'Edward James Olmos', description: "description3", stage: 'Evolution', value: 300, contact: '8006589527', owner: '',
  company: 'Company 1' , source: 'Source 1', closedate: '22/05/2021', category: 'Category 3', addedon: '10/04/2021' },
  { avatar: '../../../assets/images/user-sample.png', name: 'Edward James Olmos', description: "description4", stage: 'Evolution', value: 40, contact: '8006589525', owner: '',
  company: 'Company 1' , source: 'Source 1', closedate: '22/05/2021', category: 'Category 4', addedon: '' },
  { avatar: '../../../assets/images/user-sample.png', name: 'Edward James Olmos', description: "description5", stage: 'Evolution', value: 2, contact: '8006589524', owner: '',
  company: 'Company 1' , source: 'Source 1', closedate: '22/05/2021', category: 'Category 5' , addedon: '' }
]

@Component({
  selector: 'app-sourcechart-table',
  templateUrl: './sourcechart-table.component.html',
  styleUrls: ['./sourcechart-table.component.css']
})
export class SourcechartTableComponent implements AfterViewInit {

  displayedColumns: string[] = ['name', 'stage', 'value', 'owner', 'company', 'category', 'addedon', 'closedate', 'contact', 'source'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selectedTh = ''

  constructor() { }

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit (): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator
  }

}
