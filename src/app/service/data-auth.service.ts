import { Injectable } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
@Injectable({
  providedIn: 'root'
})
export class DataAuthService {
  auth = new FirebaseTSAuth();
  constructor() { }
getUsers(){
  const _currentUser = this.auth.getAuth().currentUser;
  if (_currentUser && _currentUser.uid) {
    const users: string = _currentUser.uid;
  }
}
  
}
