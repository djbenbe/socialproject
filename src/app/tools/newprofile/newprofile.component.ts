import { Component, OnInit, Input } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSStorage } from 'firebasets/firebasetsStorage/firebaseTSStorage';

@Component({
  selector: 'app-newprofile',
  templateUrl: './newprofile.component.html',
  styleUrls: ['./newprofile.component.css'],
})
export class NewProfileComponent implements OnInit {
  @Input() show: boolean | undefined;
  selectedImageFile: File | undefined;
  firestore: FirebaseTSFirestore;
  auth: FirebaseTSAuth;
  storage = new FirebaseTSStorage();

  constructor() {
    this.firestore = new FirebaseTSFirestore();
    this.auth = new FirebaseTSAuth();
  }

  ngOnInit(): void {
    
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
            let postPreviewImage = <HTMLImageElement>document.getElementById("profile-preview-img");
            postPreviewImage.src = readableString;
          }
        }
      );
    } else {
      console.error('No file found!');
    }
  }
  onContinueClick(nameInput: HTMLInputElement, descInput: HTMLTextAreaElement, dateInput: HTMLDataElement) {
    let name = nameInput.value;
    let desc = descInput.value;
    let date = dateInput.value;
    const _currentUser = this.auth.getAuth().currentUser;
    if (_currentUser && _currentUser.uid) {
      const users: string = _currentUser.uid;
      if(NewProfileComponent.isNotEmpty(name) && NewProfileComponent.isNotEmpty(desc) && NewProfileComponent.isNotEmpty(date)){
        this.storage.upload({
          uploadName: "upload image post",
          path: ["profile", users, "image"],
          data: {
            data: this.selectedImageFile
          },
          onComplete: (downloadUrl) => {
            this.firestore.create({
              path: ['Users', users],
              data: {
                publicName: name,
                desc: desc,
                date: date,
                image: downloadUrl,
                userId: users
              },
              onComplete: (doc) => {
                alert('Profile Created');
                nameInput.value = '';
                descInput.value = '';
                dateInput.value = '';
                this.selectedImageFile = undefined;
              },
              onFail: (err) => {},
            });
          }
        });
      }
    } else {
      console.error('No User found!');
    }
  }

  public static isNotEmpty(text: string){
    return text != null && text.length > 0;
  }
  
}
