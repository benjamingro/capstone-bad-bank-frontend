import { Component, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import { EMPTY, Observable, Subscription, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { traceUntilFirst } from '@angular/fire/performance';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { BadBankService } from '../bad-bank.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  //#region font awesome members
  faGoogle = faGoogle;
  faEnvelope = faEnvelope;
  faArrowLeft = faArrowLeft;
  faEye = faEye; 
  faEyeSlash=faEyeSlash;  
  //#endregion

  //#region auth state members
  private readonly userDisposable: Subscription | undefined;
  public readonly user: Observable<User | null> = EMPTY;
  public isLoggedIn: boolean = false;
  public displayName:string=''; 
  public error_firebaseAuth: string = '';
  // error_firebaseAuth =
  // 'auth/user-not-found'
  // 'auth/email-already-in-use'
  //  auth/weak-password

  //#endregion


  //#region application state members
  public createAccountFromScratch_State: boolean = false;
  public createAccountSuccess_State: boolean = false;
  public createAccountFromGoogle_State: boolean = false;
  public signInWithMyEmail_State: boolean = false;
  public viewTransactionHistory_State : boolean = false; 
  public forgotPassword_State : boolean = false;
  public forgotPasswordSuccess_State : boolean = false; 
  public busy: boolean = false;
 
  //#endregion


  // #region form members
  public viewPassword_signInWithEmailForm : boolean = false; 

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', { validators: Validators.required }),
  });

  signInWithEmailForm = new FormGroup({
    email: new FormControl('', { validators: Validators.required }),
    password: new FormControl('', { validators: Validators.required }),
  });

  createAccountFromScratch_Form = new FormGroup({
    firstName: new FormControl('', { validators: Validators.required }),
    lastName: new FormControl('', { validators: Validators.required }),
    email: new FormControl('', { validators: Validators.required }),
    password: new FormControl('', { validators: Validators.required }),
    agree: new FormControl(false, { validators: Validators.requiredTrue }),
    telephone: new FormControl(''),
  });

  createAccountFromGoogle_Form = new FormGroup({
    firstName: new FormControl('', { validators: Validators.required }),
    lastName: new FormControl('', { validators: Validators.required }),
    telephone: new FormControl(''),
    agree: new FormControl(false, { validators: Validators.requiredTrue }),
  });

  // #endregion

  //#region form state members
  public submitted: boolean = false;
  public signInWithEmailForm_submitted: boolean = false;
  public createAccountFromScratch_Form_submitted: boolean = false;
  public createAccountFromGoogle_Form_submitted: boolean = false;
  public forgotPasswordForm_submitted : boolean = false; 
  //#endregion

  constructor(
    @Optional() private auth: Auth,
    public badBankService: BadBankService
  ) {
    if (auth) {
      this.user = authState(this.auth);
      this.userDisposable = authState(this.auth)
          .subscribe((myUser) => {
            if(myUser?.uid){
              this.isLoggedIn = true; 
              this.displayName = myUser.displayName!; 
            }
            else{
              this.isLoggedIn = false; 
            }

          // get user data 
          if(this.isLoggedIn && !this.badBankService.badBankUser){
            badBankService.getUserAccount_Authenticated_Observable().subscribe(
              (response:any)=>{
                this.busy=false;
                if(response === 'user_not_set_up'){
                  this.createAccountFromGoogle_State = true; 
                  console.log(`inside user_not_set_up, this.createAccountFromGoogle_State = true`);
                  
                } 

              },(error:any)=>{
                this.busy=false;
                // sql error need to handle here , general error should work
                console.log(error); 
              });
          }
          
        });
    }

  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.userDisposable) {
      this.userDisposable.unsubscribe();
    }
  }

  public async mySignOut() {
    return await signOut(this.auth).then(()=>{
      // this.auth.signOut(); 
    });
  }

  //#region forgotPasswordForm methods
  public async forgotPassword_submit(){
    this.forgotPasswordForm_submitted = true; 
    this.error_firebaseAuth = ""; 
    this.busy=true; 
    if(this.email_forgotPassword?.valid){
      await sendPasswordResetEmail(this.auth,this.email_forgotPassword?.value)
      .then(()=>{
        // password reset successful 
        this.forgotPasswordForm_submitted = false; 

        this.forgotPassword_State = false; 
        this.forgotPasswordSuccess_State = true; 
        this.busy = false; 
      })
      .catch((error : any)=>{
        this.error_firebaseAuth = error.code;
        console.log(`error = ${JSON.stringify(error)}`);
        console.log(error);
        this.busy = false;
      }); 
    }
    
  }

  public forgotPassword_cancel(){
    this.email_forgotPassword?.setValue(''); 
    this.forgotPassword_State = false; 
    this.forgotPasswordForm_submitted = false;
    this.error_firebaseAuth = ''; 
  }

  public createNewAccount_forgotPasswordForm() : void { 
    this.forgotPassword_State = false; 
    this.createAccountFromScratch_State = true; 
    this.email_forgotPassword?.setValue(''); 
    this.forgotPasswordForm_submitted = false; 
    this.error_firebaseAuth = ''; 
  }

  public tryAgain_forgotPasswordForm() : void {
    this.email_forgotPassword?.setValue(''); 
    this.forgotPasswordForm_submitted = false;
    this.error_firebaseAuth = ''; 
  }

  // this method is not in forgotPasswordForm
  public forgotPassword_success_ok() : void {
    this.email_forgotPassword?.setValue(''); 
    this.forgotPasswordSuccess_State = false; 
    this.signInWithMyEmail_State = true; 
  }

  // #endregion

  //#region createAccountFromGoogle_Form methods
  public async createAccountFromGoogle_submit(){

    this.createAccountFromGoogle_Form_submitted = true; 

    if (
      this.firstName_google?.valid &&
      this.lastName_google?.valid &&
      this.agree_google?.valid
    ) {
      // form is validated
      const firstName: string = this.firstName_google?.value;
      const lastName: string = this.lastName_google?.value; 
      const telephone: string = this.telephone_google?.value;
      // call firebase here 
      this.busy = true; 
      this.badBankService.createUserAccountWithGoogle_Authenticated_Observable(firstName,lastName,telephone).subscribe(
        (response:any)=>{
          try{
            response=JSON.parse(response);
            this.createAccountSuccess_State = true;
          }
          catch(error){
            // need to catch error here 
          }
          this.createAccountFromGoogle_State = false;  
          this.busy = false;
        },
        (error:any)=>{
          console.log(`error = ${JSON.stringify(error)}`);
          this.busy = false;
        }); 
    }
  }

  public async createAccountFromGoogle_cancel() {
    this.createAccountFromGoogle_State = false;
    this.busy=true; 
    await signOut(this.auth); 
    this.busy=false; 
     
  }

  // this member is not technically in createAccountFromGoogle_Form
  public signInWithGoogle_submit(): void {

    signInWithPopup(this.auth, new GoogleAuthProvider())
      .then(() => {})
      .catch((error) => {
        console.log(JSON.stringify(error));
      });
  }
  //#endregion

  //#region createAccountFromScratch_Form methods

  public async createAccountFromScratch_submit() {
    // validate form on client side
    // try to create account using email and password
    // if that is successful, create a user account
    // if that is successful, return a success message

    if (
      this.createAccountFromScratch_Form.get('email')?.valid &&
      this.createAccountFromScratch_Form.get('password')?.valid &&
      this.createAccountFromScratch_Form.get('firstName')?.valid &&
      this.createAccountFromScratch_Form.get('lastName')?.valid && 
      this.createAccountFromScratch_Form.get('agree')?.valid
    ) {
      // form is validated
      const email: string =
        this.createAccountFromScratch_Form.get('email')?.value;
      const password: string =
        this.createAccountFromScratch_Form.get('password')?.value;
      const firstName: string =
        this.createAccountFromScratch_Form.get('firstName')?.value;
      const lastName: string =
        this.createAccountFromScratch_Form.get('lastName')?.value;
      const telephone: string =
        this.createAccountFromScratch_Form.get('telephone')?.value;
      this.busy = true;
      await createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential: any) => {
          console.log(`userCredential = ${JSON.stringify(userCredential)}`);
          const id_token = userCredential.user.stsTokenManager.accessToken;
          console.log(`id_token = ${id_token}`);

          this.error_firebaseAuth == '';
          // call next step - set up user account
          this.badBankService
            .createUserAccountWithEmail_Authenticated_Observable(
              id_token,
              firstName,
              lastName,
              email,
              telephone
            )
            .subscribe(
              (response: any) => {
                try{
                  response=JSON.parse(response);
                  this.createAccountSuccess_State = true;
                }
                catch(error){
                  // need to catch error here 
                }

                this.createAccountFromScratch_State = false;  
                this.busy = false;
                
                
              },
              (error: any) => {
                console.log(`error = ${JSON.stringify(error)}`);
                this.busy = false;
              }
            );
          // this.busy = false;
          // this.createAccountSuccess_State = true;
        })
        .catch((error) => {
          this.busy = false;
          this.error_firebaseAuth = error.code;
          console.log(`${error}`);
        });
    } else {
      // form is not validated
      this.createAccountFromScratch_Form_submitted = true;
    }

    // console.log('clicked createAccountFromScratch');
    // this.createAccountSuccess_State = true;
  }

  public createAccountFromScratch_cancel(): void {
    console.log('clicked createAccountFromScratch_cancel');
    this.createAccountFromScratch_State = false;
  }

  public createAccountFromScratch_initial(): void {
    this.createAccountFromScratch_State = true;
  }

  public createAccountSuccess_ok(): void {
    this.createAccountSuccess_State = false;
  }
  //#endregion

  // #region signInWithEmailForm methods 
  public signInWithEmail_submit(): void {
    this.signInWithEmailForm_submitted = true;
    this.busy = true;

    const email: string = this.signInWithEmailForm.get('email')?.value;
    const password: string = this.signInWithEmailForm.get('password')?.value;

    if (
      this.signInWithEmailForm.get('email')?.valid &&
      this.signInWithEmailForm.get('password')?.valid
    ) {
      this.error_firebaseAuth = '';
      signInWithEmailAndPassword(this.auth, email, password)
        .then(() => {
          // this.busy = false;
          this.signInWithMyEmail_State = false;
          this.badBankService.getUserAccount_Authenticated_Observable().subscribe(
            (results:any)=>{
              try{
                JSON.parse(results);
                 this.busy=false; 
              }
              catch(error){
                //handle error here 
                this.busy=false;

              }
            },
            (error:any)=>{
                //handle error here 
                
            }); 
        })
        .catch((error) => {
          console.log('inside catch signInWithEmailAndPassword error'); 
          console.log(error); 
          this.busy = false;
          this.error_firebaseAuth = error.code;
        });

      // return null;
    } else {
      // return null;
      this.busy = false;
    }

    this.signInWithEmailForm.get('password')?.setValue('');
  }

  public toggle_viewPassword_signInWithEmailForm() : void {
    this.viewPassword_signInWithEmailForm = !this.viewPassword_signInWithEmailForm; 
  }

  public cancel_signInWithEmailForm() : void { 
    this.signInWithMyEmail_State = false; 
    this.signInWithEmailForm_submitted = false; 
    this.signInWithEmailForm.get('email')?.setValue(''); 
    this.signInWithEmailForm.get('password')?.setValue('');
  }

  public createNewAccount_signInWithEmailForm() : void { 
    this.signInWithMyEmail_State = false; 
    this.createAccountFromScratch_State = true; 
    this.email_signInWithEmail?.setValue(''); 
    this.password_signInWithEmail?.setValue('');
    this.error_firebaseAuth='';  
    this.signInWithEmailForm_submitted = false; 
  }

  public tryAgain_signInWithEmailForm() : void {
    this.signInWithEmailForm_submitted=false; 
    this.error_firebaseAuth=''; 
    this.email_signInWithEmail?.setValue(''); 
    this.password_signInWithEmail?.setValue('');
  }
  // #endregion

  onSubmit(): void {}

  //#region form getters

  // createAccountFromScratch_Form
  get firstName() {
    return this.createAccountFromScratch_Form.get('firstName');
  }
  get lastName() {
    return this.createAccountFromScratch_Form.get('lastName');
  }

  get email() {
    return this.createAccountFromScratch_Form.get('email');
  }
  get password() {
    return this.createAccountFromScratch_Form.get('password');
  }
  get telephone() {
    return this.createAccountFromScratch_Form.get('telephone');
  }
  get agree() {
    return this.createAccountFromScratch_Form.get('agree');
  }

  // signInWithEmailForm
  get email_signInWithEmail() {
    return this.signInWithEmailForm.get('email');
  }
  get password_signInWithEmail() {
    return this.signInWithEmailForm.get('password');
  }

  // createAccountFromGoogle_Form
  get firstName_google() {
    return this.createAccountFromGoogle_Form.get('firstName');
  }
  get lastName_google() {
    return this.createAccountFromGoogle_Form.get('lastName');
  }
  get telephone_google() {
    return this.createAccountFromGoogle_Form.get('telephone');
  }
  get agree_google(){
    return this.createAccountFromGoogle_Form.get('agree');
  }

  // forgotPasswordForm
  get email_forgotPassword() {
    return this.forgotPasswordForm.get('email');
  }

    //#endregion

  
}
