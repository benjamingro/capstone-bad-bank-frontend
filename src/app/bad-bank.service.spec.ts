import { TestBed } from '@angular/core/testing';

import { BadBankService } from './bad-bank.service';

describe('BadBankService', () => {
  let service: BadBankService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BadBankService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
