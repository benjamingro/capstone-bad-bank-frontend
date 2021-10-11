import { Component, OnInit } from '@angular/core';

import {faArrowRight,faArrowDown,faAngleRight,faAngleDown} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnInit {
  faArrowRight = faArrowRight; 
  faArrowDown = faArrowDown; 
  faAngleRight = faAngleRight
  faAngleDown = faAngleDown; 

  public isCollapsed = true;

  constructor() { }

  ngOnInit(): void {
  }

}
