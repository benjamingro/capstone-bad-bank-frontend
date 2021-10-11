import { Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { EMPTY, Observable, of, throwError, Subscription } from 'rxjs';
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

import { BadBankUser } from './bad-bank-types'; 


// type BadBankUser = {
//   CustomerId:string,
//   Fname:string,
//   Lname:string, 
//   Email: string,
//   Telephone:string,
//   AccountNumber:number,
//   AccountBalance:number
// }

@Injectable({
  providedIn: 'root',
})
export class BadBankService {
  private readonly userDisposable: Subscription | undefined;
  public readonly user: Observable<User | null> = EMPTY;
  private id_token?: string | null;

  public badBankUser? : BadBankUser; 

  constructor(private http: HttpClient, @Optional() private auth: Auth) {
    if (auth) {
      this.user = authState(this.auth);
      this.userDisposable = authState(this.auth).subscribe((myUser) => {
        if (myUser) {
          this.id_token = JSON.parse(
            JSON.stringify(myUser)
          ).stsTokenManager.accessToken;
        }
      });
    }


  }

  

  public createUserAccountWithEmail_Authenticated_Observable(id_token:string, Fname:string,Lname:string,Email:string,Telephone:string) : Observable<HttpResponse<Object>> {

    console.log(`id_token = ${id_token}`); 
    console.log(`this.id_token = ${this.id_token}`); 
    // let my_id_token : string; 
    // this.id_token?my_id_token=this.id_token:my_id_token=id_token;
    // let id_token? = id_token; 
    // if(id_token == ""){
    //   id_token = this.id_token; 
    // }

    const url = `http://localhost:5002/mit-xpro-319116/us-central1/createUserAccount_Authenticated`;
    // const url = "http://localhost:5001/mit-xpro-319116/us-central1/authRoute";
        // const url = `http://localhost:5002/mit-xpro-319116/us-central1/authRoute`;

    const httpOptions : Object = { 
      responseType:'text',
    };  

    const requestObject = {
      id_token:id_token,
      Fname : Fname, 
      Lname : Lname, 
      Email : Email, 
      Telephone : Telephone
    }

    let body : string = JSON.stringify(requestObject); 

    console.log(`sending body = ${body}`);
    
    return this.http.post<HttpResponse<BadBankUser | string>>(url,body,httpOptions)
    .pipe(
      catchError(error =>{return of(error);}),
      tap((results:any)=>{
        console.log(`inside tap, results=`); 
        console.log(results); 

        try{
          this.badBankUser = JSON.parse(results);
        }
        catch(error){
          // this is not a good place to store error string 
          this.badBankUser = results; 
        }
         
      })
    )
    // .subscribe(
    //         (result : any) => {
    //     console.log(`result=${result}`);
    //   }
    // )
    // .pipe(
    //   (result : any) => {
    //     console.log(`result=${result}`);
    //   }
    // )
    ;
  }

  public getUserAccount_Authenticated_Observable() : Observable<HttpResponse<Object>> {

    // console.log(`id_token = ${id_token}`); 
    console.log(`this.id_token = ${this.id_token}`); 
    // let my_id_token : string; 
    // this.id_token?my_id_token=this.id_token:my_id_token=id_token;
    // let id_token? = id_token; 
    // if(id_token == ""){
    //   id_token = this.id_token; 
    // }

    const url = `http://localhost:5002/mit-xpro-319116/us-central1/getUserAccount_Authenticated`;
    // const url = "http://localhost:5001/mit-xpro-319116/us-central1/authRoute";
        // const url = `http://localhost:5002/mit-xpro-319116/us-central1/authRoute`;

    const httpOptions : Object = { 
      responseType:'text',
    };  

    const requestObject = {
      id_token:this.id_token,
    }

    let body : string = JSON.stringify(requestObject); 

    console.log(`sending body = ${body}`);
    
    return this.http.post<HttpResponse<BadBankUser | string>>(url,body,httpOptions)
    .pipe(
      catchError(error =>{return of(error);}),
      tap((results:any)=>{
        console.log(`inside tap, results=`); 
        console.log(results); 

        try{
          this.badBankUser = JSON.parse(results);
        }
        catch(error){
          // this is not a good place to store error string 
          this.badBankUser = results; 
        }
         
      })
    );
    
  }


}