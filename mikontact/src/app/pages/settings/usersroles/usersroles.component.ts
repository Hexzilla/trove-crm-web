import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SnackBarService} from '../../../shared/snack-bar.service';
interface ADDPERSONROLE{
  value: string;
  viewValue:string;
}
/*For Role Table*/
export interface ROLE {
  role: string;
  accessLevel: string;
}
/*For Role Table*/
/*For User Table*/
export interface USER {
  profile:string;
  user:string;
  role: string;
  accessLevel: string;
}
/*For User Table*/
@Component({
  selector: 'app-usersroles',
  templateUrl: './usersroles.component.html',
  styleUrls: ['./usersroles.component.css']
})
export class UsersrolesComponent implements OnInit, AfterViewInit {
/*For Role Table*/
  displayedRoleColumns: string[] = ['role', 'accessLevel', 'status', 'action'];
/*For Role Table*/
/*For User Table*/
displayedUserColumns: string[] = ['user', 'role', 'accessLevel', 'status' , 'action'];
/*For User Table*/
dataSourceRole: MatTableDataSource<ROLE>;  /*For Role Table*/
dataSourceUser: MatTableDataSource<USER>;  /*For User Table*/
/*For Role Table*/
@ViewChild('ROLESPAGINATOR', {static: true}) rolesPaginator: MatPaginator;
@ViewChild('ROLESSORT', {static: true}) rolesSort: MatSort;
@ViewChild('USERSPAGINATOR', {static: true}) usersPaginator: MatPaginator;
@ViewChild('USERSSORT', {static: true}) usersSort: MatSort;
ngAfterViewInit() {
  this.dataSourceRole.paginator = this.rolesPaginator;
  this.dataSourceRole.sort = this.rolesSort;
  this.dataSourceUser.paginator = this.usersPaginator;
  this.dataSourceUser.sort = this.usersSort;
}
rolesFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSourceRole.filter = filterValue.trim().toLowerCase();
  if (this.dataSourceRole.paginator) {
    this.dataSourceRole.paginator.firstPage();
  }
}
usersFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSourceUser.filter = filterValue.trim().toLowerCase();
  if (this.dataSourceUser.paginator) {
    this.dataSourceUser.paginator.firstPage();
  }
}
/*For Role Table*/
roles: ROLE[]; /*For Role Table*/
users: USER[]; /*For user Table*/
/*Modal dialog*/
closeResult = '';
/*Modal dialog*/
/*Browse File*/
addPersonImage: File = null;
addPersonImageUrl: string | ArrayBuffer = "../../../assets/images/settingsProfile.png";
/*Browse File*/
addPersonRoles: ADDPERSONROLE[] = [
  {
    value: 'Operationsmanager',
    viewValue: 'Operations manager'
  },
  {
    value: 'Officemanager',
    viewValue: 'Office manager'
  },
  {
    value: 'Admin',
    viewValue: 'Admin'
  }
]
/*Add Person Mandatory checkbox*/
isAddPersonMand:boolean;
/*Add Person Mandatory checkbox*/
addPersonForm: FormGroup;
 addPerson() {
   this.addPersonForm = this.fb.group({
      firstName: ['', Validators.required ],
      lastName: ['', Validators.required ],
      mobileNumber:['', Validators.required],
      workNumber: ['', Validators.required ],
      emailAddress:['', Validators.required],
      addPersonRole: this.addPersonRoleControl
   });
 }
addPersonRoleControl = new FormControl(this.addPersonRoles[2].value);
newRoleForm: FormGroup;
 newRole() {
   this.newRoleForm = this.fb.group({
      role: ['', Validators.required ]
   });
 }
 /*Create New Role Modal Settings All Modules checkbox*/
 isSelectAllSettings:boolean;
 isSelectAllSettingsView:boolean;
 isSelectAllSettingsCreate:boolean;
 isSelectAllSettingsEdit:boolean;
 settingsPermission:any = [
   {
     name: "Administration",
     isSelected: false,
     isSelectedView: false,
     isSelectedCreate: false,
     isSelectedEdit: false,
   },
   {
     name: "Lead access ",
     isSelected: false,
     isSelectedView: false,
     isSelectedCreate: false,
     isSelectedEdit: false,
   },
   {
     name: "Contact access",
     isSelected: false,
     isSelectedView: false,
     isSelectedCreate: false,
     isSelectedEdit: false,
   }
 ];
  constructor(private modalService: NgbModal , private fb: FormBuilder,
    private sb: SnackBarService) {
      this.newRole();
      this.addPerson();
     }

     triggerSnackBar(message:string, action:string)
  {
   this.sb.openSnackBarBottomCenter(message, action);
  }
    /*Browse file*/
  addPersonImageEvent(event){
    this.addPersonImage = event.target.files[0];
  }

  removeAddPersonImage(){
    this.addPersonImage = null;
    this.addPersonImageUrl= "../../../assets/images/settingsProfile.png";
  }

  onChangeAddPerson(profile: File) {
    if (profile) {
      this.addPersonImage = profile;
      const reader = new FileReader();
      reader.readAsDataURL(profile);
      reader.onload = event => {
        this.addPersonImageUrl = reader.result;
      };
    }
  }
 /*Browse file*/

  /*Modal dialog*/
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'dialog001'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openNewRole(content) {
    this.modalService.open(content, {ariaLabelledBy: 'dialog001', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
/*Modal dialog*/


/*Create New Role Modal Settings All Modules checkbox*/
selectAllSettings(){
  this.settingsPermission.map(r => {
    r.isSelected= this.isSelectAllSettings;
  });
}

unSelectAllSettings(isSelected){
 if(!isSelected){
   this.isSelectAllSettings=false;
 }else if(this.settingsPermission.length ===
  this.settingsPermission.filter(r => {return r.isSelected === true}).length){
    this.isSelectAllSettings=true;
 }
}
/*Create New Role Modal Settings All Modules checkbox*/

/*Create New Role Modal Settings View checkbox*/
selectAllSettingsView(){
this.settingsPermission.map(r => {
  r.isSelectedView= this.isSelectAllSettingsView;
});
}

unSelectAllSettingsView(isSelected){
if(!isSelected){
 this.isSelectAllSettingsView=false;
}else if(this.settingsPermission.length ===
this.settingsPermission.filter(r => {return r.isSelectedView === true}).length){
  this.isSelectAllSettingsView=true;
}
}
/*Create New Role Modal Settings View checkbox*/

/*Create New Role Modal Settings Create checkbox*/
selectAllSettingsCreate(){
this.settingsPermission.map(r => {
  r.isSelectedCreate= this.isSelectAllSettingsCreate;
});
}

unSelectAllSettingsCreate(isSelected){
if(!isSelected){
 this.isSelectAllSettingsCreate=false;
}else if(this.settingsPermission.length ===
this.settingsPermission.filter(r => {return r.isSelectedCreate === true}).length){
  this.isSelectAllSettingsCreate=true;
}
}
/*Create New Role Modal Settings Create checkbox*/

/*Create New Role Modal Settings Create checkbox*/
selectAllSettingsEdit(){
this.settingsPermission.map(r => {
  r.isSelectedEdit= this.isSelectAllSettingsEdit;
});
}

unSelectAllSettingsEdit(isSelected){
if(!isSelected){
 this.isSelectAllSettingsEdit=false;
}else if(this.settingsPermission.length ===
this.settingsPermission.filter(r => {return r.isSelectedEdit === true}).length){
  this.isSelectAllSettingsEdit=true;
}
}
/*Create New Role Modal Settings Edit checkbox*/

  ngOnInit(): void {
     /*For Role Table*/
     this.roles = [
      {
        role: 'Operations manager',
        accessLevel: 'Full access'
      },
      {
        role: 'Office manager',
        accessLevel: 'Limited access'
      },
      {
        role: 'Office manager',
        accessLevel: 'View only'
      },
      {
        role: 'Office manager',
        accessLevel: 'Limited access'
      },
      {
        role: 'Office manager',
        accessLevel: 'Edit only'
      },
      {
        role: 'Office manager',
        accessLevel: 'Full access'
      },
      {
        role: 'Office manager',
        accessLevel: 'Limited access'
      },
      {
        role: 'Office manager',
        accessLevel: 'Limited access'
      },
      {
        role: 'Office manager',
        accessLevel: 'Edit only'
      },
      {
        role: 'Office manager',
        accessLevel: 'Limited access'
      },
      {
        role: 'Office manager',
        accessLevel: 'Full access'
      }
    ];

      /*For User Table*/
    this.users = [
      {
        profile:'http://localhost:4200/assets/images/welcomemail-image.jpg',
        user: 'Allen',
        role: 'Operations manager',
        accessLevel: 'Full access'
      },
      {
        profile:'http://localhost:4200/assets/images/user-sample.png',
        user: 'Peterson',
        role: 'Operations manager',
        accessLevel: 'Full access'
      }
    ];
    this.dataSourceRole = new MatTableDataSource(this.roles); /*For Role Table*/
    this.dataSourceUser = new MatTableDataSource(this.users); /*For User Table*/
  }

}
