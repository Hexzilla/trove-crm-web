import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

/*Notification user checkbox*/
isNotiUserAll:boolean;
notificationUser:any=[
  {
    name:"When deal is assigned",
    isSelected: false
  },
  {
    name:"When task is assigned",
    isSelected: false
  },
  {
    name:"When contact is assigned",
    isSelected: false
  }
];
/*Notification user checkbox*/
/*Notification System checkbox*/
isNotiSystemAll:boolean;
notificationSystem:any=[
  {
    name:"When import is completed",
    isSelected: false
  },
  {
    name:"When export is completed",
    isSelected: false
  }
];
/*Notification user checkbox*/
  constructor() { }


/*Notification user checkbox*/
selectAllNotiUser(){
  this.notificationUser.map(r => {
    r.isSelected = this.isNotiUserAll;
  });
}
unSelectNotiUser(isSelected){
  if(!isSelected){
    this.isNotiUserAll=false;
  }else if(this.notificationUser.length ===
    this.notificationUser.filter(r => {return r.isSelected === true}).length){
      this.isNotiUserAll=true;
    }
}
/*Notification user checkbox*/

/*Notification System checkbox*/
selectAllNotiSystem(){
  this.notificationSystem.map(r => {
    r.isSelected = this.isNotiSystemAll;
  });
}
unSelectNotiSystem(isSelected){
  if(!isSelected){
    this.isNotiSystemAll=false;
  }else if(this.notificationSystem.length ===
    this.notificationSystem.filter(r => {return r.isSelected === true}).length){
      this.isNotiSystemAll=true;
    }
}
/*Notification System checkbox*/

  ngOnInit(): void {
  }

}
