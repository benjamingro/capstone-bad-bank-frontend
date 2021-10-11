import { Component, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// import {MyAuthService} from '../my-auth.service';
import {
  Auth,
  authState,
  signInAnonymously,
  signOut,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  EmailAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import { EMPTY, Observable, Subscription, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { traceUntilFirst } from '@angular/fire/performance';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

// import { BadBankUser } from '../bad-bank-types';

import { BadBankService } from '../bad-bank.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  faGoogle = faGoogle;
  faEnvelope = faEnvelope;

  public submitted: boolean = false;
  public signInWithEmailForm_submitted: boolean = false;
  public createAccountFromScratch_Form_submitted: boolean = false;

  // public error_userNotFound : boolean = false;
  public error_firebaseAuth: string = '';
  // error_firebaseAuth =
  // 'auth/user-not-found'
  // 'auth/email-already-in-use'
  //  auth/weak-password


  private readonly userDisposable: Subscription | undefined;
  public readonly user: Observable<User | null> = EMPTY;

  public isLoggedIn: boolean = false;

  public createAccountFromScratch_State: boolean = false;
  public createAccountFromScratchSuccess_State: boolean = false;

  public signInWithMyEmail_State: boolean = false;

  public busy: boolean = false;



  signInWithEmailForm = new FormGroup({
    email: new FormControl('', { validators: Validators.required }),
    password: new FormControl('', { validators: Validators.required }),
  });

  createAccountFromScratch_Form = new FormGroup({
    firstName: new FormControl('', { validators: Validators.required }),
    lastName: new FormControl('', { validators: Validators.required }),
    email: new FormControl('', { validators: Validators.required }),
    password: new FormControl('', { validators: Validators.required }),
    telephone: new FormControl(''),
  });

  constructor(
    @Optional() private auth: Auth,
    public badBankService: BadBankService
  ) {
    if (auth) {
      this.user = authState(this.auth);
      this.userDisposable = authState(this.auth)
        .pipe(
          traceUntilFirst('auth'),
          map((u) => !!u)
        )
        .subscribe((isLoggedIn) => {
          this.isLoggedIn = isLoggedIn;
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
    return await signOut(this.auth);
  }

  public async createAccountFromScratch_submit() {
    // validate form on client side
    // try to create account using email and password
    // if that is successful, create a user account
    // if that is successful, return a success message

    if (
      this.createAccountFromScratch_Form.get('email')?.valid &&
      this.createAccountFromScratch_Form.get('password')?.valid &&
      this.createAccountFromScratch_Form.get('firstName')?.valid &&
      this.createAccountFromScratch_Form.get('lastName')?.valid
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
                  this.createAccountFromScratchSuccess_State = true;
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
          // this.createAccountFromScratchSuccess_State = true;
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
    // this.createAccountFromScratchSuccess_State = true;
  }

  public createAccountFromScratch_cancel(): void {
    console.log('clicked createAccountFromScratch_cancel');
    this.createAccountFromScratch_State = false;
  }

  public createAccountFromScratch_initial(): void {
    this.createAccountFromScratch_State = true;
  }

  public createAccountFromScratchSuccess_ok(): void {
    this.createAccountFromScratchSuccess_State = false;
  }

  // public signInWithMyEmail(): void {
  //   this.signInWithMyEmail_State = true;
  // }

  async login() {
    return await signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  // async loginAnonymously() {
  //   return await signInAnonymously(this.auth);
  // }

  async logout() {
    return await signOut(this.auth);
  }

  public signInWithGoogle_submit(): void {
    signInWithPopup(this.auth, new GoogleAuthProvider())
      .then(() => {})
      .catch((error) => {
        console.log(JSON.stringify(error));
      });
  }

  public signInWithEmail_submit(): void {
    this.signInWithEmailForm_submitted = true;
    this.busy = true;

    const email: string = this.signInWithEmailForm.get('email')?.value;
    const password: string = this.signInWithEmailForm.get('password')?.value;

    // this.signInWithEmailForm

    if (
      this.signInWithEmailForm.get('email')?.valid &&
      this.signInWithEmailForm.get('password')?.valid
    ) {
      this.error_firebaseAuth = '';

      signInWithEmailAndPassword(this.auth, email, password)
        .then(() => {
          this.busy = false;
          this.signInWithMyEmail_State = false;
        })
        .catch((error) => {
          this.busy = false;
          this.error_firebaseAuth = error.code;
        });

      // return null;
    } else {
      // return null;
    }

    this.signInWithEmailForm.get('password')?.setValue('');
  }

  onSubmit(): void {}

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

  get email_signInWithEmail() {
    return this.signInWithEmailForm.get('email');
  }
  get password_signInWithEmail() {
    return this.signInWithEmailForm.get('password');
  }
}
