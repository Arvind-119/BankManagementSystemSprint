import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-account-operations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div><h2>Banking Operations</h2><p>Perform deposits, withdrawals, and transfers</p></div>
        <a routerLink="/accounts" class="btn btn-outline">← Back to Accounts</a>
      </div>

      <div class="operation-tabs">
        <button [class.active]="activeTab === 'deposit'" (click)="activeTab='deposit'" id="tab-deposit" class="tab-btn deposit-tab">💵 Deposit</button>
        <button [class.active]="activeTab === 'withdraw'" (click)="activeTab='withdraw'" id="tab-withdraw" class="tab-btn withdraw-tab">💸 Withdraw</button>
        <button [class.active]="activeTab === 'transfer'" (click)="activeTab='transfer'" id="tab-transfer" class="tab-btn transfer-tab">🔄 Transfer</button>
      </div>

      <!-- Deposit -->
      <div class="glass-card" *ngIf="activeTab === 'deposit'">
        <h3 class="form-title">Deposit Money</h3>
        <form [formGroup]="depositForm" (ngSubmit)="doDeposit()" id="deposit-form">
          <div class="form-grid">
            <div class="form-group"><label>Account No *</label><input type="text" formControlName="accountNo" placeholder="Enter account number" /></div>
            <div class="form-group"><label>Amount (₹) *</label><input type="number" formControlName="amount" placeholder="Enter amount" /></div>
            <div class="form-group full-width"><label>Description</label><input type="text" formControlName="description" placeholder="Enter description" /></div>
          </div>
          <div class="form-actions"><button type="submit" class="btn btn-success" [disabled]="depositForm.invalid" id="btn-deposit">Deposit</button></div>
        </form>
      </div>

      <!-- Withdraw -->
      <div class="glass-card" *ngIf="activeTab === 'withdraw'">
        <h3 class="form-title">Withdraw Money</h3>
        <form [formGroup]="withdrawForm" (ngSubmit)="doWithdraw()" id="withdraw-form">
          <div class="form-grid">
            <div class="form-group"><label>Account No *</label><input type="text" formControlName="accountNo" placeholder="Enter account number" /></div>
            <div class="form-group"><label>Amount (₹) *</label><input type="number" formControlName="amount" placeholder="Enter amount" /></div>
            <div class="form-group full-width"><label>Description</label><input type="text" formControlName="description" placeholder="Enter description" /></div>
          </div>
          <div class="form-actions"><button type="submit" class="btn btn-danger" [disabled]="withdrawForm.invalid" id="btn-withdraw">Withdraw</button></div>
        </form>
      </div>

      <!-- Transfer -->
      <div class="glass-card" *ngIf="activeTab === 'transfer'">
        <h3 class="form-title">Transfer Money</h3>
        <form [formGroup]="transferForm" (ngSubmit)="doTransfer()" id="transfer-form">
          <div class="form-grid">
            <div class="form-group"><label>From Account *</label><input type="text" formControlName="fromAccountNo" placeholder="Source account" /></div>
            <div class="form-group"><label>To Account *</label><input type="text" formControlName="toAccountNo" placeholder="Destination account" /></div>
            <div class="form-group"><label>Amount (₹) *</label><input type="number" formControlName="amount" placeholder="Enter amount" /></div>
            <div class="form-group"><label>Description</label><input type="text" formControlName="description" placeholder="Enter description" /></div>
          </div>
          <div class="form-actions"><button type="submit" class="btn btn-primary" [disabled]="transferForm.invalid" id="btn-transfer">Transfer</button></div>
        </form>
      </div>

      <!-- Result -->
      <div class="glass-card result-card" *ngIf="resultAccount">
        <h3>Operation Successful ✅</h3>
        <div class="result-grid">
          <div class="result-item"><span class="label">Account</span><span class="value mono">{{ resultAccount.accountNo }}</span></div>
          <div class="result-item"><span class="label">Updated Balance</span><span class="value balance">₹{{ resultAccount.balance | number:'1.2-2' }}</span></div>
          <div class="result-item"><span class="label">Type</span><span class="value">{{ resultAccount.accountType }}</span></div>
          <div class="result-item"><span class="label">Status</span><span class="value status-active">{{ resultAccount.isActive ? 'Active' : 'Inactive' }}</span></div>
        </div>
      </div>

      <div *ngIf="message" class="toast" [ngClass]="{'toast-success': !isError, 'toast-error': isError}">{{ message }}</div>
    </div>
  `,
  styles: [`
    .page-container { animation: fadeIn 0.4s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { font-size: 1.6rem; font-weight: 700; color: #fff; margin: 0 0 4px 0; }
    .page-header p { color: rgba(255,255,255,0.5); font-size: 0.85rem; margin: 0; }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; text-decoration: none; border: none; font-family: 'Inter', sans-serif; }
    .btn-primary { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
    .btn-success { background: linear-gradient(135deg, #11998e, #38ef7d); color: white; }
    .btn-danger { background: linear-gradient(135deg, #ff416c, #ff4b2b); color: white; }
    .btn-outline { background: transparent; color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.2); }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .operation-tabs { display: flex; gap: 12px; margin-bottom: 24px; }
    .tab-btn { padding: 12px 24px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.6); font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.3s; font-family: 'Inter', sans-serif; }
    .tab-btn.active { color: #fff; }
    .deposit-tab.active { background: rgba(17,153,142,0.2); border-color: rgba(56,239,125,0.3); color: #38ef7d; }
    .withdraw-tab.active { background: rgba(255,65,108,0.2); border-color: rgba(255,65,108,0.3); color: #ff416c; }
    .transfer-tab.active { background: rgba(102,126,234,0.2); border-color: rgba(102,126,234,0.3); color: #667eea; }
    .tab-btn:hover { background: rgba(255,255,255,0.08); }

    .glass-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; margin-bottom: 20px; }
    .form-title { font-size: 1.2rem; font-weight: 600; color: #fff; margin: 0 0 24px 0; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    .full-width { grid-column: 1 / -1; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.5px; }
    .form-group input { padding: 12px 16px; border-radius: 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #fff; font-size: 0.9rem; font-family: 'Inter', sans-serif; outline: none; transition: all 0.3s; }
    .form-group input:focus { border-color: rgba(102,126,234,0.5); }
    .form-group input::placeholder { color: rgba(255,255,255,0.25); }
    .form-actions { display: flex; justify-content: flex-end; }

    .result-card { border-color: rgba(56,239,125,0.2); }
    .result-card h3 { color: #38ef7d; margin: 0 0 20px 0; }
    .result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .result-item { display: flex; flex-direction: column; gap: 4px; }
    .result-item .label { font-size: 0.75rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.5px; }
    .result-item .value { font-size: 1rem; color: #fff; font-weight: 600; }
    .mono { font-family: 'Courier New', monospace; }
    .balance { color: #38ef7d; font-size: 1.3rem; }
    .status-active { color: #38ef7d; }

    .toast { position: fixed; bottom: 24px; right: 24px; padding: 14px 24px; border-radius: 10px; font-size: 0.85rem; z-index: 1000; }
    .toast-success { background: rgba(56,239,125,0.15); color: #38ef7d; border: 1px solid rgba(56,239,125,0.3); }
    .toast-error { background: rgba(255,65,108,0.15); color: #ff416c; border: 1px solid rgba(255,65,108,0.3); }
  `]
})
export class AccountOperationsComponent {
  activeTab = 'deposit';
  depositForm: FormGroup;
  withdrawForm: FormGroup;
  transferForm: FormGroup;
  resultAccount: any = null;
  message = '';
  isError = false;

  constructor(private fb: FormBuilder, private accountService: AccountService) {
    this.depositForm = this.fb.group({ accountNo: ['', Validators.required], amount: [null, Validators.required], description: [''] });
    this.withdrawForm = this.fb.group({ accountNo: ['', Validators.required], amount: [null, Validators.required], description: [''] });
    this.transferForm = this.fb.group({ fromAccountNo: ['', Validators.required], toAccountNo: ['', Validators.required], amount: [null, Validators.required], description: [''] });
  }

  doDeposit(): void {
    const { accountNo, amount, description } = this.depositForm.value;
    this.accountService.deposit(accountNo, { amount, description }).subscribe({
      next: (res) => { this.resultAccount = res; this.showMsg('Deposit successful!', false); this.depositForm.reset(); },
      error: (err) => this.showMsg(err.error?.message || 'Deposit failed.', true)
    });
  }

  doWithdraw(): void {
    const { accountNo, amount, description } = this.withdrawForm.value;
    this.accountService.withdraw(accountNo, { amount, description }).subscribe({
      next: (res) => { this.resultAccount = res; this.showMsg('Withdrawal successful!', false); this.withdrawForm.reset(); },
      error: (err) => this.showMsg(err.error?.message || 'Withdrawal failed. Insufficient balance?', true)
    });
  }

  doTransfer(): void {
    this.accountService.transfer(this.transferForm.value).subscribe({
      next: (res) => { this.resultAccount = res; this.showMsg('Transfer successful!', false); this.transferForm.reset(); },
      error: (err) => this.showMsg(err.error?.message || 'Transfer failed.', true)
    });
  }

  private showMsg(msg: string, error: boolean): void {
    this.message = msg; this.isError = error;
    setTimeout(() => this.message = '', 4000);
  }
}
