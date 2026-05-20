export interface BankAccount {
  id: number;
  accountNo: string;
  customerId: number;
  customerName: string;
  accountType: string;
  balance: number;
  branchName: string;
  ifscCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccountRequest {
  customerId: number;
  accountType: string;
  branchName: string;
  ifscCode: string;
  initialDeposit: number;
}

export interface DepositWithdraw {
  amount: number;
  description: string;
}

export interface Transfer {
  fromAccountNo: string;
  toAccountNo: string;
  amount: number;
  description: string;
}
