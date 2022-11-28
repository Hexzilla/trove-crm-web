import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthTwitterService implements OnInit {

  public userData: any;
  public user: firebase.User;

constructor(
  public afs: AngularFirestore,
  public afAuth: AngularFireAuth,
  public router: Router,
) {
  /*this.afAuth.authState.subscribe(user => {
    if (user) {
      this.userData = user;
      console.log(this.userData);
    } else {
      localStorage.setItem('user', null);
    }
  });*/
}
ngOnInit(): void { }

//Sign in with Twitter
signInTwitter() {
  return this.AuthLogin(new auth.TwitterAuthProvider());
}

//Sign in with Twitter
signUpTwitter() {
  return this.AuthLogin(new auth.TwitterAuthProvider());
}

/* SignOut method for logging out from the Angular/Firebase app */
SignOut() {
  return this.afAuth.auth.signOut().then(() => {
    this.router.navigate(['sign-in']);
  })
}

// Auth logic to run auth providers
AuthLogin(provider) {
  return this.afAuth.auth.signInWithPopup(provider)
  .then((result) => {
      console.log('You have been successfully logged in!')
  }).catch((error) => {
    //window.alert(error);
    console.log(error);
  })
}

}
