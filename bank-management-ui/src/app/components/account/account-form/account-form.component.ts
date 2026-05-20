import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div><h2>Create New Bank Account</h2><p>Open a new bank account for a customer</p></div>
        <a routerLink="/accounts" class="btn btn-outline" id="btn-back-accounts">← Back to Accounts</a>
      </div>
      <div class="glass-card">
        <form [formGroup]="accountForm" (ngSubmit)="onSubmit()" id="account-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="customerId">Customer ID *</label>
              <select formControlName="customerId" id="customerId">
                <option [ngValue]="null">Select Customer</option>
                <option *ngFor="let c of customers" [ngValue]="c.id">{{ c.id }} - {{ c.firstName }} {{ c.lastName }}</option>
              </select>
              <span class="error" *ngIf="accountForm.get('customerId')?.touched && accountForm.get('customerId')?.invalid">Customer is required</span>
            </div>
            <div class="form-group">
              <label for="accountType">Account Type *</label>
              <select formControlName="accountType" id="accountType">
                <option value="">Select Type</option>
                <option value="SAVINGS">Savings</option>
                <option value="CURRENT">Current</option>
                <option value="FIXED_DEPOSIT">Fixed Deposit</option>
              </select>
              <span class="error" *ngIf="accountForm.get('accountType')?.touched && accountForm.get('accountType')?.invalid">Account type is required</span>
            </div>
            <div class="form-group">
              <label for="branchName">Branch Name</label>
              <input type="text" formControlName="branchName" id="branchName" placeholder="Enter branch name" />
            </div>
            <div class="form-group">
              <label for="ifscCode">IFSC Code</label>
              <input type="text" formControlName="ifscCode" id="ifscCode" placeholder="Enter IFSC code" />
            </div>
            <div class="form-group">
              <label for="initialDeposit">Initial Deposit (₹)</label>
              <input type="number" formControlName="initialDeposit" id="initialDeposit" placeholder="Enter initial deposit amount" />
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-outline" routerLink="/accounts">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="accountForm.invalid" id="btn-submit-account">Create Account</button>
          </div>
        </form>
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
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-outline { background: transparent; color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.2); }
    .glass-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.5px; }
    .form-group input, .form-group select { padding: 12px 16px; border-radius: 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #fff; font-size: 0.9rem; font-family: 'Inter', sans-serif; outline: none; transition: all 0.3s; }
    .form-group input:focus, .form-group select:focus { border-color: rgba(102,126,234,0.5); }
    .form-group select option { background: #1a1a2e; color: #fff; }
    .error { font-size: 0.75rem; color: #ff416c; }
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); }
    .toast { position: fixed; bottom: 24px; right: 24px; padding: 14px 24px; border-radius: 10px; font-size: 0.85rem; z-index: 1000; }
    .toast-success { background: rgba(56,239,125,0.15); color: #38ef7d; border: 1px solid rgba(56,239,125,0.3); }
    .toast-error { background: rgba(255,65,108,0.15); color: #ff416c; border: 1px solid rgba(255,65,108,0.3); }
  `]
})
export class AccountFormComponent implements OnInit {
  accountForm!: FormGroup;
  customers: Customer[] = [];
  message = '';
  isError = false;

  constructor(private fb: FormBuilder, private accountService: AccountService, private customerService: CustomerService, private router: Router) {}

  ngOnInit(): void {
    this.accountForm = this.fb.group({
      customerId: [null, Validators.required],
      accountType: ['', Validators.required],
      branchName: [''],
      ifscCode: [''],
      initialDeposit: [0]
    });
    this.customerService.getAll().subscribe({ next: (data) => this.customers = data, error: () => {} });
  }

  onSubmit(): void {
    if (this.accountForm.invalid) return;
    this.accountService.create(this.accountForm.value).subscribe({
      next: () => { this.message = 'Account created successfully!'; this.isError = false; setTimeout(() => this.router.navigate(['/accounts']), 1500); },
      error: (err) => { this.message = err.error?.message || 'Failed to create account.'; this.isError = true; setTimeout(() => this.message = '', 3000); }
    });
  }
}
