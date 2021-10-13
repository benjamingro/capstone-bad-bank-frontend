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

  constructor(@Optional() private auth: Auth, private router : Router) {
    if(auth){
      authState(this.auth)
      .pipe(
        traceUntilFirst('auth'),
        map((u) => !!u)
      ).subscribe((isLoggedIn:boolean)=>{
        if(!isLoggedIn){
          this.router.navigate(['/account']); 
        }
      })
    }
   }

  public canActivate() : Observable<boolean> {
    
    return authState(this.auth)
    .pipe(
      traceUntilFirst('auth'),
      map((u) => !!u)
    ); 
  }
  
}
