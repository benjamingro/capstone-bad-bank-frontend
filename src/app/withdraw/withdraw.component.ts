import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { BadBankService } from '../bad-bank.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss'],
})
export class WithdrawComponent implements OnInit {
  public withdrawForm_submitted: boolean = false;

  public busy_State: boolean = false;
  public withdrawSuccess_State: boolean = false;
  public error_State:boolean = false; 

  withdrawForm = new FormGroup({
    amount: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.pattern('^[0-9]*$'),
      (control: AbstractControl) => Validators.max(this.badBankService.badBankUser!.AccountBalance)(control)
    ]),
  });
  constructor(public badBankService: BadBankService) {

  }

  ngOnInit(): void {}

  public withdrawForm_submit(): void {
    this.busy_State = true;
    this.withdrawForm_submitted = true;

    if (this.withdrawForm.get('amount')?.valid) {
      // call firebase here
      this.badBankService
        .withdraw_Authenticated_Observable(this.withdrawForm.get('amount')?.value)
        .subscribe(
          (response: any) => {
            this.withdrawSuccess_State = true;
            this.busy_State = false;
          },
          (error: any) => {
            // show error here
            this.busy_State = false;
            this.error_State = true; 
          }
        );
    } else {
      this.busy_State = false;
    }
  }

  public success_ok() : void {
    this.withdrawForm.setValue({amount:''});
    this.withdrawSuccess_State=false; 
    this.withdrawForm_submitted = false; 
  }

  get amount_withdrawForm() {
    return this.withdrawForm.get('amount');
  }
}
