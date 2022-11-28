import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { database } from 'firebase';

@Injectable({
  providedIn: 'root'
})

export class DashboardApiService {
    
    private dashboardSubject: ReplaySubject<any> = new ReplaySubject()
    dashboardObserver: Observable<any> = this.dashboardSubject.asObservable()
    
    baseURL = environment.baseUrl;

    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    
  constructor(private httpClient: HttpClient) { }
  
    getDashboard(): Observable<any> {
        const API_URL = `${this.baseURL + environment.dashboard}`
        return this.httpClient.get(API_URL)
    }
    changeTaskStatus(data):Observable<any> {
        const API_URL = `${
        this.baseURL + environment.taskstatus
      }/${data.taskid}`
        return this.httpClient.put(API_URL,data)
    }
  // Handle Errors
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  ngOnDestroy() {
    
  }
}
