import { HttpInterceptorService } from './services/http-interceptor.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from './shared/shared.module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AccountApiService } from './services/account-api.service';
import { TokenService } from './services/token.service';
import { UserRegistrationModule } from './user-registration/user-registration.module';
import { ContactApiService } from './services/contact-api.service';

import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";

import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AuthTwitterService } from './services/auth-twitter.service';
import { MaterialModule } from './material/material.module';
import { SpinnerOverlayComponent } from './core/spinner-overlay/spinner-overlay.component';
import {SettingsApiService} from './services/settings-api.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
const routes: Routes = [
  { path: '', redirectTo: 'pages/dashboard', pathMatch: 'full' },
  { path: 'login', redirectTo: 'user/login', pathMatch: 'full' },
  { path: 'signup', redirectTo: 'user/signup', pathMatch: 'full' },
  {
    path: 'user',
    loadChildren: () =>
      import('./user-registration/user-registration.module').then(
        (m) => m.UserRegistrationModule
      ),
  },
  {
    path: 'pages',
    loadChildren: () =>
      import('./pages/pages.module').then((m) => m.PagesModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./shared/shared.module').then((m) => m.SharedModule),
  },
];
const config: ExtraOptions = {
  //useHash: true,
  onSameUrlNavigation: 'reload'
};
@NgModule({
  declarations: [AppComponent, SpinnerOverlayComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, config),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    SocialLoginModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    MaterialModule
  ],
  providers: [
    AccountApiService,
    TokenService,
    ContactApiService,
    SettingsApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '830281107448-r8aj5hj1nvqrvom4eq9lp21hgtr9apbs.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider("447613193049348")
          }
        ]
      } as SocialAuthServiceConfig,
    },
    AuthTwitterService,
    NgbModule,
  ],
  exports: [RouterModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
