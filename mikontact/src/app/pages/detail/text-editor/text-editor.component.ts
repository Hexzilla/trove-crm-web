import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})

export class TextEditorComponent implements AfterViewInit {
  @ViewChild('tabGroup', { static: false })

  public tabGroup: any;
  public activeTabIndex: number | undefined = undefined;
  public editorShow: boolean = false;

  public titleOptions1: Object = {
    // placeholderText: 'Edit Your Content Here!',
    // charCounterCount: false,
    // toolbarInline: true,
    key:'cJC7bA5D3G2F2C2G2yQNDMIJg1IQNSEa1EUAi1XVFQd1EaG3C2A5D5C4E3D2D4D2B2==',
    toolbarBottom: true,
    events: {
      "initialized": () => {
        console.log('initialized');
      },
      "contentChanged": () => {
        console.log("content changed");
      }
    }
  }

  public titleOptions2: Object = {
    // placeholderText: 'Edit Your Content Here!',
    // charCounterCount: false,
    // toolbarInline: true,
    key:'cJC7bA5D3G2F2C2G2yQNDMIJg1IQNSEa1EUAi1XVFQd1EaG3C2A5D5C4E3D2D4D2B2==',
    toolbarBottom: true,
    events: {
      "initialized": () => {
        console.log('initialized');
      },
      "contentChanged": () => {
        console.log("content changed");
      }
    }
  }

  public titleOptions3: Object = {
    // placeholderText: 'Edit Your Content Here!',
    // charCounterCount: false,
    // toolbarInline: true,
    key:'cJC7bA5D3G2F2C2G2yQNDMIJg1IQNSEa1EUAi1XVFQd1EaG3C2A5D5C4E3D2D4D2B2==',
    toolbarBottom: true,
    events: {
      "initialized": () => {
        console.log('initialized');
      },
      "contentChanged": () => {
        console.log("content changed");
      }
    }
  }
  
  public handleTabChange(e: MatTabChangeEvent) {
    this.activeTabIndex = e.index;
    console.log('tabIndex', this.activeTabIndex)
  }

  constructor() {
    this.activeTabIndex = 0
  }

  ngAfterViewInit(): void {
    this.activeTabIndex = this.tabGroup.selectedIndex;
  }

  public showEditor() {
    this.editorShow = true
  }

  public hideEditor() {
    this.editorShow = false
  }
}
