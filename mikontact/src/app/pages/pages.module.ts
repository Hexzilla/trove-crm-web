import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { RouterModule ,  Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LeadsComponent } from './leads/leads.component';
import { LeadTableComponent } from './leads/lead-table/lead-table.component';
import {MaterialModule} from '../material/material.module';
import { SettingsComponent } from './settings/settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DetailComponent, StageDialog, EditDialog, ConfirmDialog, TaskDialog, AppointDialog, StageSnack } from './detail/detail.component';
import { EditorModule } from "@tinymce/tinymce-angular";
import { TextEditorComponent } from './detail/text-editor/text-editor.component';
import { WidgetComponent } from './detail/widget/widget.component';
import { FilterComponent } from './leads/filter/filter.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { UsersrolesComponent } from './settings/usersroles/usersroles.component';
import { AccountComponent } from './settings/account/account.component';
import { NotificationComponent } from './settings/notification/notification.component';
import { DragdropDirective } from './settings/data/dragdrop.directive';
import { DataComponent } from './settings/data/data.component';
import { PipelinestagesComponent } from './settings/pipelinestages/pipelinestages.component';
import { TermsservicesComponent } from './settings/termsservices/termsservices.component';
import { PrivacypolicyComponent } from './settings/privacypolicy/privacypolicy.component';
import { PlanspricingComponent } from './settings/planspricing/planspricing.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { ContactFilterComponent } from './contact/filter/filter.component';
import { ContactComponent, MailDialog } from './contact/contact.component';
import { ContactTableComponent } from './contact/contact-table/contact-table.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { TaskComponent } from './task/task.component';
import { TaskFilterComponent } from './task/task-filter/task-filter.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: PagesComponent },
  // {path:'settings' , loadChildren: () => import('./settings/settings.module') .then(m=>m.SettingsModule)},
  { path: 'settings', component: SettingsComponent },
  { path: 'leads', component: LeadsComponent },
  { path: 'lead_detail', component: DetailComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'contact_detail', component: ContactDetailComponent },
  { path: 'task', component: TaskComponent }
]
@NgModule({
  declarations: [
    PagesComponent,LeadsComponent,LeadTableComponent,SettingsComponent,
    DetailComponent,
    StageDialog,
    EditDialog,
    TaskDialog,
    AppointDialog,
    ConfirmDialog,
    StageSnack,
    TextEditorComponent,
    WidgetComponent,
    FilterComponent,
    ProfileComponent,
    UsersrolesComponent,
    AccountComponent,
    NotificationComponent,
    DragdropDirective,
    DataComponent,
    PipelinestagesComponent,
    TermsservicesComponent,
    PrivacypolicyComponent,
    PlanspricingComponent,
    ContactFilterComponent,
    ContactComponent,
    ContactTableComponent,
    MailDialog,
    ContactDetailComponent,
    TaskComponent,
    TaskFilterComponent
  ],
  imports: [
    CommonModule, RouterModule.forChild(routes), SharedModule, NgbModule,MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    EditorModule,
    SimplebarAngularModule,
    NgxSliderModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  exports:[RouterModule],
})
export class PagesModule { }
