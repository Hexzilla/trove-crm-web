import { Component, OnInit, ViewChildren, QueryList, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Options } from "@angular-slider/ngx-slider";
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateService } from '../../../service/date.service'

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
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>

  @Input() filterCount:number
  @Output() filterCountChanged: EventEmitter<number> = new EventEmitter();
  @Input() listShow:boolean

  myControl = new FormControl();
  searchOptions: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  minValue: number = 0
  highValue: number = 0
  sliderOptions: Options = {
    floor: 0,
    ceil: 100000
  }

  contactActive: number = 0

  selectedPipe: string[] = []

  dateTypes: number[] = [0, 1, 2, 3, 4, 5, 6]
  dateTypeString: string[] = ['Today', 'Yesterday', 'Last Week', 'This month', 'Last month', 'This Quarter', 'Custom']
  dateType: number = -1

  statusType: string = ''
  selectedSource: string[] = []

  public startDate: Date = new Date()
  public endDate: Date = new Date()

  scrollOptions = { autoHide: true, scrollbarMinSize: 30 }

  // multi autocomplete
  contactControl = new FormControl();

  users = [
    new Contact('Shemeka Wittner'),
    new Contact('Sheila Sak'),
    new Contact('Zola Rodas'),
    new Contact('Dena Heilman'),
    new Contact('Concepcion Pickrell'),
    new Contact('Marylynn Berthiaume'),
    new Contact('Howard Lipton'),
    new Contact('Maxine Amon'),
    new Contact('Iliana Steck'),
    new Contact('Laverna Cessna'),
    new Contact('Brittany Rosch'),
    new Contact('Esteban Ohlinger'),
    new Contact('Myron Cotner'),
    new Contact('Geri Donner'),
    new Contact('Minna Ryckman'),
    new Contact('Yi Grieco'),
    new Contact('Lloyd Sneed'),
    new Contact('Marquis Willmon'),
    new Contact('Lupita Mattern'),
    new Contact('Fernande Shirk'),
    new Contact('Eloise Mccaffrey'),
    new Contact('Abram Hatter'),
    new Contact('Karisa Milera'),
    new Contact('Bailey Eno'),
    new Contact('Juliane Sinclair'),
    new Contact('Giselle Labuda'),
    new Contact('Chelsie Hy'),
    new Contact('Catina Wohlers'),
    new Contact('Edris Liberto'),
    new Contact('Harry Dossett'),
    new Contact('Yasmin Bohl'),
    new Contact('Cheyenne Ostlund'),
    new Contact('Joannie Greenley'),
    new Contact('Sherril Colin'),
    new Contact('Mariann Frasca'),
    new Contact('Sena Henningsen'),
    new Contact('Cami Ringo'),
  ]
  companys = [
    new Contact('Google'),
    new Contact('Microsoft'),
    new Contact('Apple'),
    new Contact('Amazon'),
    new Contact('Facebook'),
    new Contact('hexagonitsolutions software pvt ltd')
  ]
  sources = [
    new Source('SMS'),
    new Source('Website'),
    new Source('News'),
    new Source('Test1'),
    new Source('Test2'),
  ]
  sourceAll: boolean = false

  selectedContacts: Contact[] = new Array<Contact>();

  filteredContacts: Observable<Contact[]>;

  constructor(private dateService: DateService) { }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    )

    // multi autocomplete
    this.filteredContacts = this.contactControl.valueChanges.pipe(
      startWith<string | Contact[]>(''),
      map(value => typeof value === 'string' ? value : ''),
      map(filter => this.filter(filter))
    )
  }

  // multi autocomplete
  filter(filter: string): Contact[] {
    if (filter) {
      if (this.contactActive == 0) {
        return this.users.filter(option => {
          return option.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0
        })
      } else {
        return this.companys.filter(option => {
          return option.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0
        })
      }
    } else {
      if (this.contactActive == 0) {
        return this.users.slice();
      } else {
        return this.companys.slice();
      }
    }
  }

  // multi autocomplete
  displayFn(value: Contact[] | string): string | undefined {
    return ""
    // let displayValue: string;
    // if (Array.isArray(value)) {
    //   value.forEach((user, index) => {
    //     if (index === 0) {
    //       displayValue = user.firstname + ' ' + user.lastname;
    //     } else {
    //       displayValue += ', ' + user.firstname + ' ' + user.lastname;
    //     }
    //   });
    // } else {
    //   displayValue = value;
    // }
    // return displayValue;
  }

  // multi autocomplete
  optionClicked(event: Event, contact: Contact) {
    // event.stopPropagation();
    this.toggleSelection(contact)
  }

  // multi autocomplete
  toggleSelection(user: Contact) {
    console.log(this.filterCount)
    user.selected = !user.selected;
    if (user.selected) {
      this.selectedContacts.push(user);
    } else {
      const i = this.selectedContacts.findIndex(value => value.name === user.name);
      this.selectedContacts.splice(i, 1);
    }

    this.contactControl.setValue(this.selectedContacts);

    // this.filterCountChanged.emit(this.selectedContacts.length)
  }

  contactClearClick() {
    this.selectedContacts.forEach(contact => {
      contact.selected = false
    })
    this.selectedContacts = []

    // this.filterCountChanged.emit(this.selectedContacts.length)
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.searchOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  //contact
  public clickUser() {
    this.contactActive = 0
    this.filteredContacts = this.contactControl.valueChanges.pipe(
      startWith<string | Contact[]>(''),
      map(value => typeof value === 'string' ? value : ''),
      map(filter => this.filter(filter))
    )
  }

  public clickCompany() {
    this.contactActive = 1
    this.filteredContacts = this.contactControl.valueChanges.pipe(
      startWith<string | Contact[]>(''),
      map(value => typeof value === 'string' ? value : ''),
      map(filter => this.filter(filter))
    )
  }

  public clearValueClick() {
    this.minValue = 0
    this.highValue = 0
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

  clearPipe() {
    this.selectedPipe = []
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

  //source
  clearSelectedSource() {
    this.sources.forEach(e => e.selected = false)
  }

  //status
  clearStatus() {
    this.statusType = ''
  }

  public displayArray(arr) {
    let ret = ''
    arr.length == 1 && (ret += arr[0])
    arr.length == 2 && (ret += arr[0] + ', ' + arr[1])
    arr.length > 2 && (ret += arr[0] + ', ' + arr[1] + ' +' + (arr.length - 2))
    return ret
  }

  public displaySelectedUser() {
    let arr = []
    this.selectedContacts.forEach(user => {
      arr.push(user.name)
    })
    return this.displayArray(arr)
  }

  //date
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

  //date
  clearDate() {
    this.dateType = -1
  }

  clearAll() {
    this.clearValueClick()
    this.contactClearClick()
    this.clearSelectedSource()
    this.clearStatus()
    this.clearDate()
    this.clearPipe()
    
    this.filterCountChanged.emit(0)
  }

}
