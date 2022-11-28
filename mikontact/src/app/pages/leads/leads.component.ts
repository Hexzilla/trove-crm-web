import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FilterComponent } from './filter/filter.component';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})

export class LeadsComponent implements OnInit {
  @ViewChild(FilterComponent)
  private filterComponent: FilterComponent
    
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }

  listShow: boolean = false
  stages: string[] = ['Discovery', 'Qualified', 'Evolution', 'Negotiation', 'Closed']

  discovery: number[] = [100, 2, 3, 4, 5]
  qualified: number[] = [1, 2]
  evolution: number[] = [1]
  negotiation: number[] = [1]
  closed: number[] = [1, 2, 3]

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  active: number = 1

  filterCount: number = 0

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    )
  }
  
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
  
  public activeClass(num) {
    if (num == this.active)
      return 'activeBtn'
    else
      return ''
  }

  public setActive(num) {
    console.log('set active', num)
    this.active = num
    if (num == 1) {
      this.options = ['One', 'Two', 'Three']
    } else if (num == 2) {
      this.options = ['Four', 'Five', 'Six']
    } else if (num == 3) {
      this.options = ['Seven', 'Eight', 'Nine']
    }
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    )
  }

  public onSelectionChange(event) {
    console.log(event.option.value)
  }

  showList() {
    this.listShow = true
  }

  showCards() {
    this.listShow = false
  }
  
  dropped(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      )
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      )
   }
  }

  clickCard() {
    this.router.navigate(['/pages/lead_detail']);
  }

  filterCountChangedHandler(e) {
    this.filterCount = e
  }

  clearAll() {
    this.filterComponent.clearAll()
  }
}
