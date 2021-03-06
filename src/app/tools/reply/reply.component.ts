import { Component, Inject, OnInit } from '@angular/core';
import { FirebaseTSFirestore, OrderBy } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { AppComponent } from 'src/app/app.component';
import { PostFeedComponent } from 'src/app/pages/post-feed/post-feed.component';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent implements OnInit {
  firestore = new FirebaseTSFirestore();
  comments: Comment[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) private postId: string) { }

  ngOnInit(): void {
    this.getComments();
  }
  getComments(){
    this.firestore.listenToCollection({
      name: "Post Comments",
      path: ["Post", this.postId, "PostComments"],
      where: [new OrderBy("timestamp", "asc")],
      onUpdate: (result) => {
        result.docChanges().forEach(
          PostCommentDoc => {
            if(PostCommentDoc.type == "added") {
              this.comments.unshift(<Comment>PostCommentDoc.doc.data());
            }
          }
        )
      }
    });
  }
  isCommentCreator(comment: Comment){
    try {
      return comment.creatorId == AppComponent.getUserDocement()?.userId;
    } catch(err){
      return console.error('nu User found!');
    }
  }
  onSendClick(commentInput: HTMLInputElement){
    if(!(commentInput.value.length > 0 )) return;
    this.firestore.create({
      path: ["Post", this.postId, "PostComments"],
      data: {
        comment: commentInput.value,
        creatorId: AppComponent.getUserDocement()?.userId,
        creatorName: AppComponent.getUserDocement()?.publicName,
        timestamp: FirebaseTSApp.getFirestoreTimestamp()
      },
      onComplete: (docId) => {
        commentInput.value = "";
      }
    });
  }
}
export interface Comment {
  creatorId: string;
  creatorName: string;
  comment: string;
  timestamp: firebase.default.firestore.Timestamp;
}