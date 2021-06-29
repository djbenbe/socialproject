import { Component, HostBinding, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { UserDocument } from './interface/user-document';
import { FormControl } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';

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
  profileImage: string | undefined;
  isDarkTheme: Boolean = false;

  private static userDocument: UserDocument | null;
  ngOnInit(): void {
    this.isDarkTheme = localStorage.getItem('theme')=== "Dark" ? true:false;
  }
  constructor(private loginSheet2: MatBottomSheet, private overlay: OverlayContainer, private router: Router) {
    this.auth.listenToSignInStateChanges(
      user => {
        this.auth.checkSignInState(
          {
            whenSignedIn: user => {
            },
            whenSignedOut: user => {
              AppComponent.userDocument = null;
              this.router.navigate([""])
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
  public static getUserDocement(){
    let userDoc = AppComponent.userDocument;
    return userDoc;
  }
  getUsername(){
    try{
      if(AppComponent.userDocument){
        return AppComponent.userDocument.publicName;
      }
    } catch (err) {
      return console.error('nu User found!');
    }
    
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
            this.profileImage = AppComponent.userDocument.image;
            if(this.userHasProfile) {
              this.router.navigate(["postFeed"]);
            } 
          }
        
      });
    } else {
      console.error('No User found!');
    }
  }
  themeSelect(){
    localStorage.setItem('theme', this.isDarkTheme ? "Dark" : "Light");
  }
  onLogoutClick(){
      this.auth.signOut();
  }
  loggedIn(){
      return this.auth.isSignedIn();
  }
  verificationIn(){
    return this.auth.isEmailVerified();
  }
  onLoginClick(){
      this.loginSheet2.open(AuthenticatorComponent);
  }
  onProfileClick(){
    this.router.navigate(["profile/" + this.auth.getAuth().currentUser?.uid]);
  }
}