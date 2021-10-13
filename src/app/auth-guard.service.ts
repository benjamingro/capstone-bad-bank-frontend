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

import { BadBankService } from './bad-bank.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(@Optional() private auth: Auth, private router : Router, private badBankService:BadBankService ) {
    if(auth){
      authState(this.auth)
      .pipe(
        traceUntilFirst('auth'),
        map((u) => !!u)
      ).subscribe((isLoggedIn:boolean)=>{
        if(!isLoggedIn || typeof badBankService.badBankUser === 'undefined'){
          this.router.navigate(['/account']); 
        }
      })
    }
   }

  public canActivate() : Observable<boolean> {
    // this returns true if the user is logged in or false if not 
    return authState(this.auth)
    .pipe(
      traceUntilFirst('auth'),
      map((u) => !!u)
    ); 
  }
  
}
