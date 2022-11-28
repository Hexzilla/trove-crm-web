import {Component, OnInit} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
import { SnackBarService } from '../../../shared/snack-bar.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  /*Browse File*/
  profile: File = null;
  imageUrl: string | ArrayBuffer = "../../../assets/images/settingsProfile.png";
/*Browse File*/
  changePasswordForm: FormGroup;
  changePassword() {
   this.changePasswordForm = this.fb.group({
      oldpassword: ['', Validators.required ],
      newpassword:['', Validators.required],
      confirmpassword:['', Validators.required]
   });
 }
 closeResult = '';

//  constructor starts
  constructor(private modalService: NgbModal , private fb: FormBuilder,
    private sb: SnackBarService) {
      this.changePassword();
     }
//  constructor ends

//defining method for display of SnackBar
  triggerSnackBar(message:string, action:string)
  {
   this.sb.openSnackBarBottomCenter(message, action);
  }
    /*Modal dialog*/
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'dialog001'}).result.then((result) => {
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

profilePicture(event){
  this.profile=event.target.files[0];
}
removeProfilePicture(){
  this.profile = null;
  this.imageUrl="../../../assets/images/settingsProfile.png";
}
onChangeProfile(profile: File) {
  if (profile) {
    this.profile = profile;
    const reader = new FileReader();
    reader.readAsDataURL(profile);
    reader.onload = event => {
      this.imageUrl = reader.result;
    };
  }
}

  ngOnInit(): void {
  }

}
