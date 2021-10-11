export type BadBankUser = {
    CustomerId:string,
    Fname:string,
    Lname:string, 
    Email: string,
    Telephone:string,
    AccountNumber:number,
    AccountBalance:number,
    TransactionHistory:[Transaction]
  }

  type Transaction = {
    AccountNumber:number,
    TransactionTime:number,
    TransactionAmount:number,
    Payee:string
  }

//   EATE TABLE TransactionsTable (AccountNumber INT, TransactionTime INT, TransactionAmount DECIMAL(15,2), Payee VARCHAR(100));