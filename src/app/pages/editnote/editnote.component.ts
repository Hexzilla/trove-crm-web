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

@Component({
  selector: 'app-editnote',
  templateUrl: './editnote.component.html',
  styleUrls: ['./editnote.component.css'],
})
export class EditnoteComponent implements OnInit {
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
  // input data for company,leads,contacts
  module = '';
  module_id = '';
  verifyToken = '';
  bearerToken = '';
  verifyTokenResponse;
  noteContent = '';
  logType = '';
  logTypeId = '';
  selectedIndex = 0;
  menu_previlages = {};
  activity;

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
    // toolbarBottom: true,
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
      this.logType = params.get('type');
      this.logTypeId = params.get('type_id');
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
    const subs_query_param = this.NoteApiService.verifyActivityTokenForEdit(this.module, this.module_id, this.logType, this.logTypeId,  this.verifyToken).subscribe(
      (res: any) => {
        if (res.success) {
          console.log("verifyToken_", res);
          this.verifyTokenResponse = res.data;
          this.bearerToken = res.data.token;
          this.activity = res.data.activity;
          this.menu_previlages = res.data.menu_previlages;
          this.noteContent = this.activity.description;

          res.data.associate_members.contacts.forEach((e) => {
            this.optionsPerson.push({
              id: e.id,
              name: e.full_name,
              icon: e.profile_pic,
              isChecked: false,
              email: e.email,
              isContact: true,
            });
          });
          res.data.associate_members.organizations.forEach((e) => {
            this.optionsCompany.push({
              id: e.id,
              name: e.name,
              icon: 'business',
              isChecked: false,
              desc: '',
              isCompany: true,
            });
          });
          res.data.associate_members.leads.forEach((e) => {
            this.optionsLeads.push({
              id: e.id,
              name: e.name,
              icon: 'leaderboard',
              isChecked: false,
              desc: '',
              isLead: true,
            });
          });
          if(this.activity.associate_name){
            if(this.activity.associate_name.Lead){
              console.log("this.optionsLeads", this.optionsLeads);
              this.activity.associate_name.Lead.forEach((e) => {
                let obj = {
                  id: e.id,
                  name: e.name,
                  icon: 'leaderboard',
                  isChecked: false,
                  desc: '',
                  isLead: true,
                };
                /*const index = this.optionsLeads.indexOf(obj);
                console.log("associate_name -> Lead -> index", index, obj);
                if(index >= 0){
                  this.optionsLeads[index].isChecked = true;
                }*/
                var result = this.optionsLeads.find(arrobj => {
                  if(arrobj.id === obj.id){
                    arrobj.isChecked = true;
                    return true;
                  }
                  return false;
                });
                obj.isChecked = true;
                this.selected.push(obj);
              })
            }
            if(this.activity.associate_name.Organization){
              this.activity.associate_name.Organization.forEach((e) => {
                let obj = {
                  id: e.id,
                  name: e.name,
                  icon: 'business',
                  isChecked: false,
                  desc: '',
                  isCompany: true,
                };
                /*const index = this.optionsCompany.indexOf(obj);
                console.log("associate_name -> Organization -> index", index);
                if(index >= 0){
                  this.optionsCompany[index].isChecked = true;
                }*/
                var result = this.optionsCompany.find(arrobj => {
                  if(arrobj.id === obj.id){
                    arrobj.isChecked = true;
                    return true;
                  }
                  return false;
                });
                obj.isChecked = true;
                this.selected.push(obj);
              })
            }
            if(this.activity.associate_name.Contact){
              this.activity.associate_name.Contact.forEach((e) => {
                let obj = {
                  id: e.id,
                  name: e.name,
                  icon: e.profile_pic,
                  isChecked: false,
                  email: e.email,
                  isContact: true,
                }
                /*const index = this.optionsPerson.indexOf(obj);
                console.log("associate_name -> Contact -> index", index);
                if(index >= 0){
                  this.optionsPerson[index].isChecked = true;
                }*/
                var result = this.optionsPerson.find(arrobj => {
                  if(arrobj.id === obj.id){
                    arrobj.isChecked = true;
                    return true;
                  }
                  return false;
                });
                obj.isChecked = true;
                this.selected.push(obj);
              })
            }
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
    this.subscriptions.push(subs_query_param);
  }
  updateActivity(){
    let contactArr = []; let companyArr = []; let leadArr = [];
    if(this.selected.length > 0){
      this.selected.forEach((e) => {
        if(e.isContact){
          contactArr.push(e.id);
        } else if(e.isCompany){
          companyArr.push(e.id);
        } else if(e.isLead) {
          leadArr.push(e.id);
        }
      });
    }

    let postData = {
      notes_to:{
        leads: leadArr,
        organizations: companyArr,
        contacts: contactArr
      },
      description: this.noteContent
    }
    const subs_query_param = this.NoteApiService.updateActivity(this.module, this.module_id, this.logType, this.logTypeId, this.bearerToken, postData).subscribe(
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
