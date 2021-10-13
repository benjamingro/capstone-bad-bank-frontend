import { Injectable, Optional } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {
  Auth,
  User,
  authState,
} from '@angular/fire/auth';

import { map } from 'rxjs/operators';
import { traceUntilFirst } from '@angular/fire/performance';

import { EMPTY, Observable, Subscription, of } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  // private isLoggedIn : boolean = false;
  
  // private readonly userDisposable: Subscription | undefined;
  // public readonly user: Observable<User | null> = EMPTY;

  constructor(@Optional() private auth: Auth) {
    // if (auth) {
    //   this.user = authState(this.auth);
    //   this.userDisposable = authState(this.auth)
    //     .pipe(
    //       traceUntilFirst('auth'),
    //       map((u) => !!u)
    //     )
    //     .subscribe((isLoggedIn) => {
    //       this.isLoggedIn = isLoggedIn; 
    //     });
    //   }
   }

  //  public canActivate() : boolean {
  //    return this.isLoggedIn; 
  //  }

  // public async canActivate() : boolean{
  //   let me = await of(true); 
  //   return me; 
  // }

  //  public canActivate() : boolean {
  //    of(true).subscribe((value:boolean)=>{return value; })
  //  }

  public canActivate() : Observable<boolean> {
    // return of(true); 
    return authState(this.auth)
    .pipe(
      traceUntilFirst('auth'),
      map((u) => !!u)
    ); 
  }
  
}
