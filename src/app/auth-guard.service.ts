import { Injectable, Optional, OnDestroy } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Auth, User, authState } from '@angular/fire/auth';

import { map } from 'rxjs/operators';
import { traceUntilFirst } from '@angular/fire/performance';

import { EMPTY, Observable, Subscription, of } from 'rxjs';

import { BadBankService } from './bad-bank.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements OnDestroy {
  private readonly userDisposable: Subscription | undefined;
  public readonly user: Observable<User | null> = EMPTY;

  constructor(
    @Optional() private auth: Auth,
    private router: Router,
    private badBankService: BadBankService
  ) {
    if (auth) {
      this.user = authState(this.auth);
      this.userDisposable = authState(this.auth)
        .pipe(
          traceUntilFirst('auth'),
          map((u) => !!u)
        )
        .subscribe((isLoggedIn: boolean) => {
          if (
            !isLoggedIn ||
            typeof badBankService.badBankUser === 'undefined'
          ) {
            this.router.navigate(['/account']);
          }
        });
    }
  }

  ngOnDestroy() {
    if (this.userDisposable) {
      this.userDisposable.unsubscribe();
    }
  }

  public canActivate(): Observable<boolean> {
    // this returns true if the user is logged in or false if not
    return authState(this.auth).pipe(
      traceUntilFirst('auth'),
      map((u) => !!u)
    );
  }
}
