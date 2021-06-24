import { Component, OnInit } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {
  auth = new FirebaseTSAuth();
  constructor( private router: Router) { }
   
  
  ngOnInit(): void {
    const _currentUser = this.auth.getAuth().currentUser;
    if (_currentUser && _currentUser.uid) {
      const users = _currentUser.emailVerified;
      if(this.auth.isSignedIn() && !users) {
        this.auth.sendVerificationEmail();
      } else {
        this.router.navigate([""]);
      }
    } else {
      console.error('No User found!');
    }
  }
  onResendClick(){
    this.auth.sendVerificationEmail();
  }
}
