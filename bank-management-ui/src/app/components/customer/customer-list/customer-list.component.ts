import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { AccountService } from '../../../services/account.service';
import { Customer } from '../../../models/customer.model';
import { BankAccount } from '../../../models/account.model';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Customers</h1>
          <p>Manage all bank customers</p>
        </div>
        <a routerLink="/customers/new" class="btn btn-primary" id="add-customer-btn">
          <span>+</span> Add Customer
        </a>
      </div>

      <div class="table-toolbar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="Search customers..." [(ngModel)]="searchTerm" (input)="filterCustomers()" id="customer-search" />
        </div>
        <div class="toolbar-info">
          <span class="record-count">{{ filteredCustomers.length }} customers</span>
        </div>
      </div>

      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
        <span>Loading customers...</span>
      </div>

      <div *ngIf="!loading && filteredCustomers.length === 0" class="empty-state glass-card">
        <div class="empty-icon">👥</div>
        <h3>No Customers Found</h3>
        <p>{{ searchTerm ? 'No customers match your search.' : 'Start by adding your first customer.' }}</p>
      </div>

      <div *ngIf="!loading && filteredCustomers.length > 0" class="table-container">
        <table>
          <thead>
            <tr>
              <th>SNN ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Bank Account No</th>
              <th>PAN No</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let customer of filteredCustomers" [attr.id]="'customer-row-' + customer.id">
              <td><span class="badge badge-info">{{ customer.snnId }}</span></td>
              <td class="name-cell">
                <div class="avatar-sm">{{ customer.firstName?.charAt(0) }}{{ customer.lastName?.charAt(0) }}</div>
                <span>{{ customer.firstName }} {{ customer.lastName }}</span>
              </td>
              <td>{{ customer.email }}</td>
              <td>{{ customer.contact || '—' }}</td>
              <td><code>{{ customer.bankAccountNo || '—' }}</code></td>
              <td><code>{{ customer.panNo || '—' }}</code></td>
              <td>
                <div class="action-buttons">
                  <a [routerLink]="['/customers/edit', customer.id]" class="btn btn-sm btn-outline" [id]="'edit-customer-' + customer.id">✏️ Edit</a>
                  <button class="btn btn-sm btn-danger" (click)="deleteCustomer(customer.id)" [id]="'delete-customer-' + customer.id">🗑️ Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="toastMessage" class="toast" [ngClass]="toastType === 'success' ? 'toast-success' : 'toast-error'">
        {{ toastMessage }}
      </div>
    </div>
  `,
  styles: [`
    .table-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      gap: 16px;
    }

    .search-box input {
      width: 320px;
    }

    .record-count {
      font-size: 13px;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .name-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .avatar-sm {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }

    code {
      background: rgba(255, 255, 255, 0.06);
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-family: 'JetBrains Mono', monospace;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }
  `]
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchTerm = '';
  loading = true;
  toastMessage = '';
  toastType = 'success';

  constructor(private customerService: CustomerService, private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers = data;
        this.filteredCustomers = data;
        this.loading = false;
        // Fetch accounts to fill in missing bankAccountNo
        this.accountService.getAll().subscribe({
          next: (accounts: BankAccount[]) => {
            const accountMap = new Map<number, string>();
            accounts.forEach(acc => {
              if (acc.customerId && acc.accountNo) {
                accountMap.set(acc.customerId, acc.accountNo);
              }
            });
            this.customers.forEach(c => {
              if (!c.bankAccountNo && accountMap.has(c.id)) {
                c.bankAccountNo = accountMap.get(c.id)!;
              }
            });
            this.filterCustomers();
          },
          error: () => {} // Silently ignore — account numbers just won't be enriched
        });
      },
      error: (err) => {
        console.error('Error loading customers:', err);
        this.loading = false;
        this.showToast('Failed to load customers', 'error');
      }
    });
  }

  filterCustomers(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredCustomers = this.customers.filter(c =>
      c.firstName?.toLowerCase().includes(term) ||
      c.lastName?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.snnId?.toLowerCase().includes(term) ||
      c.panNo?.toLowerCase().includes(term) ||
      c.bankAccountNo?.toLowerCase().includes(term) ||
      c.contact?.toLowerCase().includes(term) ||
      c.address?.toLowerCase().includes(term)
    );
  }

  deleteCustomer(id: number): void {
    if (confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      this.customerService.delete(id).subscribe({
        next: () => {
          this.showToast('Customer deleted successfully', 'success');
          this.loadCustomers();
        },
        error: (err) => {
          console.error('Error deleting customer:', err);
          this.showToast('Failed to delete customer', 'error');
        }
      });
    }
  }

  showToast(message: string, type: string): void {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => this.toastMessage = '', 3000);
  }
}
