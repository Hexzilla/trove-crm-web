import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SnackBarService } from '../../../shared/snack-bar.service';

import { extractErrorMessagesFromErrorResponse } from '../../../services/extract-error-messages-from-error-response';
import { FormStatus } from '../../../services/form-status';

import { SettingsApiService } from 'src/app/services/settings-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Subscription,
  Observable,
  of as observableOf,
  BehaviorSubject,
  combineLatest,
  merge,
} from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';

/*For PipelineStages Table*/
export interface PIPELINESTAGE {
  pipelineStages: string;
  dealStages: any;
}
/*For PipelineStages Table*/
@Component({
  selector: 'app-pipelinestages',
  templateUrl: './pipelinestages.component.html',
  styleUrls: ['./pipelinestages.component.css'],
})
export class PipelinestagesComponent implements OnInit,AfterViewInit {
  /*For PipelineStages Table*/
  displayedPipelineColumns: any[] = ['pipelineStages', 'dealStages', 'action'];
  dataSourcePipeline: MatTableDataSource<PIPELINESTAGE>;
  pipelines: PIPELINESTAGE[];
  /*For PipelineStages Table*/
  /*Form Validation*/
  addPipelineForm: FormGroup;
  initPipelineForm(data: any = []) {
    if (data) {
      this.updatePipelineId = data.id;
      this.addPipelineForm = this.fb.group({
        pipeline: [data.name, Validators.required],
      });
    } else {
      this.addPipelineForm = this.fb.group({
        pipeline: ['', Validators.required],
        /*stages: this.fb.array([
          this.addPipelineStage()
        ])*/
      });
    }
  }
  /*Form Validation*/
  closeResult = '';


  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private sb: SnackBarService,
    private settingsApiService: SettingsApiService,
    private cdref: ChangeDetectorRef
  ) {
    this.initPipelineForm();
  }

  /*Modal dialog*/
  open(content, id = '') {
    if (id) {
      this.settingsApiService.getPipelineById(id).subscribe(
        (res: any) => {
          if (res.success) {
            if (res.data.menu_previlages.create == 1) {
              this.initPipelineForm(res.data.id);
              if (res.data.id.stages) {
                this.dragElements = [];
                var self = this;
                res.data.id.stages.forEach(function (value, key) {
                  self.dragElements.push({
                    id: value.id,
                    name: value.name,
                    order: value.order,
                    probability: value.probability,
                  });
                });
              }
              this.modalService
                .open(content, { ariaLabelledBy: 'dialog001' })
                .result.then(
                  (result) => {
                    this.closeResult = `Closed with: ${result}`;
                  },
                  (reason) => {
                    this.closeModal();
                    this.closeResult = `Dismissed ${this.getDismissReason(
                      reason
                    )}`;
                  }
                );
            } else {
              this.triggerSnackBar(res.message, 'Close');
            }
          } else {
            this.triggerSnackBar(res.message, 'Close');
          }
        },
        (errorResponse: HttpErrorResponse) => {
          const messages = extractErrorMessagesFromErrorResponse(errorResponse);
          this.triggerSnackBar(messages.toString(), 'Close');
        }
      );
    } else {
      this.dragElements = [];
      this.addPipelineStage();
      this.initPipelineForm();
      this.modalService
        .open(content, { ariaLabelledBy: 'dialog001' })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeModal();
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }
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
  dragElements: any = [];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.dragElements, event.previousIndex, event.currentIndex);
  }

  // add pipeline method

  addPipelineStage(): void {
    this.dragElements.push({
      name: '',
      order: 0,
      probability: 0,
    });
    this.calculateProbability();
  }
  // remove pipeline method
  removePipelineStage(index: number) {
    this.dragElements.splice(index, 1);
    this.calculateProbability();
  }

  // Pipeline drag and drop
  ngOnInit(): void {
    // For Pipeline table
    this.addPipelineStage();
  }
  ngAfterViewInit() {
    this.listPipelines();
  }
  /** ========================================================================================= */
  displayedColumnsPipeline: string[] = ['name', 'stages_count', 'action'];
  formStatus = new FormStatus();
  private subscriptions: Subscription[] = [];
  errors = [];
  menu_previlages = {
    create: 0,
    delete: 0,
    edit: 0,
    view: 0,
  };

  PipelineList: Observable<any[]>;
  filterValue = '';
  updatePipelineId = '';
  deletePipelineId = '';
  pipelineConfirmationForDelete = false;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  savePipeline() {
    var self = this;
    if (!this.addPipelineForm.valid) {
      return false;
    } else {
      // 2 - Call onFormSubmitting to handle setting the form as submitted and
      //     clearing the error and success messages array
      this.formStatus.onFormSubmitting();
      this.dragElements.map((r, key) => {
        r.order = key + 1;
      });
      const formData = {
        pipeline_name: this.addPipelineForm.get('pipeline').value,
        stages: this.dragElements,
      };
      if(this.updatePipelineId){
        const subs_query_param = this.settingsApiService
        .updatePipeline(formData, this.updatePipelineId)
        .subscribe(
          (res: any) => {
            this.triggerSnackBar(res.message, 'Close');
            this.modalService.dismissAll();
            this.listPipelines();
          },
          (errorResponse: HttpErrorResponse) => {
            const messages = extractErrorMessagesFromErrorResponse(
              errorResponse
            );
            this.stageServerError(errorResponse);
            this.triggerSnackBar(messages.toString(), 'Close');
          }
        );
      this.subscriptions.push(subs_query_param);
      } else {
        const subs_query_param = this.settingsApiService
        .addPipeline(formData)
        .subscribe(
          (res: any) => {
            this.triggerSnackBar(res.message, 'Close');
            this.modalService.dismissAll();
            this.listPipelines();
          },
          (errorResponse: HttpErrorResponse) => {
            this.errors = errorResponse.error.data;
            const messages = extractErrorMessagesFromErrorResponse(
              errorResponse
            );
            //this.addPipelineForm.setErrors({ 'invalid': true });
            this.stageServerError(errorResponse);
            this.triggerSnackBar(messages.toString(), 'Close');
          }
        );
      this.subscriptions.push(subs_query_param);
      }
    }
  }

  listPipelines() {
    this.PipelineList = merge(this.sort.sortChange, this.paginator.page).pipe(
      // startWith([undefined, ]),
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.settingsApiService.listPipelines(
          this.sort.active,
          this.sort.direction,
          this.paginator.pageIndex,
          this.paginator.pageSize
        );
      }),
      map((data) => {
        // Flip flag to show that loading has finished.
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = data.data.recordsTotal;
        this.menu_previlages = data.menu_previlages;
        /*this.menu_previlages.create = data.menu_previlages.create;
        this.menu_previlages.delete = data.menu_previlages.delete;
        this.menu_previlages.edit = data.menu_previlages.edit;
        this.menu_previlages.view = data.menu_previlages.view;*/
        return data.data.data;
      }),
      catchError(() => {
        this.isLoadingResults = false;
        // Catch if the API has reached its rate limit. Return empty data.
        this.isRateLimitReached = true;
        return observableOf([]);
      })
    );
  }

  deleteModal(content, id) {
    this.deletePipelineId = id;
    this.modalService
      .open(content, { ariaLabelledBy: 'dialog001' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeModal();
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  deletePipeline(id) {
    this.settingsApiService.deletePipeline(id).subscribe(
      (res: any) => {
        if (res.success) {
          this.triggerSnackBar(res.message, 'Close');
          this.modalService.dismissAll();
          this.listPipelines();
          this.deletePipelineId = '';
          this.pipelineConfirmationForDelete = false;
        } else {
          this.triggerSnackBar(res.message, 'Close');
        }
      },
      (errorResponse: HttpErrorResponse) => {
        const messages = extractErrorMessagesFromErrorResponse(errorResponse);
        this.triggerSnackBar(messages.toString(), 'Close');
      }
    );
  }

  closeModal() {
    this.updatePipelineId = '';
    this.deletePipelineId = '';
    this.modalService.dismissAll();
  }

  resetPagingRole(): void {
    this.paginator.pageIndex = 0;
  }

  //defining method for display of SnackBar
  triggerSnackBar(message: string, action: string) {
    this.sb.openSnackBarBottomCenter(message, action);
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
  markAsPristine(){
    this.addPipelineForm.markAsPristine();
    this.addPipelineForm.controls.value.markAsDirty();
  }
  stagename(event, obj){
    var text = event.target.value;
    if(text){
      //this.addPipelineForm.setErrors({ 'valid': true });
      delete obj.errors;
    } else {
      //this.addPipelineForm.setErrors({ 'invalid': true });
      if(!("errors" in obj)){
        obj['errors'] = [];
      }
      if(!obj['errors'].includes('stage name is required')){
        obj['errors'].push('stage name is required');
      }
    }
  }
  stageprobability(event, obj){
    var text = event.target.value;
    if(text > 0){
      //this.addPipelineForm.setErrors({ 'valid': true });
      delete obj.errors;
    } else {
      //this.addPipelineForm.setErrors({ 'invalid': true });
      if(!("errors" in obj)){
        obj['errors'] = [];
      }
      if(!obj['errors'].includes('stage probability must be 1')){
        obj['errors'].push('stage probability must be 1');
      }

    }
  }
  stageServerError(errorResponse){
    this.dragElements.forEach(function(v){ delete v.errors });
    for (const property in errorResponse.error.data) {
      var myArray = property.split('.');
      if(myArray.length == 3){
        if(!("errors" in this.dragElements[myArray[1]])){
          this.dragElements[myArray[1]]['errors'] = [];
        }
        const propertyErrors: Array<string> = errorResponse.error.data[property];
        propertyErrors.forEach(error => this.dragElements[myArray[1]]['errors'].push(error));
        this.dragElements[myArray[1]]['errors'] = Array.from(new Set(this.dragElements[myArray[1]]['errors']));
      }
    };
  }

  calculateProbability(){
    var total = this.dragElements.length;
    var percent = 100;
    var probabilityValue = percent/total;
    this.dragElements.forEach(function(v){
      v.probability = probabilityValue;
    });
  }
}
