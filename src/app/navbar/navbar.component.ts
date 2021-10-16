import { Component, OnInit, Optional, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';


import { traceUntilFirst } from '@angular/fire/performance';
import { map } from 'rxjs/operators';
import { EMPTY, Observable, Subscription, of } from 'rxjs';

import {
  Auth,
  authState,
  signInAnonymously,
  signOut,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  EmailAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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

  constructor(@Optional() private auth: Auth, private location: Location, private router:Router) {
    location.onUrlChange((url: string, state: unknown): void => {
      this.current_route = url;
      console.log(`this.current_route = ${this.current_route}`);
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
