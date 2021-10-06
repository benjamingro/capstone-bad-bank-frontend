import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import {faMask} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  faMask = faMask; 

  public current_route: string = '/about';
  public navbar_menu_expand_mobile: boolean = false;

  constructor(private location: Location) {
    location.onUrlChange((url: string, state: unknown): void => {
      this.current_route = url;
    });
   }

  ngOnInit(): void {
  }
  toggleNavbarMenu():void{
    this.navbar_menu_expand_mobile = !this.navbar_menu_expand_mobile; 

  }

}
