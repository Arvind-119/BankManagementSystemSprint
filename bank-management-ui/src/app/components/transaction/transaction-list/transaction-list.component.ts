import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../services/transaction.service';
import { Transaction } from '../../../models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div><h2>Transaction History</h2><p>View all banking transactions</p></div>
      </div>

      <div class="glass-card">
        <div class="table-toolbar">
          <div class="search-filter">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" [(ngModel)]="filterAccount" (ngModelChange)="filterTransactions()" placeholder="Filter by account number..." id="txn-filter" />
          </div>
          <span class="record-count">{{ filteredTransactions.length }} transactions</span>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>From Account</th>
                <th>To Account</th>
                <th>Type</th>
                <th>Amount (₹)</th>
                <th>Balance After</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let txn of filteredTransactions" class="table-row">
                <td class="mono">{{ txn.transactionId }}</td>
                <td class="mono">{{ txn.fromAccount || txn.accountNo }}</td>
                <td class="mono">{{ txn.toAccount || '—' }}</td>
                <td>
                  <span class="type-badge" [ngClass]="{
                    'type-deposit': txn.transactionType === 'DEPOSIT',
                    'type-withdrawal': txn.transactionType === 'WITHDRAWAL',
                    'type-transfer': txn.transactionType === 'TRANSFER'
                  }">{{ txn.transactionType }}</span>
                </td>
                <td class="amount" [ngClass]="{
                  'amount-credit': txn.transactionType === 'DEPOSIT',
                  'amount-debit': txn.transactionType === 'WITHDRAWAL',
                  'amount-transfer': txn.transactionType === 'TRANSFER'
                }">
                  {{ txn.transactionType === 'DEPOSIT' ? '+' : txn.transactionType === 'WITHDRAWAL' ? '-' : '↔' }}₹{{ txn.amount | number:'1.2-2' }}
                </td>
                <td>₹{{ txn.balanceAfterTransaction | number:'1.2-2' }}</td>
                <td>{{ txn.transactionDate | date:'medium' }}</td>
                <td><span class="status-badge" [ngClass]="'status-' + txn.status?.toLowerCase()">{{ txn.status }}</span></td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="filteredTransactions.length === 0" class="empty-state"><p>No transactions found.</p></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { animation: fadeIn 0.4s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { font-size: 1.6rem; font-weight: 700; color: #fff; margin: 0 0 4px 0; }
    .page-header p { color: rgba(255,255,255,0.5); font-size: 0.85rem; margin: 0; }
    .glass-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; }
    .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .search-filter { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 8px 16px; color: rgba(255,255,255,0.4); }
    .search-filter input { background: none; border: none; outline: none; color: #fff; font-size: 0.85rem; width: 280px; font-family: 'Inter', sans-serif; }
    .search-filter input::placeholder { color: rgba(255,255,255,0.3); }
    .record-count { font-size: 0.8rem; color: rgba(255,255,255,0.4); }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.5px; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.08); }
    td { padding: 14px 16px; font-size: 0.85rem; color: rgba(255,255,255,0.8); border-bottom: 1px solid rgba(255,255,255,0.05); }
    .table-row:hover td { background: rgba(255,255,255,0.03); }
    .mono { font-family: 'Courier New', monospace; font-size: 0.8rem; color: rgba(255,255,255,0.6); }
    .type-badge { padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; }
    .type-deposit { background: rgba(17,153,142,0.2); color: #38ef7d; }
    .type-withdrawal { background: rgba(255,65,108,0.2); color: #ff416c; }
    .type-transfer { background: rgba(102,126,234,0.2); color: #667eea; }
    .amount { font-weight: 700; font-size: 0.9rem; }
    .amount-credit { color: #38ef7d; }
    .amount-debit { color: #ff416c; }
    .amount-transfer { color: #667eea; }
    .status-badge { padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 600; }
    .status-success { background: rgba(56,239,125,0.15); color: #38ef7d; }
    .status-failed { background: rgba(255,65,108,0.15); color: #ff416c; }
    .status-pending { background: rgba(247,151,30,0.15); color: #ffd200; }
    .empty-state { padding: 40px; text-align: center; }
    .empty-state p { color: rgba(255,255,255,0.4); }

    @media (max-width: 576px) {
      .page-header { flex-direction: column; align-items: flex-start; gap: 8px; }
      .table-toolbar { flex-direction: column; align-items: flex-start; gap: 12px; }
      .search-filter { width: 100%; }
      .search-filter input { width: 100%; }
    }
  `]
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  filterAccount = '';

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactionService.getAll().subscribe({
      next: (data) => { const reversed = data.reverse(); this.transactions = reversed; this.filteredTransactions = reversed; },
      error: () => {}
    });
  }

  filterTransactions(): void {
    if (!this.filterAccount.trim()) { this.filteredTransactions = this.transactions; return; }
    this.filteredTransactions = this.transactions.filter(t => t.accountNo.includes(this.filterAccount));
  }
}
