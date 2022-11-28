import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
//import { start } from 'repl';

@Injectable({
  providedIn: 'root',
})
export class SettingsApiService {
  baseURL = environment.baseUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private httpClient: HttpClient) {}
  // Settings Profile View From
  accountMe(): Observable<any> {
    let API_URL = `${this.baseURL + environment.me}`;
    return this.httpClient.get(API_URL);
  }

  updateProfile(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseURL + environment.profile}`, data);
  }

  changePassword(data: any): Observable<any> {
    return this.httpClient.post(
      `${this.baseURL + environment.changePassword}`,
      data
    );
  }

  getDateFormat() {
    return localStorage.getItem('dateformat');
  }

  setDateFormat(dateformat) {
    console.log('setDateFormat', dateformat)
    localStorage.setItem('dateformat', dateformat);
  }

  getTimeFormat() {
    return localStorage.getItem('timeformat');
  }

  setTimeFormat(timeformat) {
    console.log('setTimeFormat', timeformat)
    localStorage.setItem('timeformat', timeformat);
  }

  preferenceMe(): Observable<any> {
    let API_URL = `${this.baseURL + environment.preference}`;
    return this.httpClient.get(API_URL);
  }

  updatePreference(data: any): Observable<any> {
    return this.httpClient.post(
      `${this.baseURL + environment.preference}`,
      data
    );
  }

  changeProfilePic(profile_pic: any): Observable<any> {
    // Create form data
    const formData = new FormData();

    // Store form name as "file" with file data
    formData.append('profile_pic', profile_pic, profile_pic.name);
    return this.httpClient.post(
      `${this.baseURL + environment.profile_picture}`,
      formData
    );
  }
  removeProfilePic(){
    return this.httpClient.get(`${this.baseURL + environment.profile_picture}`);
  }

  initUserForm(id = ''): Observable<any> {
    var param = "";
    if(id){
      param = "/"+id;
    }
    return this.httpClient.get(`${this.baseURL + environment.users + param}`);
  }

  addUser(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseURL + environment.users}`, data);
  }

  updateUser(data: any, id): Observable<any>{
    return this.httpClient.post(`${this.baseURL + environment.users + "/" + id +"?_method=PUT"}`, data);
  }

  changeUserStatus(status, id){
    return this.httpClient.put(`${this.baseURL + environment.users + "/status/"+ id}`, {user_status: status});
  }

  deleteUser(id): Observable<any>{
    return this.httpClient.delete(`${this.baseURL + environment.users + "/" + id}`);
  }

  listUser(
    sort: string,
    order: string,
    page: number,
    pageSize: number,
    search: string = ''
  ): Observable<any> {
    var start, length;
    var items_per_page = 10;

    var data = {
      search: search,
      start: page * pageSize,
      length: pageSize,
    };
    if (typeof sort != 'undefined' && typeof order != 'undefined') {
      data['order'] = { column: sort, dir: order };
    }
    return this.httpClient.post(
      `${this.baseURL + environment.listusers}`,
      data
    );
  }

  initRoleForm(id = ''): Observable<any> {
    var param = "";
    if(id){
      param = "/"+id;
    }
    return this.httpClient.get(
      `${this.baseURL + environment.roles + param}`
    );
  }

  addRole(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseURL + environment.roles}`, data);
  }
  updateRole(data:any, id): Observable<any>{
    return this.httpClient.post(`${this.baseURL + environment.roles + "/" + id +"?_method=PUT"}`, data);
  }

  changeRoleStatus(status, id){
    return this.httpClient.put(`${this.baseURL + environment.roles + "/status/"+ id}`, {user_status: status});
  }

  listRoles(
    sort: string,
    order: string,
    page: number,
    pageSize: number,
    search: string = ''
  ): Observable<any> {
    var start, length;
    var items_per_page = 10;

    var data = {
      search: search,
      start: page * pageSize,
      length: pageSize,
    };
    if (typeof sort != 'undefined' && typeof order != 'undefined') {
      data['order'] = { column: sort, dir: order };
    }
    return this.httpClient.post(
      `${this.baseURL + environment.listroles}`,
      data
    );
  }
  deleteRole(id): Observable<any>{
    return this.httpClient.delete(`${this.baseURL + environment.roles + "/" + id}`);
  }

  getNotificationSettings(): Observable<any> {
    return this.httpClient.get(`${this.baseURL + environment.notifications}`);
  }

  saveNotificationSettings(data: any): Observable<any> {
    return this.httpClient.post(
      `${this.baseURL + environment.notifications}`,
      data
    );
  }

  addPipeline(data): Observable<any> {
    return this.httpClient.post(
      `${this.baseURL + environment.pipelines}`,
      data
    );
  }

  getPipelineById(id): Observable<any>{
    return this.httpClient.get(`${this.baseURL + environment.pipelines + "/" + id}`);
  }

  listPipelines(
    sort: string,
    order: string,
    page: number,
    pageSize: number,
    search: string = ''
  ): Observable<any> {
    var start, length;
    var items_per_page = 10;

    var data = {
      search: search,
      start: page * pageSize,
      length: pageSize,
    };
    if (typeof sort != 'undefined' && typeof order != 'undefined') {
      data['order'] = { column: sort, dir: order };
    }
    return this.httpClient.post(
      `${this.baseURL + environment.pipelines + "/list"}`,
      data
    );
  }

  updatePipeline(data:any, id): Observable<any>{
    return this.httpClient.put(`${this.baseURL + environment.pipelines + "/" + id}`, data);
  }

  deletePipeline(id): Observable<any>{
    return this.httpClient.delete(`${this.baseURL + environment.pipelines + "/" + id}`);
  }

  deletePipelinee(data): Observable<any>{
    return this.httpClient.delete(`${this.baseURL + environment.pipelines}`, data);
  }
}
