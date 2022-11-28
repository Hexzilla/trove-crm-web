import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {SnackBarService} from '../../../shared/snack-bar.service';
/*For PipelineStages Table*/
export interface PIPELINESTAGE {
  pipelineStages: string;
  dealStages: any;
}
/*For PipelineStages Table*/
@Component({
  selector: 'app-pipelinestages',
  templateUrl: './pipelinestages.component.html',
  styleUrls: ['./pipelinestages.component.css']
})
export class PipelinestagesComponent implements OnInit {
/*For PipelineStages Table*/
displayedPipelineColumns: any[] = ['pipelineStages', 'dealStages', 'action'];
dataSourcePipeline: MatTableDataSource<PIPELINESTAGE>;
pipelines: PIPELINESTAGE[];
/*For PipelineStages Table*/
/*Form Validation*/
addPipelineForm: FormGroup;
addPipeline(){
  this.addPipelineForm = this.fb.group({
     pipeline: ['', Validators.required]
  });
}
/*Form Validation*/
/*Modal dialog*/
closeResult = '';
/*Modal dialog*/

  constructor(private modalService: NgbModal , private fb: FormBuilder,
    private sb: SnackBarService) {
      this.addPipeline();
     }
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

// Pipeline drag and drop
dragElements:any = [
  {
    name: 'Discovery',
    value: '95%'
  },
  {
    name: 'Qualified',
    value: '65%'

  },
  {
    name: 'Evaluation',
    value: '75%'

  },
  {
    name: 'Closed',
    value: '45%'

  },
  {
    name: 'Negotiation',
    value: '25%'

  }

];

drop(event: CdkDragDrop<string[]>) {
  moveItemInArray(this.dragElements, event.previousIndex, event.currentIndex);
}

// add pipeline method

addPipelineStage(){
   this.dragElements.push({
     name: 'Sample',
     value:'0%'
   })
}
// remove pipeline method
removePipelineStage(index:number){
    this.dragElements.splice(index,1);
}
// Pipeline drag and drop
  ngOnInit(): void {
    // For Pipeline table
    this.pipelines = [
      {
        pipelineStages: 'Mobile/Web App Development',
        dealStages: 4
      },
      {
        pipelineStages: 'Sales Pipeline',
        dealStages: 5,
      },
      {
        pipelineStages: 'Demo',
        dealStages: 6
      }
    ];
    // For Imports History Table
    this.dataSourcePipeline = new MatTableDataSource(this.pipelines)
  }

}
