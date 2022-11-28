import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, ReplaySubject, throwError } from 'rxjs'
import { environment } from 'src/environments/environment'
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class ContactApiService {
  private companySubject: ReplaySubject<any> = new ReplaySubject()
  companyObserver: Observable<any> = this.companySubject.asObservable()

  private companyDetailSubject: ReplaySubject<any> = new ReplaySubject()
  companyDetailObserver: Observable<any> = this.companyDetailSubject.asObservable()

  private contactSubject: ReplaySubject<any> = new ReplaySubject()
  contactObserver: Observable<any> = this.contactSubject.asObservable()

  baseURL = environment.baseUrl
  public searchText: string = null

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }

  public companyData = null
  public contactData = null

  constructor(private httpClient: HttpClient) {}

  /* Contact API Service */
  getContacts(): Observable<any> {
    const API_URL = `${this.baseURL + environment.contacts}`
    return this.httpClient.get(API_URL)
  }

  createContact(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseURL + environment.contacts}`, data)
  }

  getContactList(data): Observable<any> {
    const API_URL = `${this.baseURL + environment.contacts_index}`
    return this.httpClient.post(API_URL, data)
  }

  deleteContact(companyIds: any[]): Observable<any> {
    if (companyIds.length > 1) {
      const data = { ids: companyIds }
      const API_URL = `${this.baseURL + environment.contacts_delete_multiple}`
      return this.httpClient.post(API_URL, data)
    } else {
      const companyId = companyIds[0]
      const API_URL = `${
        this.baseURL + environment.contacts_delete
      }/${companyId}`
      return this.httpClient.delete(API_URL)
    }
  }

  /* Company API Service */
  getCompanies(): Observable<any> {
    const API_URL = `${this.baseURL + environment.company}`
    return this.httpClient.get(API_URL)
  }

  createCompany(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseURL + environment.company}`, data)
  }

  updateCompany(companyId, data: any): Observable<any> {
    return this.httpClient.put(`${this.baseURL + environment.company}/${companyId}`, data)
  }

  getCompanyDetial(companyId): Observable<any> {
    return this.httpClient.get(`${this.baseURL + environment.company_detail}/${companyId}`)
  }

  getCompanyList(data): Observable<any> {
    const API_URL = `${this.baseURL + environment.company_index}`
    return this.httpClient.post(API_URL, data)
  }

  deleteCompany(companyIds: any[]): Observable<any> {
    if (companyIds.length > 1) {
      const data = { ids: companyIds }
      const API_URL = `${this.baseURL + environment.company_delete_multiple}`
      return this.httpClient.post(API_URL, data)
    }
    else {
      const companyId = companyIds[0]
      const API_URL = `${this.baseURL + environment.company_delete}/${companyId}`
      return this.httpClient.delete(API_URL)
    }
  }

  updateCompanyState(id, data): Observable<any> {
    const API_URL = `${this.baseURL + environment.company_update_state}/${id}`
    return this.httpClient.put(API_URL, data)
  }

  createAppointment(appoint): Observable<any> {
    const API_URL = `${this.baseURL + environment.company_create_appointment}`
    return this.httpClient.post(API_URL, appoint)
  }

  updateAppointment(id, appoint): Observable<any> {
    const API_URL = `${this.baseURL + environment.company_update_appointment}/${id}`
    return this.httpClient.put(API_URL, appoint)
  }

  deleteAppointment(id): Observable<any> {
    const API_URL = `${this.baseURL + environment.appointment_delete}/${id}?_method=DELETE`
    return this.httpClient.post(API_URL, {})
  }

  updateAppointmentState(id: number, data) {
    const API_URL = `${this.baseURL + environment.company_appointment_state}/${id}`
    return this.httpClient.put(API_URL, data)
  }

  createTask(task): Observable<any> {
    const API_URL = `${this.baseURL + environment.company_create_task}`
    return this.httpClient.post(API_URL, task)
  }

  updateTask(id, task): Observable<any> {
    const API_URL = `${this.baseURL + environment.company_update_task}/${id}`
    return this.httpClient.put(API_URL, task)
  }

  deleteTask(id): Observable<any> {
    const API_URL = `${this.baseURL + environment.task_delete}/${id}?_method=DELETE`
    return this.httpClient.post(API_URL, {})
  }

  updateTaskState(id: number, data) {
    const API_URL = `${this.baseURL + environment.company_task_state}/${id}`
    return this.httpClient.put(API_URL, data)
  }

  deleteActivity(menu, data) {
    const API_URL = `${this.baseURL}activity/${menu}?_method=DELETE`
    return this.httpClient.post(API_URL, data)
  }

  createCompanyNote(data) {
    const API_URL = `${this.baseURL + environment.company_add_note}`
    return this.httpClient.post(API_URL, data)
  }

  createCompanyEmail(data) {
    const API_URL = `${this.baseURL + environment.company_add_email}`
    return this.httpClient.post(API_URL, data)
  }

  createCompanyCall(data) {
    const API_URL = `${this.baseURL + environment.company_add_call}`
    return this.httpClient.post(API_URL, data)
  }

  /* Helper Functions */
  getCountries() {
    if (this.contactData) {
      return this.contactData.country
    }
    if (this.companyData) {
      return this.companyData.countries
    }
    return null
  }

  getEmailOwners() {
    if (this.contactData) {
      return this.contactData.owners
    }
    if (this.companyData) {
      return this.companyData.owners
    }
    return null
  }

  getContactCompanyList() {
    if (this.contactData) {
      return this.contactData.organizations;
    }
    return null;
  }

  getDialCodes() {
    const countries = this.getCountries()
    if (countries) {
      const dialCodes = countries
        .filter((x) => x.dial_code)
        .map((x) => x.dial_code)
      return this.sortDialCodes(dialCodes)
    }
    return null
  }

  private sortDialCodes(dialCodes: string[]) {
    return dialCodes.sort((a: string, b: string) => {
      const a1 = a.replace(/ /g, '')
      const b1 = b.replace(/ /g, '')
      if (a1.length < b1.length) return -1
      else if (a1.length > b1.length) return 1
      return a1.localeCompare(b1)
    })
  }

  notifyCompany() {
    this.companySubject.next()
  }

  notifyCompanyDetail() {
    this.companyDetailSubject.next()
  }

  notifyContact() {
    this.contactSubject.next()
  }

  ngOnDestroy() {}
}
