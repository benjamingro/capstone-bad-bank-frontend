import { Component, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators  } from '@angular/forms';

// import {MyAuthService} from '../my-auth.service'; 
import { Auth, authState, signInAnonymously, signOut, User, GoogleAuthProvider, signInWithPopup, EmailAuthProvider, signInWithEmailAndPassword,createUserWithEmailAndPassword } from '@angular/fire/auth';
import { EMPTY, Observable, Subscription,of } from 'rxjs';
import { map } from 'rxjs/operators';
import { traceUntilFirst } from '@angular/fire/performance';
import {faGoogle} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  faGoogle = faGoogle; 

  public submitted: boolean = false; 

  // public error_userNotFound : boolean = false; 
  public error_firebaseAuth : string= ""; 
  // error_firebaseAuth = 
  // 'auth/user-not-found'
  // 'auth/email-already-in-use'
  //  auth/weak-password

  public welcomeMessage : string = ""; // Welcome to Bad Bank Ben@uiuc.edu! 


  private readonly userDisposable: Subscription|undefined;
  public readonly user: Observable<User | null> = EMPTY;

  showLoginButton = false;
  showLogoutButton = false;
  
  basicForm = new FormGroup({
    email: new FormControl('', {validators: Validators.required}),
    password: new FormControl('', {validators: Validators.required}),
  });

  

  constructor(@Optional() private auth: Auth ) {
    // auth.app()
    // auth : Auth, googleAuthProvider : GoogleAuthProvider 
    // authService:AuthServic
    // console.log(`${auth?.currentUser}`);
    // auth.setti
    if (auth) {
      this.user = authState(this.auth);
      this.userDisposable = authState(this.auth).pipe(
        traceUntilFirst('auth'),
        map(u => !!u)
      ).subscribe(isLoggedIn => {
        this.showLoginButton = !isLoggedIn;
        this.showLogoutButton = isLoggedIn;
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

  async login() {
    return await signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  // async loginAnonymously() {
  //   return await signInAnonymously(this.auth);
  // }

  async logout() {
    return await signOut(this.auth);
  }

  async my_createUserWithEmailAndPassword(){
    this.submitted = true;
    const email : string = this.basicForm.get('email')?.value;
    const password : string = this.basicForm.get('password')?.value; 
    if(this.basicForm.get('email')?.valid && this.basicForm.get('password')?.valid){
      await createUserWithEmailAndPassword(this.auth,email,password).then(()=>this.error_firebaseAuth=='').catch(error=>{
        this.error_firebaseAuth = error.code; 
        console.log(`${error}`);
      }); 

      
      this.welcomeMessage = `Welcome ${email}`;  

      return null; 
      // return await createUserWithEmailAndPassword(this.auth,email,password).catch(error=>{
        
      //   console.log(`${error}`);
      // }); 
    }
    else{
      console.log(`form is invalid`); 
      return await of('invalid');
    }
    
  }

  async loginWithEmailAndPassword(){
    this.submitted = true; 
    const email : string = this.basicForm.get('email')?.value;
    const password : string = this.basicForm.get('password')?.value;
    // const email : string = this.email(); 
    // const email : string = this.email.get();  

    // const password : string = this.password(); 
    // return await signInWithEmailAndPassword(this.auth,email,password); 
    if(this.basicForm.get('email')?.valid && this.basicForm.get('password')?.valid){
      console.log(`form is valid`); 
      console.log(`email = ${email}`); 
      console.log(`password = ${password}`); 
      //reset state variable
      // this.error_userNotFound = false;
      this.error_firebaseAuth = ''; 
      return await signInWithEmailAndPassword(this.auth,email,password)
        .catch(error=>{
          this.error_firebaseAuth = error.code; 
          // if(error.code=='auth/user-not-found'){
          //   this.error_userNotFound = true; 
          // }
          
          console.log(`${typeof error}`);
          console.log(`${Object.keys(error)}`);
          console.log(`${Object.keys(error.customData)}`);

          console.log(`error.code   ${error.code}`);
          console.log(`error.customData   ${error.customData}`);
          console.log(`error.name     ${error.name}`);


          console.log(`error = ${error}`); 
        });
    }
    else{
      console.log(`form is invalid`); 
      return await of('invalid'); 
    }
    // return await signInWithEmailAndPassword(this.auth,email,password); 

  }

  onSubmit() : void {

  }

  get email() { return this.basicForm.get('email'); }
  get password() { return this.basicForm.get('password'); }


}
