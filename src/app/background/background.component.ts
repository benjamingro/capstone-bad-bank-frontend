import { AfterViewInit, Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
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
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss'],
  animations: [
    trigger('fadePartiallyOut',[
      state('initial',style({opacity:1})),
      state('final',style({opacity:0.3})),
      transition('initial => final', [animate('2s'),])
    ]),
  ]
})
export class BackgroundComponent implements OnInit,AfterViewInit {

  private screenWidth?: number;
  private screenHeight?: number;
  
  private imageWidth : number = 3000; 
  private imageHeight : number = 1962;

  public marginTop:string="0px"; 
  public marginLeft:string="0px";

  public animationState:string = 'initial'; 



  constructor() { }
  // image size is 3000 width by 1962 height

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    console.log(`this.screenWidth = ${this.screenWidth} this.screenHeight = ${this.screenHeight}`);
    this.setBackgroundImageOffset();  
  }

  ngAfterViewInit() {
    // var width = this.backgroundImage?.nativeElement.offsetWidth;
    // var height = this.backgroundImage?.nativeElement.offsetHeight;
    // console.log('Width:' + width);
    // console.log('Height: ' + height);
    this.animationState='final'; 
  }

  private setBackgroundImageOffset() : void {
    const xDif = this.imageWidth - this.screenWidth!;
    const yDif = this.imageHeight - this.screenHeight!;

    if(xDif>0){
      this.marginLeft = `-${xDif/2+100}px`; 
    }
    else{
      this.marginLeft = "0px"; 
    }

    if(yDif>0){
      this.marginTop = `-${yDif/2-100}px`; 
    }
    else{
      this.marginTop = "0px"; 
    }
    
  }


  @HostListener('window:resize', ['$event'])
  onResize(event : Event) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.setBackgroundImageOffset();
  }

  // @ViewChild('backgroundImage')
  // backgroundImage?: ElementRef;


}
