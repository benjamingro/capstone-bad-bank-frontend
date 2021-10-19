import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import {HomeComponent} from './home/home.component'; 
import {DepositComponent} from './deposit/deposit.component';
import {WithdrawComponent} from './withdraw/withdraw.component';
import {AccountComponent} from './account/account.component'; 

import { 
  AuthGuardService as AuthGuard 
} from './auth-guard.service';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'account', component: AccountComponent },
  { path: 'deposit', component: DepositComponent, canActivate:[AuthGuard]  },
  { path: 'withdraw', component: WithdrawComponent, canActivate:[AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: "**", component: HomeComponent  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
