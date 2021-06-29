import { Component, Input, OnInit } from '@angular/core';
import { PostData } from 'src/app/interface/post-data';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MatDialog } from '@angular/material/dialog';
import { ReplyComponent } from '../reply/reply.component';
import { Router } from '@angular/router';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input()
  postData: PostData | undefined;
  creatorName: string | undefined;
  creatorDisc: string | undefined;
  creatorImg: string | undefined;
  userhasOwner: boolean = false;
  firestore = new FirebaseTSFirestore();
  auth = new FirebaseTSAuth();
  constructor(private dialog:MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.getCreatorInfo();
  }
  onProfileclick(){
    this.router.navigate(["profile/" + this.postData?.creatorId]);
  }
  onReplyClick(){
    this.dialog.open(ReplyComponent, {data: this.postData?.postId});
  }
  getCreatorInfo(){
    const _currentUser = this.postData;
    if (_currentUser) {
      const users: string = _currentUser.creatorId;
      this.firestore.getDocument({
        path: ["Users", users],
        onComplete: (result) => {
          const _UserDocement = result.data();
          if (_UserDocement) {
            this.creatorName = _UserDocement.publicName;
            this.creatorDisc = _UserDocement.desc;
            this.creatorImg = _UserDocement.image;
          }
        }
      });
    }
  }
  userHasOwner(){
    let userInfo = this.auth.getAuth();
   
  }
}
