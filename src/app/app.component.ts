import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountApiService } from './services/account-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mikontact';
  constructor(authService: AccountApiService, router: Router) {
    /*if (authService.isLoggedIn()) {
      router.navigate(['pages/dashboard']);
    }*/
  }
}
