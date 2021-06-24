import { Component, HostBinding, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'socialproject';
  @HostBinding('class') className = '';
  toggleControl = new FormControl(false);
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  userHasProfile = true;
  private static userDocument: UserDocument;

  ngOnInit(): void {
    this.toggleControl.valueChanges.subscribe(val => {
      this.className = val ? 'darkMode' : '';
    });
  }
  constructor(private loginSheet2: MatBottomSheet, private router: Router) {
    this.auth.listenToSignInStateChanges(
      user => {
        this.auth.checkSignInState(
          {
            whenSignedIn: user => {
              this.router.navigate([""]);
            },
            whenSignedOut: user => {
              this.router.navigate([""]);
            },
            whenSignedInAndEmailNotVerified: user => {
              this.router.navigate(["emailVerification"]);
            },
            whenSignedInAndEmailVerified: user => {
              this.getUserProfile();
              this.router.navigate(["postFeed"]);
            },
            whenChanged: user => {

            }
          }
        );
      }
    );
  }

  getUserProfile(){
    const _currentUser = this.auth.getAuth().currentUser;
    if (_currentUser && _currentUser.uid) {
      const users: string = _currentUser.uid;

    this.firestore.listenToDocument({
        name: "Getting Document",
        path: [ "Users", users ],
        onUpdate: (result) => {
          AppComponent.userDocument = <UserDocument> result.data();
          this.userHasProfile = result.exists;
          AppComponent.userDocument.userId = users;
          if(this.userHasProfile) {
            this.router.navigate(["postFeed"]);
          } 
        }
      
    });
    } else {
      console.error('No User found!');
    }
  }

  onLogoutClick(){
      this.auth.signOut();
  }

  loggedIn(){
      return this.auth.isSignedIn();
  }
  onLoginClick(){
      this.loginSheet2.open(AuthenticatorComponent);
  }
}

export interface UserDocument {
  publicName: string;
  description: string;
  userId: string;
}