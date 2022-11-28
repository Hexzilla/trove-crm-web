import {Component, OnInit} from '@angular/core';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  constructor() {
  }

  //defining method for display of SnackBar
  // triggerSnackBar(message:string, action:string)
  // {
  //  this.sb.openSnackBarBottomCenter(message, action);
  // }


  tabLoadTimes: Date[] = [];

  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
  }


  ngOnInit(): void {

  }
}
