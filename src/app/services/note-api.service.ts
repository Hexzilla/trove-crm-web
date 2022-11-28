import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
  HttpBackend
} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class NoteApiService {

  baseURL = environment.baseUrl;
  /*httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth_token}` }),
  };*/
  constructor(private httpClient: HttpClient, private handler: HttpBackend) {}

  verifyActivityToken(module, module_id, token): Observable<any>{
    return this.httpClient.get(`${this.baseURL + environment.verifyActivity + "/" + module + "/" + module_id + "/" + token}`);
  }
  verifyActivityTokenForEdit(module, module_id, type, type_id, token): Observable<any>{
    return this.httpClient.get(`${this.baseURL + environment.verifyActivity + "/" + module + "/" + module_id + "/" + type + "/" + type_id + "/" + token}`);
  }

  addNote(module,module_id,type,token, data): Observable<any>{
    this.httpClient = new HttpClient(this.handler);
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }),
    };
    return this.httpClient.post(
      `${this.baseURL + environment.activity + "/" + module + "/" + module_id + "/" + type}`,
      data,
      httpOptions
    );
  }
  updateActivity(module,module_id,type, type_id, token, data): Observable<any>{
    this.httpClient = new HttpClient(this.handler);
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }),
    };
    return this.httpClient.put(
      `${this.baseURL + environment.activity + "/" + module + "/" + module_id + "/" + type + "/" + type_id}`,
      data,
      httpOptions
    );
  }
}
