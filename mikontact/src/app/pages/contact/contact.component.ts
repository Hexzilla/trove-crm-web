import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

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
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }

  hoveredItem
  //detect for click card, check
  detect: number

  allItems: item[] = [
    {
      id: 1,
      name: 'Alphabet Inc.',
      owner: 'Henessy',
      contactCount: 9,
      company: true,
      companyName: '',
      email: '',
      last: new Date("2021-1-1"),
      city: 'boston'
    },
    {
      id: 2,
      name: 'Bryce Dallas Howard',
      owner: '',
      contactCount: 0,
      company: false,
      companyName: 'Dona factory',
      email: 'example@gmail.com',
      last: new Date("2020-12-15"),
      city: 'Fort Worth'
    },
    {
      id: 3,
      name: 'Berry Watson',
      owner: '',
      contactCount: 0,
      company: false,
      companyName: 'Iv homes ltd',
      email: 'example@gmail.com',
      last: new Date("2020-12-14"),
      city: 'San Francisco'
    },
    {
      id: 4,
      name: 'Berry Watson',
      owner: '',
      contactCount: 0,
      company: false,
      companyName: 'Iv homes ltd',
      email: 'example@gmail.com',
      last: new Date("2020-12-13"),
      city: 'Los Angeles'
    },
    {
      id: 5,
      name: 'Edward James Olmos',
      owner: '',
      contactCount: 0,
      company: false,
      companyName: 'Iv homes ltd',
      email: 'example@gmail.com',
      last: new Date("2020-12-12"),
      city: 'San Antonio'
    },
    {
      id: 6,
      name: 'Packet Monster',
      owner: 'Wes studi',
      contactCount: 37,
      company: true,
      companyName: '',
      email: '',
      last: new Date("2020-11-30"),
      city: 'London'
    },
    {
      id: 7,
      name: 'Tammy Gillis',
      owner: '',
      contactCount: 0,
      company: false,
      companyName: 'Iv homes ltd',
      email: 'example@gmail.com',
      last: new Date("2020-11-7"),
      city: 'Paris'
    },
    {
      id: 8,
      name: 'Bryce Dallas Howard',
      owner: '',
      contactCount: 0,
      company: false,
      companyName: 'Dona factory',
      email: 'example@gmail.com',
      last: new Date("2020-11-6"),
      city: 'Madrid'
    },
    {
      id: 9,
      name: 'Packet Monster3',
      owner: 'Wes studi',
      contactCount: 3,
      company: true,
      companyName: '',
      email: '',
      last: new Date("2020-11-5"),
      city: 'Barcelona'
    },
    {
      id: 10,
      name: 'Wes Studi',
      owner: '',
      contactCount: 0,
      company: false,
      companyName: 'Iv homes ltd',
      email: 'example@gmail.com',
      last: new Date("2020-11-4"),
      city: 'Oklahoma City'
    },
    {
      id: 11,
      name: 'Packet Monster1',
      owner: 'Wes studi',
      contactCount: 2,
      company: true,
      companyName: '',
      email: '',
      last: new Date("2020-11-3"),
      city: 'Utah'
    },
    {
      id: 12,
      name: 'Berry Watson',
      owner: '',
      contactCount: 0,
      company: false,
      companyName: 'Iv homes ltd',
      email: 'example@gmail.com',
      last: new Date("2020-11-1"),
      city: 'Chicago'
    },
  ]
  items: item[] = []
  selectedItems: item[] = []

  listShow: boolean = false
  typeString: string = 'Contact'

  constructor(public dialog: MatDialog, private router: Router) {
  }

  ngOnInit(): void {
    this.items = this.allItems
  }

  showList() {
    this.listShow = true
    this.selectedItems = []
  }

  showGrid() {
    this.listShow = false
    this.selectedItems = []
  }

  selectContact() {
    this.items = this.allItems.filter(e => !e.company)
    this.typeString = 'Contact'
    this.selectedItems = []
  }

  selectCompany() {
    this.items = this.allItems.filter(e => e.company)
    this.typeString = 'Company'
    this.selectedItems = []
  }

  clickCard(item) {
    this.router.navigate(['/pages/contact_detail'])
  }

  clickCheck(e, item) {
    this.detect = 1
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
    this.selectedItems = this.items.reduce((acc, item) => {
      acc.push(item)
      return acc
    }, [])
  }
  
  clickIndeterminate() {
    this.selectedItems = []
  }

  clickEmail() {
    const dialogRef = this.dialog.open(MailDialog, {
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

}


@Component({
  selector: 'mail-dialog',
  templateUrl: 'mail-dialog/mail-dialog.html',
  styleUrls: ['mail-dialog/mail-dialog.css']
})
export class MailDialog {
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }
  
  activeTabIndex = 0
  items: selectedData
  constructor(
    public dialogRef: MatDialogRef<MailDialog>,
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
    // console.log('selected', item, this.items.items)
    const index = this.items.items.indexOf(item)
    this.items.items.splice(index, 1)
  }
}
