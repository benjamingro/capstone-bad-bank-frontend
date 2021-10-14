import { Component } from '@angular/core';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  faLinkedin = faLinkedin;
  title = 'final-bad-bank';

  // private current_route: string = '/home';
  public showNavbar: boolean = false;

  constructor(private location: Location) {
    location.onUrlChange((url: string, state: unknown): void => {
      // this.current_route = url;
      // console.log(`this.current_route = ${this.current_route}`);
      if(url==="/home"){
        this.showNavbar = false; 
      }
      else{
        this.showNavbar = true; 
      }
    });
  }
}
