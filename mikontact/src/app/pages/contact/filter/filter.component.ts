import { Component, OnInit } from '@angular/core';
import { DateService } from '../../../service/date.service'
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export class Type {
  constructor(public name: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}

// multi autocomplete
export class Contact {
  constructor(public name: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}

@Component({
  selector: 'contact-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class ContactFilterComponent implements OnInit {

  status: string
  statusTypes: string[] = ['All', 'Active', 'Inactive']

  dateTypes: number[] = [0, 1, 2, 3, 4, 5, 6]
  dateTypeString: string[] = ['Today', 'Yesterday', 'Last Week', 'This month', 'Last month', 'This Quarter', 'Custom']
  dateType: number
  startDate: Date = null
  endDate: Date = null

  addDateTypes: number[] = [0, 1, 2, 3, 4, 5, 6]
  addDateTypeString: string[] = ['Today', 'Yesterday', 'Last Week', 'This month', 'Last month', 'This Quarter', 'Custom']
  addDateType: number
  addStartDate: Date = null
  addEndDate: Date = null

  contactType: string = 'contact'

  types: Type[] = [
    new Type('Added by user'),
    new Type('Import from CSV'),
    new Type('Google contacts'),
    new Type('Twitter contacts'),
    new Type('Outlook contacts')
  ]

  // multi autocomplete
  contactControl = new FormControl();
  selectedContacts: Contact[] = new Array<Contact>();
  filteredContacts: Observable<Contact[]>;
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

  constructor(private dateService: DateService) { }

  ngOnInit(): void {
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
      if (this.contactType == 'contact') {
        return this.users.filter(option => {
          return option.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0
        })
      } else {
        return this.companys.filter(option => {
          return option.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0
        })
      }
    } else {
      if (this.contactType == 'contact') {
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
    // console.log(this.filterCount)
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
    // this.selectedContacts.forEach(contact => {
    //   contact.selected = false
    // })
    // this.selectedContacts = []

    // this.filterCountChanged.emit(this.selectedContacts.length)

    this.clearContact()
  }

  public displaySelectedUser() {
    let arr = []
    this.selectedContacts.forEach(user => {
      arr.push(user.name)
    })
    return this.displayArray(arr)
  }
  
  public displayArray(arr) {
    let ret = ''
    arr.length == 1 && (ret += arr[0])
    arr.length == 2 && (ret += arr[0] + ', ' + arr[1])
    arr.length > 2 && (ret += arr[0] + ', ' + arr[1] + ' +' + (arr.length - 2))
    return ret
  }

  clickType(e, type) {
    type.selected = e.checked
  }

  displaySelectedTypes() {
    let arr = []
    this.types.forEach(e => {
      e.selected && arr.push(e.name)
    })
    return this.displayArray(arr)
  }

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
  
  public getAddSelectedDate() {
    if (this.addDateType == -1) {
      return ''
    }
    switch (this.addDateType) {
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
        this.addStartDate && (firstDay = this.dateService.dateToString(this.addStartDate))
        this.addEndDate && (lastDay = this.dateService.dateToString(this.addEndDate))
        return firstDay + ' ~ ' + lastDay
    }
  }

  public clearDate() {
    this.dateType = -1
  }

  public clearAddDate() {
    this.addDateType = -1
  }

  clickContact() {
    this.contactType = 'contact'
    this.clearContact()
  }

  clickCompany() {
    this.contactType = 'company'
    this.clearContact()
  }

  clearContact() {
    this.selectedContacts.forEach(e => e.selected = false)
    this.selectedContacts = []
    this.filteredContacts = this.contactControl.valueChanges.pipe(
      startWith<string | Contact[]>(''),
      map(value => typeof value === 'string' ? value : ''),
      map(filter => this.filter(filter))
    )
  }
}
