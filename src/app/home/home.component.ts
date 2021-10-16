import { Component, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import {faMask} from '@fortawesome/free-solid-svg-icons';
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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeIn',[
      state('initial',style({opacity:0})),
      state('final',style({opacity:1})),
      transition('initial => final', [animate('1s'),])
    ]),
  ]
  
})
export class HomeComponent implements OnInit,AfterViewInit,AfterContentInit {
  faMask = faMask; 

  public animationState : string = 'initial';

  constructor() {
    // console.log(`animationState=${this.animationState}`); 
   }

  ngOnInit(): void {
    setTimeout(()=>{
      this.animationState="final"; 
      console.log(`animationState=${this.animationState}`);
    },1000)
    // this.animationState="final"; 
    // console.log(`animationState=${this.animationState}`); 

  }

  ngAfterViewInit():void{
    // this.animationState='final'; 
    // console.log(`animationState=${this.animationState}`); 

  }

  ngAfterContentInit():void{
    // this.animationState='final'; 
    // console.log(`animationState=${this.animationState}`); 
  }
  

}
