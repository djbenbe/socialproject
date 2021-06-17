import { Component, OnInit } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.css']
})
export class AuthenticatorComponent implements OnInit {
  state = AuthenticatorCompState.LOGIN;
  firebasetsAuth: FirebaseTSAuth;

  constructor(private bottomSheetRef: MatBottomSheetRef) {
    this.firebasetsAuth = new FirebaseTSAuth();
  }

  ngOnInit(): void {
  }
  onLogin(loginEmail: HTMLInputElement, loginPassword: HTMLInputElement){
    let Email = loginEmail.value;
    let Password = loginPassword.value;
    if(this.isNotEmpty(Email) && this.isNotEmpty(Password)){
      this.firebasetsAuth.signInWith({
         email: Email,
         password: Password,
         onComplete: (uc) => {
            this.bottomSheetRef.dismiss();
         },
         onFail: (err) => {
            alert(err);
         }
      });
    }
  }
  onResetClick(resetEmail: HTMLInputElement){
    let email = resetEmail.value;
    if(this.isNotEmpty(email)){
      this.firebasetsAuth.sendPasswordResetEmail({
        email: email,
        onComplete: (err) => {
          this.bottomSheetRef.dismiss();
        }
      });
    }
  }
  onRegisterClick(registerEmail: HTMLInputElement, registerPassword: HTMLInputElement, registerConfirmPassword: HTMLInputElement){
    let email = registerEmail.value;
    let Password = registerPassword.value;
    let ConfirmPassword = registerConfirmPassword.value;
    if(this.isNotEmpty(email) &&
             this.isNotEmpty(Password) &&
             this.isNotEmpty(ConfirmPassword) &&
             this.isAMatch(Password, ConfirmPassword)){
      this.firebasetsAuth.createAccountWith({
            email: email,
            password: Password,
            onComplete: (uc) => {
              this.bottomSheetRef.dismiss();
            },
            onFail: (err) => {
              alert("Failed to create the account.");
            }
      });
    }
  }
  isNotEmpty(text: string){
      return text != null && text.length > 0;
  }
  isAMatch(text: string, comparedWith: string){
      return text == comparedWith;
  }
  onForgotClick(){
    this.state = AuthenticatorCompState.FORGOT;
  }
  onCreateClick(){
    this.state = AuthenticatorCompState.REGISTER;
  }
  onLoginClick(){
    this.state = AuthenticatorCompState.LOGIN;
  }

  isLoginState(){
    return this.state == AuthenticatorCompState.LOGIN;
  }
  isRegisterState(){
    return this.state == AuthenticatorCompState.REGISTER;
  }
  isPasswordState(){
    return this.state == AuthenticatorCompState.FORGOT;
  }
  getStateText(){
    switch(this.state){
      case AuthenticatorCompState.LOGIN:
        return "Login";
      case AuthenticatorCompState.REGISTER:
        return "Register";
      case AuthenticatorCompState.FORGOT:
        return "Forgot Password";
    }
  }
}
export enum AuthenticatorCompState {
  LOGIN,
  REGISTER,
  FORGOT
}
