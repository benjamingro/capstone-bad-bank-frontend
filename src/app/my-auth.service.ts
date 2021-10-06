import { Injectable,Optional } from '@angular/core';
import { HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';
import { EMPTY,Observable, of, throwError,Subscription } from 'rxjs';
import { catchError, map, tap, retry } from 'rxjs/operators';
import {
  Auth,
  signOut,
  signInWithPopup,
  user,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  getAdditionalUserInfo,
  OAuthProvider,
  linkWithPopup,
  unlink,
  updateEmail,
  updatePassword,
  User,
  reauthenticateWithPopup,
  authState,
  onAuthStateChanged,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class MyAuthService {

  private readonly userDisposable: Subscription | undefined;
  public readonly user: Observable<User | null> = EMPTY;
  private id_token? : string | null; 

  constructor(
    private http: HttpClient,
    @Optional() private auth: Auth
  ) {
    if (auth) {
      this.user = authState(this.auth);
      this.userDisposable = authState(this.auth)
        .subscribe((myUser) => {
          if(myUser){
            this.id_token = (JSON.parse(JSON.stringify(myUser))).stsTokenManager.accessToken; 
          }

        });
    }
   }
}
