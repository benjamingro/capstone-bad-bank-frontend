import { Component, OnInit, Optional, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { EMPTY, Observable, Subscription, of } from 'rxjs';

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
  public email : string = ''; 
  constructor(
    @Optional() private auth: Auth, 
    private location: Location, 
    private router:Router,
    ) {
    location.onUrlChange((url: string, state: unknown): void => {
      this.current_route = url;
      // url: '/home', '/account', '/deposit', '/withdraw' 
    });

    if (auth) {
      this.user = authState(this.auth);
      this.userDisposable = authState(this.auth)
        .subscribe((myUser) => {
          if (myUser?.uid) {
            this.isLoggedIn = true;
            this.email = myUser.email!;
  
          } else {
            this.isLoggedIn = false;
          }
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
    return await signOut(this.auth).then(() => {
      window.location.reload(); 
    });
  }
}
