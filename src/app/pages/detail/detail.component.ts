import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig, MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { LeadDialog } from 'src/app/shared/header/header.component';
import { AppointDialog } from './appoint-dialog/appoint-dialog';
import { TaskDialog } from './task-dialog/task-dialog';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  stages: string[];
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }

  status:string = "Progress"

  selectedStage: number

  // selectedDisplay = "all"

  constructor(private router: Router, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.stages = ["Discovery", "Qualified", "Evolution", "Negotiation", "Closed"]

  }

  goToList() {
    this.router.navigate(['/pages/leads']);
  }

  getStageClass(i) {
    if (i == 0) {
      return "stage-first stage-item"
    } else {
      return "stage-item"
    }
  }

  clickStage(index) {
    this.selectedStage = index
  }

  openStageDialog(): void {
    const dialogRef = this.dialog.open(StageDialog, {
      width: '470px'
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.data && result.data == 'create') {
        let stageName = result.name
        !stageName && (stageName = 'Demo')
        this.stages.push(stageName)
        this.selectedStage = this.stages.length - 1

        this._snackBar.openFromComponent(StageSnack, {
          data: { name: stageName},
          panelClass: 'stage-success',
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        })
      }
    })
  }

  openEditDialog() {
    const dialogRef = this.dialog.open(EditDialog, {
      width: '560px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('result ', result)
      if (result && result.data && result.data == 'delete') {
        this.openConfirmDialog()
      }
    })
  }

  openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '560px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog sent: ${result}`);

    })
  }

  openTaskDialog(isEdit: boolean) {
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '405px',
      data : { isEdit: isEdit}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog sent: ${result}`);

    })
  }

  openAppointDialog(isEdit: boolean) {
    const dialogRef = this.dialog.open(AppointDialog, {
      width: '740px',
      data : { isEdit: isEdit}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog sent: ${result}`);

    })
  }

  getLeftOffset(index) {
    return -10 * index
  }

  getStageSrc(index) {
    // if (index == 0) {
    //   if (this.selectedStage == 0)  {
    //     return '../../../assets/images/stage/start-active-stage-lg.svg'
    //   } else {
    //     return '../../../assets/images/stage/start-stage-lg.svg'
    //   }
    // }
    if (index == this.selectedStage) {
      return '../../../assets/images/stage/active-stage-lg.svg'
    }
    return '../../../assets/images/stage/mid-stage-lg.svg'
  }
  editLead() {
    const dialogRef = this.dialog.open(LeadDialog, {
      width: '560px',
      autoFocus: false,
      data : { isEdit : true}
    })
    dialogRef.afterClosed().subscribe(result => {
    })
  }
}

// Dialogs
@Component({
  selector: 'stage-dialog',
  templateUrl: 'stage-dialog/stage-dialog.html',
  styleUrls: ['stage-dialog/stage-dialog.css']
})
export class StageDialog {

  public stageName:string = "Demo"
  stagePosition = "before"

  constructor(
    public dialogRef: MatDialogRef<StageDialog>
    // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRef.close({data: 'cancel'});
  }

  onCreateClick() {
    console.log('stage name', this.stageName)
    this.dialogRef.close({data: 'create', name: this.stageName});
  }

}

@Component({
  selector: 'edit-dialog',
  templateUrl: 'edit-dialog/edit-dialog.html',
  styleUrls: ['edit-dialog/edit-dialog.css']
})
export class EditDialog {
  searchControl = new FormControl()
  options: string[] = ['Lead Name', 'Primary Contact', 'Value', 'Company', 'Owner', 'Source', 'Secondary Contact',
                      'Added On']
  filteredOptions: Observable<string[]>

  showMandatory: boolean = false
  search: string = ''

  constructor(
    public dialogRef: MatDialogRef<EditDialog>
    // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.filteredOptions = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      )
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  checkMandatory(e) {
    this.showMandatory = e.checked
  }

  onNoClick(): void {
    this.dialogRef.close({ data: 'cancel' })
  }

  onDeleteClick() {
    this.dialogRef.close({ data: 'delete' })
  }

  checkShow(name) {
    if (!this.search)
      return true
    if (name.toUpperCase().search(this.search.toUpperCase()) == -1)
      return false
    else
      return true
  }
}

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog/confirm-dialog.html',
  styleUrls: ['confirm-dialog/confirm-dialog.css']
})
export class ConfirmDialog {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialog>
    // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'stage-snack',
  templateUrl: 'stage-snack/stage-snack.html',
  styleUrls: ['stage-snack/stage-snack.css']
})
export class StageSnack {
  constructor(
    public snackBarRef: MatSnackBarRef<StageSnack>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}
