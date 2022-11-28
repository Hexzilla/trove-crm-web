import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-activitylog',
  templateUrl: './activitylog.component.html',
  styleUrls: ['./activitylog.component.css']
})
export class ActivitylogComponent implements OnInit {
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }
  constructor() { }

  ngOnInit(): void {
  }

}
