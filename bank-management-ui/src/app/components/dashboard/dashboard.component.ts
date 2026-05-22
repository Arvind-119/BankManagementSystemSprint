import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { AccountService } from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { Transaction } from '../../models/transaction.model';
import { SessionUser } from '../../models/auth.model';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome back, {{ user?.name || 'Manager' }} 👋</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card customers-card" id="stat-customers">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="stat-info">
            <h3>{{ customerCount }}</h3>
            <span>Total Customers</span>
          </div>
        </div>

        <div class="stat-card accounts-card" id="stat-accounts">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <div class="stat-info">
            <h3>{{ accountCount }}</h3>
            <span>Total Accounts</span>
          </div>
        </div>

        <div class="stat-card transactions-card" id="stat-transactions">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          </div>
          <div class="stat-info">
            <h3>{{ transactionCount }}</h3>
            <span>Total Transactions</span>
          </div>
        </div>

        <div class="stat-card balance-card" id="stat-balance">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="stat-info">
            <h3>₹{{ totalBalance | number:'1.0-0' }}</h3>
            <span>Total Deposits</span>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="recent-section glass-card">
          <div class="section-header">
            <h3>Recent Transactions</h3>
            <a routerLink="/transactions" class="view-all">View All →</a>
          </div>
          <div class="table-container">
            <table *ngIf="recentTransactions.length > 0">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Account</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let t of recentTransactions">
                  <td class="txn-id">{{ t.transactionId | slice:0:12 }}...</td>
                  <td>{{ t.accountNo }}</td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'badge-deposit': t.transactionType === 'DEPOSIT',
                      'badge-withdrawal': t.transactionType === 'WITHDRAWAL',
                      'badge-transfer': t.transactionType === 'TRANSFER'
                    }">{{ t.transactionType }}</span>
                  </td>
                  <td class="amount" [ngClass]="{
                    'amount-credit': t.transactionType === 'DEPOSIT',
                    'amount-debit': t.transactionType === 'WITHDRAWAL'
                  }">₹{{ t.amount | number:'1.2-2' }}</td>
                  <td><span class="status-badge status-{{ t.status?.toLowerCase() }}">{{ t.status }}</span></td>
                </tr>
              </tbody>
            </table>
            <div *ngIf="recentTransactions.length === 0" class="empty-state">
              <p>No transactions yet. Start by creating accounts and making deposits.</p>
            </div>
          </div>
        </div>

        <div class="quick-actions glass-card">
          <h3>Quick Actions</h3>
          <div class="actions-grid">
            <a routerLink="/customers/new" class="action-btn" id="action-add-customer">
              <span class="action-icon">👤</span>
              <span>Add Customer</span>
            </a>
            <a routerLink="/transactions" class="action-btn" id="action-view-txn">
              <span class="action-icon">💳</span>
              <span>View Txns</span>
            </a>
          </div>
        </div>
      </div>

      <div class="recent-customers glass-card" style="margin-top: 24px;">
        <div class="section-header">
          <h3>Recent Customers</h3>
          <a routerLink="/customers" class="view-all">View All →</a>
        </div>
        <div class="table-container">
          <table *ngIf="recentCustomers.length > 0">
            <thead>
              <tr>
                <th>Name</th>
                <th>SSN ID</th>
                <th>Email</th>
                <th>Bank Account No</th>
                <th>PAN No</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of recentCustomers">
                <td class="name-cell"><div class="avatar-sm">{{ c.firstName?.charAt(0) }}{{ c.lastName?.charAt(0) }}</div><span>{{ c.firstName }} {{ c.lastName }}</span></td>
                <td><span class="badge badge-info">{{ c.snnId }}</span></td>
                <td>{{ c.email }}</td>
                <td><code>{{ c.bankAccountNo || '—' }}</code></td>
                <td><code>{{ c.panNo || '—' }}</code></td>
                <td>{{ c.contact || '—' }}</td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="recentCustomers.length === 0" class="empty-state">
            <p>No customers registered yet.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { animation: fadeIn 0.4s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .dashboard-header { margin-bottom: 32px; }
    .dashboard-header h2 { font-size: 1.8rem; font-weight: 700; color: #fff; margin: 0 0 4px 0; }
    .dashboard-header p { color: rgba(255,255,255,0.5); font-size: 0.9rem; margin: 0; }

    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; }

    .stat-card {
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.3s ease;
    }
    .stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }

    .stat-icon {
      width: 52px; height: 52px;
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      color: white;
    }
    .customers-card .stat-icon { background: linear-gradient(135deg, #667eea, #764ba2); }
    .accounts-card .stat-icon { background: linear-gradient(135deg, #f7971e, #ffd200); }
    .transactions-card .stat-icon { background: linear-gradient(135deg, #11998e, #38ef7d); }
    .balance-card .stat-icon { background: linear-gradient(135deg, #00d2ff, #3a7bd5); }

    .stat-info h3 { font-size: 1.8rem; font-weight: 700; color: #fff; margin: 0; }
    .stat-info span { font-size: 0.8rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.5px; }

    .dashboard-content { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }

    .glass-card {
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 24px;
    }

    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .section-header h3 { font-size: 1.1rem; font-weight: 600; color: #fff; margin: 0; }
    .view-all { color: #667eea; font-size: 0.85rem; text-decoration: none; transition: color 0.3s; }
    .view-all:hover { color: #764ba2; }

    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.5px; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.08); }
    td { padding: 14px 16px; font-size: 0.85rem; color: rgba(255,255,255,0.8); border-bottom: 1px solid rgba(255,255,255,0.05); }
    tr:hover td { background: rgba(255,255,255,0.03); }
    .txn-id { font-family: 'Courier New', monospace; font-size: 0.8rem; color: rgba(255,255,255,0.5); }

    .badge { padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .badge-deposit { background: rgba(17,153,142,0.2); color: #38ef7d; }
    .badge-withdrawal { background: rgba(255,65,108,0.2); color: #ff416c; }
    .badge-transfer { background: rgba(102,126,234,0.2); color: #667eea; }

    .amount-credit { color: #38ef7d; }
    .amount-debit { color: #ff416c; }

    .status-badge { padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 600; }
    .status-success { background: rgba(56,239,125,0.15); color: #38ef7d; }
    .status-failed { background: rgba(255,65,108,0.15); color: #ff416c; }
    .status-pending { background: rgba(247,151,30,0.15); color: #ffd200; }

    .empty-state { padding: 40px; text-align: center; }
    .empty-state p { color: rgba(255,255,255,0.4); font-size: 0.9rem; }

    .quick-actions h3 { font-size: 1.1rem; font-weight: 600; color: #fff; margin: 0 0 20px 0; }
    .actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .action-btn {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      padding: 20px 12px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      color: rgba(255,255,255,0.8);
      text-decoration: none;
      font-size: 0.8rem;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    .action-btn:hover { background: rgba(102,126,234,0.15); border-color: rgba(102,126,234,0.3); transform: translateY(-2px); }
    .action-icon { font-size: 1.5rem; }

    .name-cell { display: flex; align-items: center; gap: 10px; }
    .avatar-sm { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: white; flex-shrink: 0; }
    code { background: rgba(255,255,255,0.06); padding: 3px 8px; border-radius: 4px; font-size: 12px; font-family: 'JetBrains Mono', monospace; }
    .badge-info { background: rgba(102,126,234,0.2); color: #667eea; }

    @media (max-width: 1200px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .dashboard-content { grid-template-columns: 1fr; } }
    @media (max-width: 768px) { .stats-grid { grid-template-columns: 1fr; } }
  `]
})
export class DashboardComponent implements OnInit {
  user: SessionUser | null = null;
  customerCount = 0;
  accountCount = 0;
  transactionCount = 0;
  totalBalance = 0;
  recentTransactions: Transaction[] = [];
  recentCustomers: Customer[] = [];

  constructor(
    private customerService: CustomerService,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getSession();

    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customerCount = data.length;
        this.recentCustomers = data.slice(-5).reverse();
        // Enrich customers with account numbers from bank-service
        this.accountService.getAll().subscribe({
          next: (accounts) => {
            const accountMap = new Map<number, string>();
            accounts.forEach(acc => {
              if (acc.customerId && acc.accountNo) {
                accountMap.set(acc.customerId, acc.accountNo);
              }
            });
            this.recentCustomers.forEach(c => {
              if (!c.bankAccountNo && accountMap.has(c.id)) {
                (c as any).bankAccountNo = accountMap.get(c.id)!;
              }
            });
          },
          error: () => {}
        });
      },
      error: () => this.customerCount = 0
    });
    this.accountService.getAll().subscribe({
      next: (data) => {
        this.accountCount = data.length;
        this.totalBalance = data.reduce((sum, a) => sum + (a.balance || 0), 0);
      },
      error: () => { this.accountCount = 0; this.totalBalance = 0; }
    });
    this.transactionService.getAll().subscribe({
      next: (data) => {
        this.transactionCount = data.length;
        this.recentTransactions = data.slice(-5).reverse();
      },
      error: () => { this.transactionCount = 0; this.recentTransactions = []; }
    });
  }
}
