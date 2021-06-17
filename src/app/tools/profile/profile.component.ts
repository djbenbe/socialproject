import { Component, OnInit, Input } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() show:boolean | undefined;
  firestore: FirebaseTSFirestore;
  auth: FirebaseTSAuth;
  constructor() { 
    this.firestore = new FirebaseTSFirestore();
    this.auth = new FirebaseTSAuth();
  }

  ngOnInit(): void {
    
  }

  onContinueClick(nameInput: HTMLInputElement, descInput: HTMLTextAreaElement){
    let name = nameInput.value;
    let desc = descInput.value;
    let users:string = this.auth.getAuth().currentUser?.uid!;

    this.firestore.create({
      path: ["Users", users],
      data: {
        publicName: name,
        desc: desc
      },
      onComplete: (doc) => {
        alert("Profile Created")
        nameInput.value = "";
        descInput.value = "";
      },
      onFail: (err) => {

      }
    });
  }
}
