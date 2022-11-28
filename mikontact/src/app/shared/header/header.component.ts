import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menus: any[];
  isNotification:boolean = false
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  active: number = 1
  selectedStage: number = 3
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
   this.menus=[
      {
        icon:'menu001.png',
        link:'/pages/dashboard'
      },
      {
        icon:'menu006.png',
        link:'/pages/leads'
      },
      {
        icon:'menu002.png',
        link:'/pages/contact'
      },
      {
        icon:'menu003.png',
        link:'/pages/email'
      },
      {
        icon:'menu004.png',
        link:'/pages/calendar'
      },
      {
        icon:'menu005.png',
        link:'/pages/pipeline'
      }
    ]
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    )
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

  onSelectionChange(event) {

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }


  showNotification(){
    this.isNotification = !this.isNotification
  }

  clickLead() {
    const dialogRef = this.dialog.open(LeadDialog, {
      width: '560px',
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe(result => {
    })
  }

  clickContact() {
    const dialogRef = this.dialog.open(ContactDialog, {
      width: '531px',
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe(result => {
    })
  }

  clickCompany() {
    const dialogRef = this.dialog.open(CompanyDialog, {
      width: '560px',
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe(result => {
    })
  }

}

@Component({
  selector: 'lead-dialog',
  templateUrl: 'lead-dialog/lead-dialog.html',
  styleUrls: ['lead-dialog/lead-dialog.css'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class LeadDialog {
  searchControl = new FormControl()
  options: string[] = ['Lead Name', 'Primary Contact', 'Value', 'Company', 'Owner', 'Source', 'Secondary Contact',
                      'Added On', 'Estimate Close Date', 'Pipeline Category', 'Stage', 'Description']
  filteredOptions: Observable<string[]>

  showMandatory: boolean = false
  search: string = ''

  stages: string[] = ['Discovery', 'Qualified', 'Evolution', 'Negotiation', 'Closed']
  selectedStage = 0

  constructor(
    public dialogRef: MatDialogRef<LeadDialog>
    // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.filteredOptions = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      )
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  checkMandatory(e) {
    this.showMandatory = e.checked
  }

  checkShow(name) {
    if (!this.search)
      return true
    if (name.toUpperCase().search(this.search.toUpperCase()) == -1)
      return false
    else
      return true
  }

  getLeftOffset(index) {
    return -8 * index
  }

  getStageSrc(index) {
    if (index == 0) {
      if (this.selectedStage == 0)  {
        return '../../../../assets/images/stage/start-active-stage-md.svg'
      } else {
        return '../../../../assets/images/stage/start-stage-md.svg'
      }
    }
    if (index == this.selectedStage) {
      return '../../../../assets/images/stage/active-stage-md.svg'
    }
    return '../../../../assets/images/stage/mid-stage-md.svg'
  }
}

@Component({
  selector: 'contact-dialog',
  templateUrl: 'contact-dialog/contact-dialog.html',
  styleUrls: ['contact-dialog/contact-dialog.css']
})
export class ContactDialog {
  searchControl = new FormControl()
  options: string[] = ['First Name', 'Last Name', 'Mobile Number', 'Work Number', 'Company Name', 'Email Address',
                      'Contact Type', 'Contact Group', 'Address', 'Skype ID', 'Description']
  filteredOptions: Observable<string[]>

  showMandatory: boolean = false
  search: string = ''

  userHover: boolean = false
  imageHover: boolean = false
  imageSrc: string;

  constructor(
    public dialogRef: MatDialogRef<ContactDialog>
    // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.filteredOptions = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      )
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  checkMandatory(e) {
    this.showMandatory = e.checked
  }

  checkShow(name) {
    if (!this.search)
      return true
    if (name.toUpperCase().search(this.search.toUpperCase()) == -1)
      return false
    else
      return true
  }

  getUserIcon() {
    if (!this.userHover)
      return 'account_circle'
    return 'add'
  }

  userIcon() {
    let element:HTMLElement = document.getElementById('fileInput') as HTMLElement;
    element.click()
    this.imageHover = false
  }

  readURL(event: HTMLInputEvent): void {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.imageSrc = reader.result as string

        reader.readAsDataURL(file);
    }
    this.imageHover = false
  }

  removeImage() {
    this.imageSrc = ''
  }

  showOverlay() {
    return this.imageHover
  }
}

@Component({
  selector: 'company-dialog',
  templateUrl: 'company-dialog/company-dialog.html',
  styleUrls: ['company-dialog/company-dialog.css']
})
export class CompanyDialog {
  searchControl = new FormControl()
  options: string[] = ['Company Name', 'Mobile Number', 'Work Number', 'Address', 'City', 'Post Code', 'State/Region',
                      'Country', 'Email Address', 'Owner', 'Skype ID', 'Description']
  filteredOptions: Observable<string[]>

  showMandatory: boolean = false
  search: string = ''

  mobileCode = 'USA'

  addressSelect = false

  constructor(
    public dialogRef: MatDialogRef<CompanyDialog>
    // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.filteredOptions = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      )
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  checkMandatory(e) {
    this.showMandatory = e.checked
  }

  checkShow(name) {
    if (!this.search)
      return true
    if (name.toUpperCase().search(this.search.toUpperCase()) == -1)
      return false
    else
      return true
  }
}
