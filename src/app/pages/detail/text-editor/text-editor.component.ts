import { Component, OnInit, EventEmitter, AfterViewInit, Input, Output } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ContactApiService } from 'src/app/services/contact-api.service';
import { SnackBarService } from 'src/app/shared/snack-bar.service';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})

export class TextEditorComponent implements OnInit {
  //@ViewChild('tabGroup', { static: false })
  @Input() activity: any
  @Input() associate_members = null
  @Output() addActivityEvent = new EventEmitter()

  public tabGroup: any;
  public activeTabIndex: number | undefined = undefined;
  public editorShow: boolean = true;

  selectedAssociates: any[] = []
  selectedEmail: any[] = []
  selectedCall: any[] = []

  private noteEditorContent: string = ''
  private emailEditorContent: string = ''
  private callEditorContent: string = ''
  
  public titleOptions: Object = {
    // placeholderText: 'Edit Your Content Here!',
    // charCounterCount: false,
    // toolbarInline: true,
    key:'cJC7bA5D3G2F2C2G2yQNDMIJg1IQNSEa1EUAi1XVFQd1EaG3C2A5D5C4E3D2D4D2B2==',
    //toolbarBottom: true,
    //imageEditButtons: ['imageReplace', 'imageAlign', 'imageRemove', '|', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '-', 'imageDisplay', 'imageStyle', 'imageAlt', 'imageSize'],
    //toolbarButtons : ["bold", "italic", "underline", "|", "align", "formatOL", "formatUL"],
    fileUploadParam: 'files',
    fileUploadURL: 'http://localhost:4200/pages/company_detail/upload_file',
    fileUploadParams: {id: 'my_editor'},
    fileUploadMethod: 'POST',
    fileMaxSize: 2 * 1024 * 1024,
    fileAllowedTypes: ['application/zip'],
    events: {
      'initialized': () => {
        console.log('initialized');
      },
      'file.beforeUpload': function (files) {
        // Return false if you want to stop the file upload.
        console.log('file.beforeUpload')
      },
      'file.uploaded': function (response) {
        console.log('file.uploaded')
      },
      'file.inserted': function ($file, response) {
        console.log('file.inserted')
      },
      'file.error': function (error, response) {
        console.log('error', error)
      }
    }
  }

  constructor(
    private contactService: ContactApiService,
    private sb: SnackBarService
    ) {
    this.activeTabIndex = 0;
    this.associate_members = {
      contacts: [],
      organizations: [],
      leads: []
    }
  }

  public handleTabChange(e: MatTabChangeEvent) {
    this.activeTabIndex = e.index;
    console.log('tabIndex', this.activeTabIndex)
  }

  ngOnInit(): void {
    console.log('text-editor', this.activity)
  }

  ngOnChanges(): void {
    console.log('text-editor-ngOnChanges', this.activity, this.associate_members)
    if (this.activity) {
      if (this.activity.activity_name === 'note') this.activeTabIndex = 0;
      else if (this.activity.activity_name === 'email') this.activeTabIndex = 1;
      else if (this.activity.activity_name === 'call') this.activeTabIndex = 2;
    }
  }

  triggerSnackBar(message: string) {
    this.sb.openSnackBarBottomCenter(message, 'Close');
  }

  public onSelectionChange(event, item) {
    if (event.checked) {
      this.selectedAssociates.push(item);
    }
    else{
      this.deleteSelected(item);
    }
  }

  deleteSelected(item) {
    const index = this.selectedAssociates.indexOf(item)
    this.selectedAssociates.splice(index, 1)
  }

  // ngAfterViewInit(): void {
  //   this.activeTabIndex = this.tabGroup.selectedIndex;
  // }

  public showEditor() {
    this.editorShow = true
  }

  public hideEditor() {
    //this.editorShow = false
  }

  private findAssociatedContact(contact) {
    return this.associate_members.contacts.find(it => it.id == contact.id)
  }

  private findAssociatedCompany(company) {
    return this.associate_members.organizations.find(it => it.id == company.id)
  }

  private findAssociatedLead(lead) {
    return this.associate_members.leads.find(it => it.id == lead.id)
  }

  public saveNote() {
    const payload = this.getActivityPayload(this.noteEditorContent)
    payload && this.addActivityEvent.emit({ type: 'note', data: payload })
  }

  public saveEmail() {
    const payload = this.getActivityPayload(this.emailEditorContent)
    payload && this.addActivityEvent.emit({ type: 'email', data: payload })
  }

  public saveCall() {
    const payload = this.getActivityPayload(this.callEditorContent)
    payload && this.addActivityEvent.emit({ type: 'call', data: payload })
  }

  private getActivityPayload(contents: string) {
    console.log('getActivityPayload', contents)
    if (this.selectedAssociates.length <= 0) {
      this.triggerSnackBar("Select who are associated with")
      return
    }
    if (contents.length <= 0) {
      this.triggerSnackBar("Please input contents")
      return
    }

    const temp_notes = {
      contacts: [],
      organizations: [],
      leads: []
    }
    for (let item of this.selectedAssociates) {
      if (this.findAssociatedContact(item)) {
        temp_notes.contacts.push(item.id)
      }
      else if (this.findAssociatedCompany(item)) {
        temp_notes.organizations.push(item.id)
      }
      else if (this.findAssociatedLead(item)) {
        temp_notes.leads.push(item.id)
      }
    }

    const notes_to = {}
    for (let key in temp_notes) {
      if (temp_notes[key].length > 0) {
        notes_to[key] = temp_notes[key]
      }
    }
    return {
      notes_to: notes_to,
      description: contents
    }
  }
}
