import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { BankAccount } from '../../models/account.model';
import { SessionUser } from '../../models/auth.model';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="cust-layout">
      <!-- Overlay -->
      <div class="sidebar-overlay" (click)="toggleSidebar()"></div>
      
      <!-- Sidebar -->
      <aside class="cust-sidebar">
        <div class="sidebar-brand">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="url(#cbg)"/><path d="M8 24V14L16 8L24 14V24H20V18H12V24H8Z" fill="white" fill-opacity="0.9"/><defs><linearGradient id="cbg" x1="0" y1="0" x2="32" y2="32"><stop stop-color="#667eea"/><stop offset="1" stop-color="#764ba2"/></linearGradient></defs></svg>
          <div><span class="brand-name">Bank<span class="brand-accent">Sys</span></span><span class="brand-sub">CUSTOMER</span></div>
        </div>
        <nav class="sidebar-nav">
          <span class="nav-section-title">OVERVIEW</span>
          <button class="nav-item" [class.active]="activeSection === 'home'" (click)="showSection('home')" id="nav-home">🏠 Home</button>
          <span class="nav-section-title">BANKING</span>
          <button class="nav-item" [class.active]="activeSection === 'deposit'" (click)="showSection('deposit')" id="nav-deposit">💵 Deposit Money</button>
          <button class="nav-item" [class.active]="activeSection === 'withdraw'" (click)="showSection('withdraw')" id="nav-withdraw">💸 Withdraw</button>
          <button class="nav-item" [class.active]="activeSection === 'transfer'" (click)="showSection('transfer')" id="nav-transfer">🔄 Transfer</button>
          <button class="nav-item" [class.active]="activeSection === 'balance'" (click)="showSection('balance')" id="nav-balance">💰 Check Balance</button>
          <button class="nav-item" [class.active]="activeSection === 'transactions'" (click)="showSection('transactions')" id="nav-transactions">📜 Transactions</button>
        </nav>
        <div class="sidebar-footer">
          <div class="footer-card">🔒<span>Secured Banking</span><small>256-bit Encryption</small></div>
        </div>
      </aside>

      <!-- Main -->
      <div class="cust-main">
        <!-- Topbar -->
        <header class="cust-topbar">
          <div style="display: flex; align-items: center;">
            <button class="mobile-menu-btn" (click)="toggleSidebar()" style="color: white; margin-right: 16px;">☰</button>
            <h2>My Account</h2>
          </div>
          <div class="topbar-right">
            <div class="user-chip" (click)="showSection('profile')" style="cursor: pointer;" title="Edit Profile">
              <div class="avatar">{{ user?.name?.charAt(0) || 'C' }}</div>
              <div><span class="user-name">{{ user?.name }}</span><span class="user-role">Customer</span></div>
            </div>
            <button class="btn-signout" (click)="signOut()" id="btn-signout">Sign Out</button>
          </div>
        </header>

        <div class="cust-content">
          <!-- HOME SECTION -->
          <div *ngIf="activeSection === 'home'" class="section" id="section-home">
            <h2 class="greeting">Good day, {{ getFirstName() }} 👋</h2>
            <div class="balance-hero">
              <div class="bh-label">Available Balance</div>
              <div class="bh-amount">₹{{ formatINR(account?.balance || 0) }}</div>
              <div class="bh-account">{{ account?.accountNo }} · <span class="status-active">● Active</span></div>
            </div>
            <div class="quick-actions">
              <button class="qa-card" (click)="showSection('deposit')"><span class="qa-icon">💵</span><span>Deposit</span></button>
              <button class="qa-card" (click)="showSection('withdraw')"><span class="qa-icon">💸</span><span>Withdraw</span></button>
              <button class="qa-card" (click)="showSection('transfer')"><span class="qa-icon">🔄</span><span>Transfer</span></button>
              <button class="qa-card" (click)="showSection('balance')"><span class="qa-icon">💰</span><span>Balance</span></button>
            </div>
          </div>

          <!-- DEPOSIT SECTION -->
          <div *ngIf="activeSection === 'deposit'" class="section" id="section-deposit">
            <h2>Deposit Money</h2>
            <p class="section-sub">Add funds to your account</p>
            <div class="live-balance" *ngIf="account">Current Balance: <strong>₹{{ formatINR(account.balance) }}</strong></div>
            <div class="op-card">
              <div class="fg"><label>Amount (₹)</label><input type="number" [(ngModel)]="depositAmount" placeholder="Enter amount (min ₹100)" min="100" id="deposit-amount" class="fi" (keydown)="blockExp($event)"></div>
              <button class="btn-action btn-success" (click)="doDeposit()" id="btn-deposit" [disabled]="opLoading">{{ opLoading ? 'Processing...' : 'Deposit Funds' }}</button>
              <div class="txn-msg" *ngIf="txnMsg" [class.msg-success]="!txnError" [class.msg-error]="txnError">{{ txnMsg }}</div>
            </div>
          </div>

          <!-- WITHDRAW SECTION -->
          <div *ngIf="activeSection === 'withdraw'" class="section" id="section-withdraw">
            <h2>Withdraw Money</h2>
            <p class="section-sub">Withdraw funds from your account</p>
            <div class="live-balance" *ngIf="account">Available Balance: <strong>₹{{ formatINR(account.balance) }}</strong></div>
            <div class="warn-box">⚠️ Minimum balance: ₹500 · Minimum withdrawal: ₹1,000</div>
            <div class="op-card">
              <div class="fg"><label>Amount (₹)</label><input type="number" [(ngModel)]="withdrawAmount" placeholder="Enter amount (min ₹1,000)" min="1000" id="withdraw-amount" class="fi" (keydown)="blockExp($event)"></div>
              <button class="btn-action btn-danger" (click)="doWithdraw()" id="btn-withdraw" [disabled]="opLoading">{{ opLoading ? 'Processing...' : 'Withdraw Funds' }}</button>
              <div class="txn-msg" *ngIf="txnMsg" [class.msg-success]="!txnError" [class.msg-error]="txnError">{{ txnMsg }}</div>
            </div>
          </div>

          <!-- TRANSFER SECTION -->
          <div *ngIf="activeSection === 'transfer'" class="section" id="section-transfer">
            <h2>Transfer Funds</h2>
            <p class="section-sub">Send money to another account</p>
            <div class="live-balance" *ngIf="account">Available Balance: <strong>₹{{ formatINR(account.balance) }}</strong></div>
            <div class="op-card">
              <div class="fg"><label>Destination Account No</label><input type="text" [(ngModel)]="transferTo" placeholder="Enter account number" id="transfer-to" class="fi"></div>
              <div class="fg"><label>Amount (₹)</label><input type="number" [(ngModel)]="transferAmount" placeholder="Enter amount" id="transfer-amount" class="fi" (keydown)="blockExp($event)"></div>
              <div class="fg"><label>Description</label><input type="text" [(ngModel)]="transferDesc" placeholder="Payment description (optional)" id="transfer-desc" class="fi"></div>
              <button class="btn-action btn-primary" (click)="doTransfer()" id="btn-transfer" [disabled]="opLoading">{{ opLoading ? 'Processing...' : 'Transfer Funds' }}</button>
              <div class="txn-msg" *ngIf="txnMsg" [class.msg-success]="!txnError" [class.msg-error]="txnError">{{ txnMsg }}</div>
            </div>
          </div>

          <!-- BALANCE SECTION -->
          <div *ngIf="activeSection === 'balance'" class="section" id="section-balance">
            <h2>Check Balance</h2>
            <div class="balance-display">
              <div class="bd-amount">₹{{ formatINR(account?.balance || 0) }}</div>
              <div class="bd-account" *ngIf="account">{{ account.accountNo }}</div>
            </div>
            <div class="details-grid" *ngIf="account">
              <div class="detail-item"><span class="dl">Account No.</span><span class="dv">{{ account.accountNo }}</span></div>
              <div class="detail-item"><span class="dl">Account Type</span><span class="dv">{{ account.accountType }}</span></div>
              <div class="detail-item"><span class="dl">Min. Balance</span><span class="dv">₹500</span></div>
              <div class="detail-item"><span class="dl">Status</span><span class="dv status-active">Active ●</span></div>
              <div class="detail-item" *ngIf="account.branchName"><span class="dl">Branch</span><span class="dv">{{ account.branchName }}</span></div>
              <div class="detail-item" *ngIf="account.ifscCode"><span class="dl">IFSC Code</span><span class="dv">{{ account.ifscCode }}</span></div>
            </div>
            <button class="btn-action btn-outline" (click)="refreshBalance()" id="btn-refresh" style="margin-top:20px;">🔄 Refresh Balance</button>
          </div>

          <!-- TRANSACTIONS SECTION -->
          <div *ngIf="activeSection === 'transactions'" class="section" id="section-transactions">
            <h2>Transactions</h2>
            <p class="section-sub">View your account transaction history</p>
            <div class="table-container glass-card" style="margin-top: 16px;">
              <table style="width: 100%; border-collapse: collapse; text-align: left;" *ngIf="transactions.length > 0">
                <thead>
                  <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <th style="padding: 12px; color: rgba(255,255,255,0.5);">Txn ID</th>
                    <th style="padding: 12px; color: rgba(255,255,255,0.5);">Details</th>
                    <th style="padding: 12px; color: rgba(255,255,255,0.5);">Amount</th>
                    <th style="padding: 12px; color: rgba(255,255,255,0.5);">Balance After</th>
                    <th style="padding: 12px; color: rgba(255,255,255,0.5);">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let txn of transactions" style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 12px; font-family: monospace;">{{ txn.transactionId }}</td>
                    <td style="padding: 12px;">
                      <div *ngIf="txn.transactionType === 'TRANSFER'">
                        <span class="type-badge type-transfer">Transfer</span>
                        <div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 4px;">Sent to: {{ txn.toAccount }}</div>
                      </div>
                      <div *ngIf="txn.transactionType === 'DEPOSIT' && txn.fromAccount">
                        <span class="type-badge type-deposit">Received</span>
                        <div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 4px;">From: {{ txn.fromAccount }}</div>
                      </div>
                      <div *ngIf="txn.transactionType === 'DEPOSIT' && !txn.fromAccount">
                        <span class="type-badge type-deposit">Deposit</span>
                      </div>
                      <div *ngIf="txn.transactionType === 'WITHDRAWAL'">
                        <span class="type-badge type-withdrawal">Withdrawal</span>
                      </div>
                    </td>
                    <td style="padding: 12px;" [ngClass]="{
                      'amount-credit': txn.transactionType === 'DEPOSIT',
                      'amount-debit': txn.transactionType === 'WITHDRAWAL' || txn.transactionType === 'TRANSFER'
                    }">
                      {{ txn.transactionType === 'DEPOSIT' ? '+' : '-' }}₹{{ txn.amount | number:'1.2-2' }}
                    </td>
                    <td style="padding: 12px;">₹{{ txn.balanceAfterTransaction | number:'1.2-2' }}</td>
                    <td style="padding: 12px;">{{ txn.transactionDate | date:'medium' }}</td>
                  </tr>
                </tbody>
              </table>
              <div *ngIf="transactions.length === 0" style="padding: 24px; text-align: center; color: rgba(255,255,255,0.5);">
                No transactions found.
              </div>
            </div>
          </div>

          <!-- PROFILE VIEW SECTION -->
          <div *ngIf="activeSection === 'profile'" class="section" id="section-profile">
            <div style="max-width: 700px; text-align: center;">
              <h2>My Profile</h2>
              <p class="section-sub">Your personal details</p>
            </div>
            <div class="op-card" style="max-width: 700px;">
              <div class="details-grid" *ngIf="customerProfile">
                <div class="detail-item"><span class="dl">Name</span><span class="dv">{{ customerProfile.firstName }} {{ customerProfile.lastName }}</span></div>
                <div class="detail-item"><span class="dl">Email</span><span class="dv">{{ customerProfile.email }}</span></div>
                <div class="detail-item"><span class="dl">Contact Number</span><span class="dv">{{ customerProfile.contact }}</span></div>
                <div class="detail-item"><span class="dl">Address</span><span class="dv">{{ customerProfile.address }}</span></div>
                <div class="detail-item"><span class="dl">SSN ID</span><span class="dv">{{ customerProfile.snnId }}</span></div>
              </div>
              <div style="margin-top: 24px; display: flex; gap: 16px;">
                <button class="btn-action btn-primary" (click)="showSection('edit-profile')">Edit Profile</button>
                <button class="btn-action btn-outline" (click)="showSection('change-password')">Change Password</button>
              </div>
            </div>
          </div>

          <!-- EDIT PROFILE SECTION -->
          <div *ngIf="activeSection === 'edit-profile'" class="section" id="section-edit-profile">
            <h2>Edit Profile</h2>
            <p class="section-sub">Update your personal details</p>
            <div class="op-card" style="max-width: 700px;">
              <form [formGroup]="profileForm" (ngSubmit)="onProfileSubmit()">
                <div class="form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 18px;">
                  <div class="fg">
                    <label>SSN ID</label>
                    <input type="text" formControlName="snnId" class="fi" readonly style="opacity: 0.7; cursor: not-allowed;" title="SSN ID cannot be changed">
                  </div>
                  <div class="fg">
                    <label>Contact Number *</label>
                    <input type="text" formControlName="contact" placeholder="10-digit mobile number" maxlength="10" class="fi">
                    <span class="fe" *ngIf="f('contact')" style="color:#ff416c; font-size:11px;">Must be 10 digits, starting with 6-9</span>
                  </div>
                  <div class="fg">
                    <label>First Name *</label>
                    <input type="text" formControlName="firstName" class="fi">
                    <span class="fe" *ngIf="f('firstName')" style="color:#ff416c; font-size:11px;">Required (letters only, max 50)</span>
                  </div>
                  <div class="fg">
                    <label>Last Name *</label>
                    <input type="text" formControlName="lastName" class="fi">
                    <span class="fe" *ngIf="f('lastName')" style="color:#ff416c; font-size:11px;">Required (letters only, max 50)</span>
                  </div>
                  <div class="fg" style="grid-column: 1 / -1;">
                    <label>Email *</label>
                    <input type="email" formControlName="email" class="fi">
                    <span class="fe" *ngIf="f('email')" style="color:#ff416c; font-size:11px;">Enter a valid email address</span>
                  </div>
                  <div class="fg" style="grid-column: 1 / -1;">
                    <label>Address *</label>
                    <input type="text" formControlName="address" class="fi" maxlength="100">
                    <span class="fe" *ngIf="f('address')" style="color:#ff416c; font-size:11px;">Address is required (max 100 chars)</span>
                  </div>
                  <div class="fg">
                    <label>Aadhar Number</label>
                    <input type="text" formControlName="aadharNo" placeholder="12-digit Aadhar number" maxlength="12" class="fi">
                    <span class="fe" *ngIf="f('aadharNo')" style="color:#ff416c; font-size:11px;">Aadhar must be exactly 12 digits</span>
                  </div>
                  <div class="fg">
                    <label>PAN Number</label>
                    <input type="text" formControlName="panNo" placeholder="e.g. ABCDE1234F" maxlength="10" class="fi">
                    <span class="fe" *ngIf="f('panNo')" style="color:#ff416c; font-size:11px;">PAN must be 10 characters</span>
                  </div>
                  <div class="fg">
                    <label>Date of Birth</label>
                    <input type="date" formControlName="dateOfBirth" class="fi">
                  </div>
                  <div class="fg">
                    <label>Gender</label>
                    <select formControlName="gender" class="fi" style="appearance: none; background-image: url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23ffffff50\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E'); background-repeat: no-repeat; background-position: right 14px center;">
                      <option value="" style="background:#1a1a2e">Select Gender</option>
                      <option value="Male" style="background:#1a1a2e">Male</option>
                      <option value="Female" style="background:#1a1a2e">Female</option>
                      <option value="Other" style="background:#1a1a2e">Other</option>
                    </select>
                  </div>
                  <div class="fg" style="grid-column: 1 / -1;">
                    <label>Marital Status</label>
                    <select formControlName="maritalStatus" class="fi" style="appearance: none; background-image: url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23ffffff50\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E'); background-repeat: no-repeat; background-position: right 14px center;">
                      <option value="" style="background:#1a1a2e">Select Status</option>
                      <option value="Single" style="background:#1a1a2e">Single</option>
                      <option value="Married" style="background:#1a1a2e">Married</option>
                      <option value="Divorced" style="background:#1a1a2e">Divorced</option>
                      <option value="Widowed" style="background:#1a1a2e">Widowed</option>
                    </select>
                  </div>
                </div>

                <div style="margin-top: 24px; display: flex; gap: 12px;">
                  <button type="submit" class="btn-action btn-primary" [disabled]="profileLoading">{{ profileLoading ? 'Updating...' : 'Update Profile' }}</button>
                  <button type="button" class="btn-action btn-outline" (click)="showSection('profile')">Cancel</button>
                </div>
                <div class="txn-msg" *ngIf="profileMsg" [class.msg-success]="!profileError" [class.msg-error]="profileError" style="margin-top: 16px;">{{ profileMsg }}</div>
              </form>
            </div>
          </div>

          <!-- CHANGE PASSWORD SECTION -->
          <div *ngIf="activeSection === 'change-password'" class="section" id="section-change-password">
            <h2>Change Password</h2>
            <p class="section-sub">Update your account password</p>
            <div class="op-card" style="max-width: 480px;">
              <form [formGroup]="passwordForm" (ngSubmit)="onPasswordSubmit()">
                <div class="fg">
                  <label>New Password *</label>
                  <input type="password" formControlName="newPassword" placeholder="Min 8 chars, upper, lower, digit, symbol" class="fi">
                  <span class="fe" *ngIf="fp('newPassword')" style="color:#ff416c; font-size:11px;">8-30 chars: uppercase, lowercase, digit, and symbol</span>
                </div>
                <div class="fg">
                  <label>Confirm New Password *</label>
                  <input type="password" formControlName="confirmNewPassword" placeholder="Re-enter new password" class="fi">
                  <span class="fe" *ngIf="fp('confirmNewPassword') || passMismatch()" style="color:#ff416c; font-size:11px;">Passwords must match</span>
                </div>
                <div style="margin-top: 24px; display: flex; gap: 12px;">
                  <button type="submit" class="btn-action btn-primary" [disabled]="passLoading">{{ passLoading ? 'Updating...' : 'Change Password' }}</button>
                  <button type="button" class="btn-action btn-outline" (click)="showSection('profile')">Cancel</button>
                </div>
                <div class="txn-msg" *ngIf="passMsg" [class.msg-success]="!passError" [class.msg-error]="passError" style="margin-top: 16px;">{{ passMsg }}</div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .cust-layout { display: flex; min-height: 100vh; background: #0f0f1a; }

    /* Sidebar */
    .cust-sidebar { width: 260px; position: fixed; left: 0; top: 0; height: 100vh; background: linear-gradient(180deg, #1a1a2e 0%, #16162a 50%, #0f0f1a 100%); border-right: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; z-index: 100; }
    .sidebar-brand { display: flex; align-items: center; gap: 12px; padding: 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .brand-name { font-size: 18px; font-weight: 800; color: #fff; display: block; }
    .brand-accent { background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .brand-sub { display: block; font-size: 10px; color: rgba(255,255,255,0.3); font-weight: 700; letter-spacing: 2px; }
    .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; }
    .nav-section-title { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.25); letter-spacing: 1.5px; padding: 8px 16px 4px; margin-top: 8px; }
    .nav-item { display: flex; align-items: center; gap: 10px; padding: 12px 16px; margin-bottom: 2px; border-radius: 8px; color: rgba(255,255,255,0.5); background: none; border: none; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; text-align: left; width: 100%; }
    .nav-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.8); }
    .nav-item.active { background: rgba(102,126,234,0.15); color: #fff; }
    .sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }
    .footer-card { background: rgba(102,126,234,0.08); border: 1px solid rgba(102,126,234,0.15); border-radius: 10px; padding: 14px; text-align: center; font-size: 14px; }
    .footer-card span { display: block; font-size: 12px; font-weight: 600; color: #fff; margin-top: 4px; }
    .footer-card small { display: block; font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 2px; }

    /* Main */
    .cust-main { flex: 1; margin-left: 260px; display: flex; flex-direction: column; min-height: 100vh; }
    .cust-topbar { height: 70px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; background: rgba(15,15,26,0.8); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.08); position: sticky; top: 0; z-index: 50; }
    .cust-topbar h2 { font-size: 18px; font-weight: 700; color: #fff; }
    .topbar-right { display: flex; align-items: center; gap: 16px; }
    .user-chip { display: flex; align-items: center; gap: 10px; }
    .avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: white; }
    .user-name { display: block; font-size: 13px; font-weight: 600; color: #fff; line-height: 1.2; }
    .user-role { display: block; font-size: 11px; color: rgba(255,255,255,0.35); }
    .btn-signout { padding: 8px 16px; background: rgba(255,65,108,0.1); border: 1px solid rgba(255,65,108,0.2); border-radius: 8px; color: #ff416c; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
    .btn-signout:hover { background: rgba(255,65,108,0.2); }

    .cust-content { flex: 1; padding: 32px; overflow-y: auto; }
    .section { animation: fadeIn 0.3s ease; max-width: 900px; margin: 0 auto; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .section h2 { font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 4px; }
    .section-sub { color: rgba(255,255,255,0.4); font-size: 14px; margin-bottom: 20px; }

    /* Home */
    .greeting { font-size: 24px !important; margin-bottom: 24px !important; }
    .balance-hero { background: linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.15)); border: 1px solid rgba(102,126,234,0.2); border-radius: 16px; padding: 32px; margin-bottom: 28px; }
    .bh-label { font-size: 13px; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 8px; }
    .bh-amount { font-size: 40px; font-weight: 800; color: #fff; margin-bottom: 8px; }
    .bh-account { font-size: 13px; color: rgba(255,255,255,0.45); }
    .status-active { color: #38ef7d; }
    .status-warn { color: #ffd200; }
    .quick-actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .qa-card { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 24px 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; color: rgba(255,255,255,0.7); font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.3s; }
    .qa-card:hover { background: rgba(102,126,234,0.12); border-color: rgba(102,126,234,0.25); transform: translateY(-3px); color: #fff; }
    .qa-icon { font-size: 28px; }

    /* Operations */
    .live-balance { padding: 12px 16px; background: rgba(56,239,125,0.08); border: 1px solid rgba(56,239,125,0.15); border-radius: 10px; color: #38ef7d; font-size: 14px; margin-bottom: 16px; max-width: 480px; }
    .warn-box { padding: 12px 16px; background: rgba(247,151,30,0.08); border: 1px solid rgba(247,151,30,0.15); border-radius: 10px; color: #ffd200; font-size: 13px; margin-bottom: 16px; max-width: 480px; }
    .op-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 28px; max-width: 480px; }
    .fg { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
    .fg label { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.5px; }
    .fi { padding: 13px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-family: 'Inter', sans-serif; font-size: 14px; outline: none; transition: all 0.3s; }
    .fi:focus { border-color: rgba(102,126,234,0.5); box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
    .fi::placeholder { color: rgba(255,255,255,0.2); }
    .btn-action { padding: 13px 24px; border: none; border-radius: 10px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
    .btn-action:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-success { background: linear-gradient(135deg, #11998e, #38ef7d); color: #fff; box-shadow: 0 4px 12px rgba(56,239,125,0.3); }
    .btn-danger { background: linear-gradient(135deg, #ff416c, #ff4b2b); color: #fff; box-shadow: 0 4px 12px rgba(255,65,108,0.3); }
    .btn-primary { background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; box-shadow: 0 4px 12px rgba(102,126,234,0.3); }
    .btn-outline { background: transparent; color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.15); }
    .btn-action:hover:not(:disabled) { transform: translateY(-2px); }
    .txn-msg { margin-top: 16px; padding: 12px 16px; border-radius: 10px; font-size: 13px; font-weight: 500; }
    .msg-success { background: rgba(56,239,125,0.1); border: 1px solid rgba(56,239,125,0.2); color: #38ef7d; }
    .msg-error { background: rgba(255,65,108,0.1); border: 1px solid rgba(255,65,108,0.2); color: #ff416c; }

    /* Balance */
    .balance-display { text-align: center; padding: 40px; background: linear-gradient(135deg, rgba(102,126,234,0.12), rgba(118,75,162,0.12)); border: 1px solid rgba(102,126,234,0.2); border-radius: 16px; margin: 20px 0; }
    .bd-amount { font-size: 48px; font-weight: 800; color: #fff; }
    .bd-account { font-size: 14px; color: rgba(255,255,255,0.4); margin-top: 8px; font-family: 'Courier New', monospace; }
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .detail-item { padding: 16px 20px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; }
    .dl { display: block; font-size: 11px; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .dv { font-size: 14px; color: #fff; font-weight: 600; }
    .glass-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; }

    .type-badge { padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; display: inline-block; }
    .type-deposit { background: rgba(17,153,142,0.2); color: #38ef7d; }
    .type-withdrawal { background: rgba(255,65,108,0.2); color: #ff416c; }
    .type-transfer { background: rgba(102,126,234,0.2); color: #667eea; }

    @media (max-width: 900px) { 
      .quick-actions { grid-template-columns: 1fr 1fr; }
      .cust-content { padding: 20px; }
      .cust-topbar { padding: 0 16px; }
    }
    @media (max-width: 576px) { 
      .quick-actions { grid-template-columns: 1fr; } 
      .details-grid { grid-template-columns: 1fr; }
      .balance-hero { padding: 20px; }
      .bh-amount { font-size: 32px; }
      .op-card { padding: 16px; }
      .balance-display { padding: 24px 16px; }
      .bd-amount { font-size: 36px; }
    }
  `]
})
export class CustomerDashboardComponent implements OnInit {
  user: SessionUser | null = null;
  account: BankAccount | null = null;
  activeSection = 'home';
  transactions: Transaction[] = [];

  depositAmount: number | null = null;
  withdrawAmount: number | null = null;
  transferTo = '';
  transferAmount: number | null = null;
  transferDesc = '';
  txnMsg = '';
  txnError = false;
  opLoading = false;

  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  customerProfile: Customer | null = null;
  profileLoading = false;
  profileMsg = '';
  profileError = false;
  passLoading = false;
  passMsg = '';
  passError = false;

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private customerService: CustomerService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getSession();
    if (!this.user || this.user.role !== 'customer') {
      this.router.navigate(['/login']);
      return;
    }
    window.history.replaceState({ section: 'home' }, '');
    this.initProfileForm();
    this.loadAccount();
  }

  initProfileForm(): void {
    this.profileForm = this.fb.group({
      snnId: [{value: '', disabled: true}],
      contact: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,50}$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,50}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.maxLength(100)]],
      aadharNo: ['', [Validators.pattern(/^\d{12}$/)]],
      panNo: ['', [Validators.pattern(/^[A-Z]{5}\d{4}[A-Z]$/)]],
      dateOfBirth: [''],
      gender: [''],
      maritalStatus: ['']
    });

    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,30}$/)]],
      confirmNewPassword: ['', Validators.required]
    });
  }

  loadAccount(): void {
    if (this.user?.linkedCustomerId) {
      this.accountService.getByCustomer(this.user.linkedCustomerId).subscribe({
        next: (accounts) => {
          if (accounts && accounts.length > 0) {
            this.account = accounts[0];
            this.loadTransactions();
          }
        },
        error: () => { }
      });
    }
  }

  loadTransactions(): void {
    if (this.account) {
      this.transactionService.getByAccountNo(this.account.accountNo).subscribe({
        next: (txns) => { this.transactions = txns; },
        error: () => { }
      });
    }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: PopStateEvent): void {
    const section = event.state?.section || 'home';
    this.showSection(section, false);
  }

  showSection(s: string, pushToHistory: boolean = true): void {
    this.activeSection = s;
    if (pushToHistory) {
      window.history.pushState({ section: s }, '');
    }
    this.txnMsg = '';
    this.depositAmount = null;
    this.withdrawAmount = null;
    this.transferTo = '';
    this.transferAmount = null;
    this.transferDesc = '';
    
    this.profileMsg = '';
    this.profileError = false;
    this.passMsg = '';
    this.passError = false;
    
    document.body.classList.remove('sidebar-open');

    // Always reload account and transactions freshly when switching tabs
    this.loadAccount();
    
    if (s === 'profile' || s === 'edit-profile') {
      this.loadProfile();
    }
    
    if (s === 'change-password') {
      this.passwordForm.reset();
    }
  }

  loadProfile(): void {
    if (this.user?.linkedCustomerId) {
      this.customerService.getById(this.user.linkedCustomerId).subscribe({
        next: (customer) => {
          this.customerProfile = customer;
          this.profileForm.patchValue({
            snnId: customer.snnId,
            contact: customer.contact,
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            address: customer.address,
            aadharNo: customer.aadharNo,
            panNo: customer.panNo,
            dateOfBirth: customer.dateOfBirth,
            gender: customer.gender,
            maritalStatus: customer.maritalStatus
          });
        },
        error: () => {
          this.showProfileMsg('Failed to load profile data', true);
        }
      });
    }
  }

  toggleSidebar(): void {
    document.body.classList.toggle('sidebar-open');
  }

  doDeposit(): void {
    if (!this.depositAmount || this.depositAmount < 100) { this.showTxn('Minimum deposit amount is ₹100.', true); return; }
    this.opLoading = true;
    const amount = this.depositAmount;
    this.accountService.deposit(this.account!.accountNo, { amount: this.depositAmount, description: 'Self deposit' }).subscribe({
      next: (res) => { this.account = res; this.depositAmount = null; this.opLoading = false; this.loadTransactions(); this.showTxn('✅ ₹' + this.formatINR(amount) + ' — Deposit successful! New balance: ₹' + this.formatINR(res.balance), false); },
      error: (err) => { this.opLoading = false; this.showTxn(err.error?.message || 'Deposit failed.', true); }
    });
  }

  doWithdraw(): void {
    if (!this.withdrawAmount || this.withdrawAmount < 1000) { this.showTxn('Minimum withdrawal amount is ₹1,000.', true); return; }
    this.opLoading = true;
    this.accountService.withdraw(this.account!.accountNo, { amount: this.withdrawAmount, description: 'Self withdrawal' }).subscribe({
      next: (res) => { this.account = res; this.withdrawAmount = null; this.opLoading = false; this.loadTransactions(); this.showTxn('✅ Withdrawal successful! New balance: ₹' + this.formatINR(res.balance), false); },
      error: (err) => { this.opLoading = false; this.showTxn(err.error?.message || 'Withdrawal failed. Check minimum balance rules.', true); }
    });
  }

  doTransfer(): void {
    if (!this.transferTo.trim()) { this.showTxn('Please enter destination account number.', true); return; }
    if (!this.transferAmount || this.transferAmount <= 0) { this.showTxn('Please enter a valid amount.', true); return; }
    this.opLoading = true;
    this.accountService.transfer({
      fromAccountNo: this.account!.accountNo,
      toAccountNo: this.transferTo.trim(),
      amount: this.transferAmount,
      description: this.transferDesc || 'Fund transfer'
    }).subscribe({
      next: (res) => {
        this.account = res;
        this.transferTo = '';
        this.transferAmount = null;
        this.transferDesc = '';
        this.opLoading = false;
        this.loadTransactions();
        this.showTxn('✅ Transfer successful! New balance: ₹' + this.formatINR(res.balance), false);
      },
      error: (err) => { this.opLoading = false; this.showTxn(err.error?.message || 'Transfer failed.', true); }
    });
  }

  refreshBalance(): void {
    this.loadAccount();
  }

  signOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getFirstName(): string {
    if (this.user?.name) {
      const parts = this.user.name.split(' ');
      return parts[0] || 'Customer';
    }
    return 'Customer';
  }

  formatINR(val: number): string {
    return val?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00';
  }

  blockExp(e: KeyboardEvent): void {
    if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
  }

  private showTxn(msg: string, err: boolean): void {
    this.txnMsg = msg;
    this.txnError = err;
  }

  f(field: string): boolean {
    const c = this.profileForm.get(field);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  fp(field: string): boolean {
    const c = this.passwordForm.get(field);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  passMismatch(): boolean {
    const pw = this.passwordForm.get('newPassword')?.value;
    const cpw = this.passwordForm.get('confirmNewPassword')?.value;
    return !!(pw && cpw && pw !== cpw);
  }

  private showProfileMsg(msg: string, err: boolean): void {
    this.profileMsg = msg;
    this.profileError = err;
  }
  
  private showPassMsg(msg: string, err: boolean): void {
    this.passMsg = msg;
    this.passError = err;
  }

  onProfileSubmit(): void {
    this.profileMsg = '';

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.showProfileMsg('Please fix all validation errors.', true);
      return;
    }

    if (!this.customerProfile) return;

    this.profileLoading = true;
    const val = this.profileForm.getRawValue();

    const updateReq = {
      snnId: val.snnId, // gets from getRawValue even if disabled
      firstName: val.firstName,
      lastName: val.lastName,
      email: val.email,
      contact: val.contact,
      address: val.address,
      aadharNo: val.aadharNo || undefined,
      panNo: val.panNo || undefined,
      dateOfBirth: val.dateOfBirth || undefined,
      gender: val.gender || undefined,
      maritalStatus: val.maritalStatus || undefined,
      bankAccountNo: this.customerProfile.bankAccountNo // CRITICAL: preserve account no
    };

    this.customerService.update(this.customerProfile.id, updateReq).subscribe({
      next: () => {
        this.profileLoading = false;
        this.showProfileMsg('Profile updated successfully!', false);
        
        // Update user session name if changed
        if (this.user) {
          this.user.name = val.firstName + ' ' + val.lastName;
          sessionStorage.setItem('bankUser', JSON.stringify(this.user));
        }
        
        // Optionally navigate back to profile view after success
        setTimeout(() => this.showSection('profile'), 1500);
      },
      error: (err) => {
        this.profileLoading = false;
        this.showProfileMsg(err.error?.message || 'Failed to update profile.', true);
      }
    });
  }

  onPasswordSubmit(): void {
    this.passMsg = '';

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.showPassMsg('Please enter valid passwords.', true);
      return;
    }

    if (this.passMismatch()) {
      this.showPassMsg('Passwords do not match.', true);
      return;
    }

    if (!this.user) return;

    this.passLoading = true;
    const newPass = this.passwordForm.get('newPassword')?.value;

    this.authService.updatePassword({ loginId: this.user.loginId, newPassword: newPass }).subscribe({
      next: () => {
        this.passLoading = false;
        this.showPassMsg('Password changed successfully!', false);
        this.passwordForm.reset();
        
        // Optionally navigate back to profile view after success
        setTimeout(() => this.showSection('profile'), 1500);
      },
      error: (err) => {
        this.passLoading = false;
        this.showPassMsg(err.error?.message || 'Failed to update password.', true);
      }
    });
  }
}
