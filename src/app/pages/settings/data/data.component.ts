import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
/*For import history Table*/
export interface IMPORTHISTORY{
  importName: string;
  importType: string;
  importDate: any;
}
/*For import history Table*/
@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
/*For Import History Table*/
displayedImportColumns: any[] = ['importName' , 'importType' , 'importDate'];
dataSourceImport: MatTableDataSource<IMPORTHISTORY>;
importHistory: IMPORTHISTORY[];
/*For Import History Table*/
  constructor() { }

//Drag and drop file upload

files: any[] = [];

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
//Drag and drop file upload
  ngOnInit(): void {
    this.importHistory = [
      {
        importName: 'Edward James',
        importType: 'google contacts',
        importDate: '23/04/2020'
      },
      {
        importName: 'James Anderson',
        importType: 'CSV upload',
        importDate: '24/04/2020'
      }
    ];
    this.dataSourceImport = new MatTableDataSource(this.importHistory)
  }

}
