import { Component, OnInit } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSStorage } from 'firebasets/firebasetsStorage/firebaseTSStorage';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  selectedImageFile: File | undefined;
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  storage = new FirebaseTSStorage();
  constructor(private dialog: MatDialogRef<CreatePostComponent>) {}

  ngOnInit(): void {

  }
  onPostClick(commentIput: HTMLTextAreaElement) {
    let comment = commentIput.value;
    if(comment.length <= 0) return;
    if(this.selectedImageFile){
      this.uploadImagePosts(comment);
    } else {
      this.uploadPost(comment)
    }
  }
  uploadImagePosts(comment: String){
    let postId = this.firestore.genDocId();
    const _currentUser = this.auth.getAuth().currentUser;
    if (_currentUser && _currentUser.uid) {
      const users: string = _currentUser.uid;
    
      this.storage.upload({
          uploadName: "upload image post",
          path: ["Posts", postId, "image"],
          data: {
            data: this.selectedImageFile
          },
          onComplete: (downloadUrl) => {
            this.firestore.create({
              path: ["Post", postId],
              data: {
                comment: comment,
                creatorId: users,
                imageUrl: downloadUrl,
                timestamp: FirebaseTSApp.getFirestoreTimestamp()
              },
              onComplete: (docId) => {
                this.dialog.close();
              }
            });
          }
      });
    }
  }
  uploadPost(comment: String){
    const _currentUser = this.auth.getAuth().currentUser;
    if (_currentUser && _currentUser.uid) {
      const users: string = _currentUser.uid;
    
    this.firestore.create({
      path: ["Post"],
      data: {
        comment: comment,
        creatorId: users,
        timestamp: FirebaseTSApp.getFirestoreTimestamp()
      },
      onComplete: (docId) => {
        this.dialog.close();
      }
    });
  }
  }
  onPhotoSelected(photoSelector: HTMLInputElement) {
    const selectorFile = photoSelector.files;
    if(selectorFile){
      this.selectedImageFile = selectorFile[0];
      if(!this.selectedImageFile) return;  
      let fileReader = new FileReader();
      fileReader.readAsDataURL(this.selectedImageFile);
      fileReader.addEventListener(
        "loadend",
        ev => {
          if(fileReader.result){
            let readableString = fileReader.result.toString();
            let postPreviewImage = <HTMLImageElement>document.getElementById("post-preview-img");
            postPreviewImage.src = readableString;
          }

        }
      );
    } else {
      console.error('No file found!');
    }
  }
}
