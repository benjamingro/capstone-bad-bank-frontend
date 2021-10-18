import { Injectable, Optional,OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { EMPTY, Observable, of, throwError, Subscription } from 'rxjs';
import { catchError, map, tap, retry } from 'rxjs/operators';
import {
  Auth,
  User,
  authState,
} from '@angular/fire/auth';

import { BadBankUser } from './bad-bank-types'; 

import { environment } from '../environments/environment';



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
export class BadBankService implements OnDestroy {
  private readonly userDisposable: Subscription | undefined;
  public readonly user: Observable<User | null> = EMPTY;
  private id_token?: string | null;

  public badBankUser? : BadBankUser; 

  constructor(private http: HttpClient, @Optional() private auth: Auth) {
    if (auth) {
      this.user = authState(this.auth);
      this.userDisposable = authState(this.auth).subscribe((myUser) => {
        console.log(`inside service, myUser = `); 
        console.log(JSON.stringify(myUser)); 
        if (myUser) {
          this.id_token = JSON.parse(
            JSON.stringify(myUser)
          ).stsTokenManager.accessToken;
        }
      });
    }


  }

  ngOnDestroy() { 
    if (this.userDisposable) {
      this.userDisposable.unsubscribe();
    }
  }
  

  public createUserAccountWithEmail_Authenticated_Observable(id_token:string, Fname:string,Lname:string,Email:string,Telephone:string) : Observable<HttpResponse<Object>> {
    // need to pass in the id_token here as a parameter during initial account setup 

    // const url = `http://localhost:5002/mit-xpro-319116/us-central1/createUserAccount_Authenticated`;
    const url = environment.url.createGoogleUserAccount_Authenticated; 

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
          this.badBankUser = results; 
        }
         
      })
    );
  }

  public getUserAccount_Authenticated_Observable() : Observable<HttpResponse<Object>> {

    console.log(`this.id_token = ${this.id_token}`); 

    // const url = `http://localhost:5002/mit-xpro-319116/us-central1/getUserAccount_Authenticated`;
    const url = environment.url.getUserAccount_Authenticated;

    const httpOptions : Object = { 
      responseType:'text',
    };  

    const requestObject = {
      id_token:this.id_token,
    }

    let body : string = JSON.stringify(requestObject); 
    
    return this.http.post<HttpResponse<BadBankUser | string>>(url,body,httpOptions)
    .pipe(
      catchError(error =>{return of(error);}),
      tap((results:any)=>{
        try{
          this.badBankUser = JSON.parse(results);
        }
        catch(error){
          // this is not a good place to store error string 
          this.badBankUser = results; 
        } 
      }), 
      map((results:any)=>{
        console.log( `results = `); 
        console.log(results);
        if(!results.ok && typeof results.ok !== 'undefined'){
          return 'sql_error'; 
        }
        else{
          return results;
        }
        
      }),
    );
    
  }

  public deposit_Authenticated_Observable(amount:number) : Observable<HttpResponse<Object>> {
    
    // const url = `http://localhost:5002/mit-xpro-319116/us-central1/deposit_Authenticated`;
    const url = environment.url.deposit_Authenticated;


    const httpOptions : Object = { 
      responseType:'text',
    };  

    const requestObject = {
      id_token:this.id_token,
      amount:amount
    }

    let body : string = JSON.stringify(requestObject); 

    return this.http.post<HttpResponse<BadBankUser | string>>(url,body,httpOptions)
    .pipe(
      catchError(error =>{return of(error);}),
      tap((results:any)=>{
        try{
          this.badBankUser = JSON.parse(results);
        }
        catch(error){
          this.badBankUser = results; 
        }
      })
    );

  }

  public withdraw_Authenticated_Observable(amount:number) : Observable<HttpResponse<Object>> {
    
    // const url = `http://localhost:5002/mit-xpro-319116/us-central1/withdraw_Authenticated`;
    const url = environment.url.withdraw_Authenticated;

    const httpOptions : Object = { 
      responseType:'text',
    };  

    const requestObject = {
      id_token:this.id_token,
      amount:amount
    }

    let body : string = JSON.stringify(requestObject); 
    console.log(`sending body = ${body}`);

    return this.http.post<HttpResponse<BadBankUser | string>>(url,body,httpOptions)
    .pipe(
      catchError(error =>{return of(error);}),
      tap((results:any)=>{
        try{
          this.badBankUser = JSON.parse(results);
        }
        catch(error){
          this.badBankUser = results; 
        }
      })
    );

  }

  public createUserAccountWithGoogle_Authenticated_Observable(Fname:string,Lname:string,Telephone:string) : Observable<HttpResponse<Object>> {
    // const url = `http://localhost:5002/mit-xpro-319116/us-central1/createGoogleUserAccount_Authenticated`;
    const url = environment.url.createGoogleUserAccount_Authenticated;

    const httpOptions : Object = { 
      responseType:'text',
    };  

    const requestObject = {
      id_token:this.id_token,
      Fname : Fname, 
      Lname : Lname, 
      Telephone : Telephone
    }

    let body : string = JSON.stringify(requestObject); 
    
    return this.http.post<HttpResponse<BadBankUser | string>>(url,body,httpOptions)
    .pipe(
      catchError(error =>{return of(error);}),
      tap((results:any)=>{
        try{
          this.badBankUser = JSON.parse(results);
        }
        catch(error){
          this.badBankUser = results; 
        }
      })
    );

  }


}
