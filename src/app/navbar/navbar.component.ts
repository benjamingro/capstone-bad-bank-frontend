import { Component, OnInit, Optional, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';


import { traceUntilFirst } from '@angular/fire/performance';
import { map } from 'rxjs/operators';
import { EMPTY, Observable, Subscription, of } from 'rxjs';

import { BadBankService } from '../bad-bank.service';


import {
  Auth,
  authState,
  signOut,
  User,

} from '@angular/fire/auth';

import { faMask } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  faMask = faMask;

  private readonly userDisposable: Subscription | undefined;
  public readonly user: Observable<User | null> = EMPTY;

  public current_route: string = '/about';
  public navbar_menu_expand_mobile: boolean = false;
  public isLoggedIn: boolean = false;

  constructor(
    @Optional() private auth: Auth, 
    private location: Location, 
    private router:Router,
    public badBankService: BadBankService,
    ) {
    location.onUrlChange((url: string, state: unknown): void => {
      this.current_route = url;
      // url: '/home', '/account', '/deposit', '/withdraw' 
    });

    if (auth) {
      this.user = authState(this.auth);
      this.userDisposable = authState(this.auth)
        .pipe(
          traceUntilFirst('auth'),
          map((u) => !!u)
        )
        .subscribe((isLoggedIn: boolean) => {
          this.isLoggedIn = isLoggedIn;
        });
    }
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    if (this.userDisposable) {
      this.userDisposable.unsubscribe();
    }
  }

  toggleNavbarMenu(): void {
    this.navbar_menu_expand_mobile = !this.navbar_menu_expand_mobile;
  }

  public async mySignOut() {
    this.toggleNavbarMenu();
    return await signOut(this.auth).then(() => {});
  }
}
