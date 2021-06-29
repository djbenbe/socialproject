import { Component, OnInit } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSStorage } from 'firebasets/firebasetsStorage/firebaseTSStorage';
import { UserDocument } from 'src/app/interface/user-document';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileImage: string | undefined;
  name: string | undefined;
  userid: string | undefined;
  auth = new FirebaseTSAuth();
  private static userDocument: UserDocument | null;
  firestore = new FirebaseTSFirestore();
  constructor(private route: ActivatedRoute) {
    this.getProfile();
   }

  ngOnInit(): void {
  }
 
  getProfile(){
    this.route.params.subscribe( params =>{
      const username = params['id'];
      this.userid = username;
      
    });
    if (this.userid) {
      console.log(this.userid);
      const users: string = this.userid;
      this.firestore.listenToDocument({
        name: "Getting Document",
        path: ["Users", users],
        onUpdate: (result) => {
          ProfileComponent.userDocument = <UserDocument> result.data();
          this.profileImage = ProfileComponent.userDocument.image;
          this.name = ProfileComponent.userDocument.publicName;
        }
      });
  }
}


}