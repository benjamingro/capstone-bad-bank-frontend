import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home/home.component'; 
import {DepositComponent} from './deposit/deposit.component';
import {WithdrawComponent} from './withdraw/withdraw.component';
import {AccountComponent} from './account/account.component'; 


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'account', component: AccountComponent },
  { path: 'deposit', component: DepositComponent },
  { path: 'withdraw', component: WithdrawComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
