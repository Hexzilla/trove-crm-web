import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { SnackbarComponent } from './snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  horizontalPositionLeft: MatSnackBarHorizontalPosition = 'left';
  horizontalPositionCenter: MatSnackBarHorizontalPosition = 'center';
  horizontalPositionRight: MatSnackBarHorizontalPosition = 'right';
  verticalPositionTop: MatSnackBarVerticalPosition = 'top';
  verticalPositionBottom: MatSnackBarVerticalPosition = 'bottom';
  constructor(private snackBar:MatSnackBar) { }

  openSnackBarTopLeft(message: string, action: string) {
    this.snackBar.open(message, action, {
       duration: 2000,
       horizontalPosition: this.horizontalPositionLeft,
       verticalPosition: this.verticalPositionTop,
    });
  }

  openSnackBarTopCenter(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, {
       duration: 2000,
       horizontalPosition: this.horizontalPositionCenter,
       verticalPosition: this.verticalPositionTop,
    });
  }

  openSnackBarTopCenterAsDuration(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, {
       duration: duration,
       horizontalPosition: this.horizontalPositionCenter,
       verticalPosition: this.verticalPositionTop,
    });
  }

  openSnackBarTopRight(message: string, action: string) {
    this.snackBar.open(message, action, {
       duration: 2000,
       horizontalPosition: this.horizontalPositionRight,
       verticalPosition: this.verticalPositionTop,
    });
  }

  openSnackBarBottomLeft(message: string, action: string) {
    this.snackBar.open(message, action, {
       duration: 2000,
       horizontalPosition: this.horizontalPositionLeft,
       verticalPosition: this.verticalPositionBottom,
    });
  }

  openSnackBarBottomCenter(message: string, action: string) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: {
         message: message,
         action : action
      },
       duration: 2000,
       horizontalPosition: this.horizontalPositionCenter,
       verticalPosition: this.verticalPositionBottom,
       panelClass: 'themeSnackbar'
    });
  }

  openSnackBarBottomRight(message: string, action: string) {
    this.snackBar.open(message, action, {
       duration: 2000,
       horizontalPosition: this.horizontalPositionRight,
       verticalPosition: this.verticalPositionBottom,
    });
  }
}

