import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BadBankService } from '../bad-bank.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss'],
})
export class DepositComponent implements OnInit {
  public depositForm_submitted: boolean = false;

  public busy_State: boolean = false;
  public depositSuccess_State: boolean = false;

  depositForm = new FormGroup({
    amount: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.pattern('^[0-9]*$'),
    ]),
  });

  constructor(public badBankService: BadBankService) {}

  ngOnInit(): void {}

  public depositForm_submit(): void {
    this.busy_State = true;
    this.depositForm_submitted = true;
    console.log(`this.depositForm.get('amount')?.value = ${this.depositForm.get('amount')?.value}`)

    if (this.depositForm.get('amount')?.valid) {
      // call firebase here
      this.badBankService.deposit_Authenticated_Observable(this.depositForm.get('amount')?.value)
        .subscribe(
          (response: any) => {
            this.depositSuccess_State = true;
            this.busy_State = false;
          },
          (error: any) => {
            // show error here
            this.busy_State = false;
          }
        );
    } else {
      this.busy_State = false;
    }
  }

  public success_ok() : void {
    this.depositForm.setValue({amount:''});
    this.depositSuccess_State=false; 
    this.depositForm_submitted = false; 
  }

  get amount_depositForm() {
    return this.depositForm.get('amount');
  }
}
