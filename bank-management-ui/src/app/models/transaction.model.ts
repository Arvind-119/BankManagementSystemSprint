export interface Transaction {
  id: number;
  transactionId: string;
  accountNo: string;
  transactionType: string;
  amount: number;
  fromAccount: string;
  toAccount: string;
  transactionDate: string;
  description: string;
  balanceAfterTransaction: number;
  status: string;
}
