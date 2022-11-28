import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
interface TIMEZONE{
  value: string;
  viewValue: string;
}
interface TIMEFORMAT{
  value: string;
  viewValue: string;
}
interface DATEFORMAT{
  value: string;
  viewValue: string;
}
interface CURRENCYFORMAT{
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
/*For Account -- time zone select box*/
accountForm: FormGroup;
timeZones: TIMEZONE[] = [
  {
    value: 'Denver(GMT-6)',
    viewValue: 'Denver (GMT-6)'
  },
  {
    value: 'Newyork(GMT-6)',
    viewValue: 'Newyork (GMT-6)'
  },
  {
    value: 'Kolkata(GMT-6)',
    viewValue: 'Kolkata (GMT-6)'
  },
  {
    value: 'Chennai(GMTTT-6)',
    viewValue: 'Chennai (GMT-6)'
  }
]

timeFormats: TIMEFORMAT[] = [
  {
    value: '24Hours',
    viewValue: '24 Hours'
  },
  {
    value: '12Hours',
    viewValue: '12 Hours'
  }
]

dateFormats: DATEFORMAT[] = [
  {
    value: 'mm/dd/yy',
    viewValue: 'mm/dd/yy'
  },
  {
    value: 'dd/mm/yy',
    viewValue: 'dd/mm/yy'
  },
  {
    value: 'yy/mm/dd',
    viewValue: 'yy/mm/dd'
  }
]

currencyFormats: CURRENCYFORMAT[] = [
  {
    value: 'UnitedStatesDollar',
    viewValue: 'United States Dollar'
  },
  {
    value: 'SingaporeDollar',
    viewValue: 'Singapore Dollar'
  },
  {
    value: 'DubaiDirhams',
    viewValue: 'Dubai Dirhams'
  },
  {
    value: 'IndianRupees',
    viewValue: 'Indian Rupees'
  }
]

timeZoneControl = new FormControl(this.timeZones[3].value);
timeFormatControl = new FormControl(this.timeFormats[0].value)
dateFormatControl = new FormControl(this.dateFormats[2].value)
currencyFormatControl = new FormControl(this.currencyFormats[3].value)

/*For Account -- time zone select box*/
  constructor() {
    this.accountForm = new FormGroup({
      timeZone: this.timeZoneControl,
      timeFormat: this.timeFormatControl,
      dateFormat: this.dateFormatControl,
      currencyFormat: this.currencyFormatControl
    });
  }

  ngOnInit(): void {
  }

}
