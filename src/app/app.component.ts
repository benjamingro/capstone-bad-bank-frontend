import { Component } from '@angular/core';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { Location } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  useAnimation,
  keyframes,
  group,
  AnimationStyleMetadata,
  // ...
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fadeIn',[
      state('initial',style({opacity:0})),
      state('final',style({opacity:1})),
      transition('initial => final', [animate('0.5s'),]),
      transition('final => initial', [animate('0.5s'),]),

    ]),
    trigger('fadeOutIn',[
      state('initial',style({opacity:1})),
      state('final',style({opacity:1})),
      transition('initial => final', [animate('0.5s',keyframes([style({opacity:0,offset:0}),style({opacity:0,offset:0.5}),style({opacity:1,offset:1})]))]),
      transition('final => initial', [animate('0.5s',keyframes([style({opacity:0,offset:0}),style({opacity:0,offset:0.5}),style({opacity:1,offset:1})]))]),

    ]),
  ]
})
export class AppComponent {
  faLinkedin = faLinkedin;
  title = 'final-bad-bank';

  // private current_route: string = '/home';
  public showNavbar: boolean = false;

  public animationState:string="initial"; 

  constructor(private location: Location) {
    location.onUrlChange((url: string, state: unknown): void => {

      if(url==="/home"){
        this.showNavbar = false; 
      }
      else{
        this.showNavbar = true; 
        this.animationState==='initial'?this.animationState='final':this.animationState='initial'; 
      }
    });
  }
}
