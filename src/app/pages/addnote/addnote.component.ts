import { NoteApiService } from './../../services/note-api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Subscription,
  Observable,
  of as observableOf,
  BehaviorSubject,
  combineLatest,
  merge,
  Subject,
} from 'rxjs';
import { SnackBarService } from '../../shared/snack-bar.service';
import { extractErrorMessagesFromErrorResponse } from 'src/app/services/extract-error-messages-from-error-response';

import FroalaEditor from 'froala-editor';
//import "froala-editor/css/third_party/embedly.min.css";
//import "froala-editor/js/third_party/embedly.min.js";
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/plugins/file.min.js';
import 'froala-editor/js/plugins/image.min.js';
@Component({
  selector: 'app-addnote',
  templateUrl: './addnote.component.html',
  styleUrls: ['./addnote.component.css'],
})
export class AddnoteComponent implements OnInit {
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 };
  // input data for company,leads,contacts
  optionsPerson: any[] = [
    {
      name: 'Person',
      icon: 'person',
      isChecked: false,
      email: 'sampleperson@gmail.com',
    },
    {
      name: 'Person 2',
      icon: 'person',
      isChecked: false,
      email: 'sampleperson2@gmail.com',
    },
    {
      name: 'Person 3',
      icon: 'person',
      isChecked: false,
      email: 'sampleperson3@gmail.com',
    },
  ];
  optionsCompany: any[] = [
    {
      name: 'Company',
      icon: 'business',
      isChecked: false,
      desc: 'Sample Description',
    },
    {
      name: 'Company 2',
      icon: 'business',
      isChecked: false,
      desc: 'Sample Description2',
    },
    {
      name: 'Company 3',
      icon: 'business',
      isChecked: false,
      desc: 'Sample Description3',
    },
  ];
  optionsLeads: any[] = [
    {
      name: 'Leads',
      icon: 'leaderboard',
      isChecked: false,
      desc: 'Sample Description',
    },
    {
      name: 'Leads 2',
      icon: 'leaderboard',
      isChecked: false,
      desc: 'Sample Description2',
    },
    {
      name: 'Leads 3',
      icon: 'leaderboard',
      isChecked: false,
      desc: 'Sample Description3',
    },
  ];

  selected: any[] = [];

  module = '';
  module_id = '';
  verifyToken = '';
  bearerToken = '';
  verifyTokenResponse;
  noteContent = "";
  logType = "";
  selectedIndex = 0;
  menu_previlages = {};

  private subscriptions: Subscription[] = [];
  // input data for company,leads,contacts
  constructor(
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    private sb: SnackBarService,
    private NoteApiService: NoteApiService
  ) {}

  // input data for company,leads,contacts
  public onSelectionChange(event) {
    if(event.isLead && this.module == 'leads'){
      event.isChecked = true;
      return false;
    } else if(event.isContact && this.module == 'contacts'){
      event.isChecked = true;
      return false;
    } else if(event.isCompany && this.module == 'organizations'){
      event.isChecked = true;
      return false;
    } else {
      if (event.isChecked) {
        this.selected.push(event);
      } else {
        this.deleteSelected(event);
      }
    }
  }

  deleteSelected(e) {
    if(e.isLead && this.module == 'leads'){
      e.isChecked = true;
    } else if(e.isContact && this.module == 'contacts'){
      e.isChecked = true;
    } else if(e.isCompany && this.module == 'organizations'){
      e.isChecked = true;
    } else {
      e.isChecked = false;
      const index = this.selected.indexOf(e);
      this.selected.splice(index, 1);
    }
  }
  // input data for company,leads,contacts

  public titleOptions1: Object = {
    key: 'cJC7bA5D3G2F2C2G2yQNDMIJg1IQNSEa1EUAi1XVFQd1EaG3C2A5D5C4E3D2D4D2B2==',
    charCounterCount: true,
    attribution: false,
    toolbarButtons: [
      ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'clearFormatting'],
      //['fontFamily', 'fontSize', 'backgroundColor', 'textColor'],
      /*['paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '-', 'insertImage', 'embedly',
        'insertTable', 'insertLink'],*/
      ['outdent', 'indent', '-'],
      ['insertFile'],
      //['specialCharacters', 'insertHR', 'clearFormatting'],
      //['print', 'spellChecker'],
      ['undo', 'redo']],
    toolbarSticky: false,
    //language: 'de',
    /*fontFamily: {
      'Arial,Helvetica,sans-serif': 'Arial',
      '\'Courier New\',Courier,monospace': 'Courier New',
      'Georgia,serif': 'Georgia',
      'Impact,Charcoal,sans-serif': 'Impact',
      '\'Lucida Console\',Monaco,monospace': 'Lucida Console',
      'Tahoma,Geneva,sans-serif': 'Tahoma',
      '\'Times New Roman\',Times,serif': 'Times New Roman',
      'Verdana,Geneva,sans-serif': 'Verdana',
    },*/
    //toolbarBottom: true,
    events: {
      initialized: () => {
        console.log('initialized');
      },
      contentChanged: () => {
        console.log('content changed');
      },
    },
  };

  attachmentItems: any[] = [
    {
      name: 'Sales guide to file.docx',
      size: '55kb',
    },
    {
      name: 'Sales guide to file2.docx',
      size: '75kb',
    },
    {
      name: 'Sales guide to file3.docx',
      size: '175kb',
    },
  ];

  ngOnInit(): void {
    //if(this.bearerToken == ""){
      this._Activatedroute.paramMap.subscribe((params) => {
        console.log(params);
        this.module = params.get('module');
        this.module_id = params.get('module_id');
        this.verifyToken = params.get('token');
        if(this.module === 'contacts'){
          this.selectedIndex = 0;
        } else if(this.module === 'organizations'){
          this.selectedIndex = 1;
        } else if(this.module === 'leads'){
          this.selectedIndex = 2;
        }
        this.verifyToken_();
      });
   // }
  }

  verifyToken_() {
    this.optionsPerson = []; this.optionsCompany = []; this.optionsLeads = [];
    const subs_query_param = this.NoteApiService.verifyActivityToken(this.module, this.module_id, this.verifyToken).subscribe(
      (res: any) => {
        if (res.success) {
          console.log("verifyToken_", res);
          this.verifyTokenResponse = res.data;
          this.bearerToken = res.data.token;
          this.menu_previlages = res.data.menu_previlages;
          res.data.associate_members.contacts.forEach((e) => {
            let obj = {
              id: e.id,
              name: e.full_name,
              icon: e.profile_pic,
              isChecked: (this.module === 'contacts') ? true : false,
              email: e.email,
              isContact: true,
            }
            this.optionsPerson.push(obj);
            if(this.module === 'contacts'){
              this.selected.push(obj);
            }
          });
          res.data.associate_members.organizations.forEach((e) => {
            let obj = {
              id: e.id,
              name: e.name,
              icon: 'business',
              isChecked: (this.module === 'organizations') ? true : false,
              desc: '',
              isCompany: true,
            };
            this.optionsCompany.push(obj);
            if(this.module === 'organizations'){
              this.selected.push(obj);
            }
          });
          res.data.associate_members.leads.forEach((e) => {
            let obj = {
              id: e.id,
              name: e.name,
              icon: 'leaderboard',
              isChecked: (this.module === 'leads') ? true : false,
              desc: '',
              isLead: true,
            }
            this.optionsLeads.push(obj);
            if(this.module === 'leads'){
              this.selected.push(obj);
            }
          });
        } else {
          this.triggerSnackBar(res.message, 'Close');
        }
      },
      (errorResponse: HttpErrorResponse) => {
        const messages = extractErrorMessagesFromErrorResponse(errorResponse);
        this.triggerSnackBar(messages.toString(), 'Close');
      }
    );
    this.subscriptions.push(subs_query_param);
  }
  saveNote(){
      let contactArr = []; let companyArr = []; let leadArr = [];
      this.selected.forEach((e) => {
        if(e.isContact){
          contactArr.push(e.id);
        } else if(e.isCompany){
          companyArr.push(e.id);
        } else if(e.isLead) {
          leadArr.push(e.id);
        }
      });

      let postData = {
        notes_to:{
          leads: leadArr,
          organizations: companyArr,
          contacts: contactArr
        },
        description: this.noteContent
      }
      const subs_query_param = this.NoteApiService.addNote(this.module, this.module_id, this.logType, this.bearerToken, postData).subscribe(
        (res: any) => {
          console.log("saveNote", res);
          if (res.success) {
            this.triggerSnackBar(res.message, 'Close');
          } else {
            this.triggerSnackBar(res.message, 'Close');
          }
        },
        (errorResponse: HttpErrorResponse) => {
          const messages = extractErrorMessagesFromErrorResponse(errorResponse);
          this.triggerSnackBar(messages.toString(), 'Close');
        }
      );
      this.subscriptions.push(subs_query_param);

  }
  isInvalid(module){
    //console.log(module, "===", this.module);
    return module === this.module;
  }
  triggerSnackBar(message: string, action: string) {
    this.sb.openSnackBarBottomCenter(message, action);
  }
}
