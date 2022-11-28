import { Component, OnInit } from '@angular/core';
import {SnackBarService} from '../../../shared/snack-bar.service'
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contact-activitylist',
  templateUrl: './contact-activitylist.component.html',
  styleUrls: ['./contact-activitylist.component.css']
})
export class ContactActivitylistComponent implements OnInit {
  selectedDisplay = "all"
  /*Modal dialog*/
  closeResult = '';
  /*Modal dialog*/
  constructor(private modalService: NgbModal ,  private sb: SnackBarService) { }

  triggerSnackBar(message:string, action:string) {
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
      ngOnInit(): void {
      }

    }
