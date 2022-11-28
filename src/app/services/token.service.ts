import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }
  handle(token){
    this.set(token);
    //console.log(this.payload(token));
  }

  set(token){
    localStorage.setItem('token', token)
  }

  get(){
    return localStorage.getItem('token');
  }

  remove(){
    localStorage.removeItem('token');
  }

  isValid(){
    const token = this.get();
    if(token){
      const payload = this.payload(token);
    }
  }

  payload(token) {
    const payload =  token.split(".")[1];
    return this.decode(payload);
  }

  decode(payload){
    return JSON.parse(atob(payload));
  }
}
