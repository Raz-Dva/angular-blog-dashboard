import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';
import UserCredential = firebase.auth.UserCredential;
import { Observable } from 'rxjs';
import User = firebase.User;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // isLoggedIn: boolean = false;

  constructor(private auth: AngularFireAuth) {
    // this.auth.authState.subscribe((res) => {
    //   console.log(res)
    // })


    // this.auth.onAuthStateChanged((user) => {
    //   this.isLoggedIn = !!user;
    // });
  }

  login(email: string, password: string): Promise<UserCredential> {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  register(email: string, password: string): Promise<UserCredential> {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  logOut(): Promise<void> {
    return this.auth.signOut();
  }

  userAuthInfo(): Observable<User | null> {
    return this.auth.authState;
  }
}
