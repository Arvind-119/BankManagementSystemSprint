import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { BankAccount } from '../../../models/account.model';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2>Bank Accounts</h2>
          <p>Manage all bank accounts</p>
        </div>
        <div class="header-actions">
        </div>
      </div>

      <div class="glass-card">
        <div class="table-toolbar">
          <div class="search-filter">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="filterAccounts()" placeholder="Search accounts..." id="account-search" />
          </div>
          <span class="record-count">{{ filteredAccounts.length }} accounts</span>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Account No</th>
                <th>Customer ID</th>
                <th>Type</th>
                <th>Balance (₹)</th>
                <th>Branch</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let account of filteredAccounts" class="table-row">
                <td class="mono">{{ account.accountNo }}</td>
                <td>{{ account.customerId }}</td>
                <td><span class="type-badge" [ngClass]="'type-' + account.accountType?.toLowerCase()">{{ account.accountType }}</span></td>
                <td class="balance">₹{{ account.balance | number:'1.2-2' }}</td>
                <td>{{ account.branchName || '—' }}</td>
                <td><span class="status-badge" [ngClass]="account.isActive ? 'status-active' : 'status-inactive'">{{ account.isActive ? 'Active' : 'Inactive' }}</span></td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="filteredAccounts.length === 0" class="empty-state"><p>No accounts found.</p></div>
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
    .header-actions { display: flex; gap: 12px; }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; text-decoration: none; border: none; font-family: 'Inter', sans-serif; }
    .btn-primary { background: linear-gradient(135deg, #667eea, #764ba2); color: white; box-shadow: 0 4px 15px rgba(102,126,234,0.3); }
    .btn-primary:hover { transform: translateY(-2px); }
    .btn-success { background: linear-gradient(135deg, #11998e, #38ef7d); color: white; box-shadow: 0 4px 15px rgba(17,153,142,0.3); }
    .btn-success:hover { transform: translateY(-2px); }
    .glass-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; }
    .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .search-filter { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 8px 16px; color: rgba(255,255,255,0.4); }
    .search-filter input { background: none; border: none; outline: none; color: #fff; font-size: 0.85rem; width: 250px; font-family: 'Inter', sans-serif; }
    .search-filter input::placeholder { color: rgba(255,255,255,0.3); }
    .record-count { font-size: 0.8rem; color: rgba(255,255,255,0.4); }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.5px; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.08); }
    td { padding: 14px 16px; font-size: 0.85rem; color: rgba(255,255,255,0.8); border-bottom: 1px solid rgba(255,255,255,0.05); }
    .table-row:hover td { background: rgba(255,255,255,0.03); }
    .mono { font-family: 'Courier New', monospace; font-size: 0.8rem; color: rgba(255,255,255,0.6); }
    .balance { font-weight: 700; color: #38ef7d; font-size: 0.9rem; }
    .type-badge { padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; }
    .type-savings { background: rgba(102,126,234,0.2); color: #667eea; }
    .type-current { background: rgba(247,151,30,0.2); color: #ffd200; }
    .type-fixed_deposit { background: rgba(17,153,142,0.2); color: #38ef7d; }
    .status-badge { padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 600; }
    .status-active { background: rgba(56,239,125,0.15); color: #38ef7d; }
    .status-inactive { background: rgba(255,65,108,0.15); color: #ff416c; }
    .empty-state { padding: 40px; text-align: center; }
    .empty-state p { color: rgba(255,255,255,0.4); }
    .toast { position: fixed; bottom: 24px; right: 24px; padding: 14px 24px; border-radius: 10px; font-size: 0.85rem; z-index: 1000; }
    .toast-success { background: rgba(56,239,125,0.15); color: #38ef7d; border: 1px solid rgba(56,239,125,0.3); }
    .toast-error { background: rgba(255,65,108,0.15); color: #ff416c; border: 1px solid rgba(255,65,108,0.3); }
  `]
})
export class AccountListComponent implements OnInit {
  accounts: BankAccount[] = [];
  filteredAccounts: BankAccount[] = [];
  searchTerm = '';
  message = '';
  isError = false;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void { this.loadAccounts(); }

  loadAccounts(): void {
    this.accountService.getAll().subscribe({
      next: (data) => { this.accounts = data; this.filteredAccounts = data; },
      error: () => this.showMessage('Failed to load accounts.', true)
    });
  }

  filterAccounts(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredAccounts = this.accounts.filter(a =>
      a.accountNo.toLowerCase().includes(term) || a.accountType?.toLowerCase().includes(term) ||
      a.branchName?.toLowerCase().includes(term) || String(a.customerId).includes(term)
    );
  }

  private showMessage(msg: string, error: boolean): void {
    this.message = msg; this.isError = error;
    setTimeout(() => this.message = '', 3000);
  }
}
