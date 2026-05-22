import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RegisterResponse } from '../../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-page">
      <header class="reg-header">
        <a routerLink="/login" class="header-brand">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="url(#rg)"/><path d="M8 24V14L16 8L24 14V24H20V18H12V24H8Z" fill="white" fill-opacity="0.9"/><defs><linearGradient id="rg" x1="0" y1="0" x2="32" y2="32"><stop stop-color="#667eea"/><stop offset="1" stop-color="#764ba2"/></linearGradient></defs></svg>
          <span class="header-text">Bank<span class="text-accent">Sys</span></span>
        </a>
        <h1>Create Your Account</h1>
      </header>

      <!-- Registration Form -->
      <div class="reg-container" *ngIf="!showAck" id="form-section">
        <form [formGroup]="regForm" (ngSubmit)="onSubmit()" class="reg-form" id="register-form">
          <div *ngIf="formError" class="alert-error" id="reg-form-msg">⚠️ {{ formError }}</div>

          <div class="form-grid">
            <div class="fg">
              <label>Customer SSN ID *</label>
              <input type="text" formControlName="ssnId" placeholder="12-digit SSN ID" maxlength="12" class="fi" id="reg-ssn">
              <span class="fe" *ngIf="f('ssnId')">SSN ID must be exactly 12 digits</span>
            </div>
            <div class="fg">
              <label>Contact Number *</label>
              <input type="text" formControlName="contact" placeholder="10-digit mobile number" maxlength="10" class="fi" id="reg-contact">
              <span class="fe" *ngIf="f('contact')">Must be 10 digits, starting with 6-9</span>
            </div>
            <div class="fg">
              <label>First Name *</label>
              <input type="text" formControlName="firstName" placeholder="Enter first name" class="fi" id="reg-fname">
              <span class="fe" *ngIf="f('firstName')">First name is required (letters only, max 50)</span>
            </div>
            <div class="fg">
              <label>Last Name *</label>
              <input type="text" formControlName="lastName" placeholder="Enter last name" class="fi" id="reg-lname">
              <span class="fe" *ngIf="f('lastName')">Last name is required (letters only, max 50)</span>
            </div>
            <div class="fg full">
              <label>Email *</label>
              <input type="email" formControlName="email" placeholder="you@example.com" class="fi" id="reg-email">
              <span class="fe" *ngIf="f('email')">Enter a valid email address</span>
            </div>
            <div class="fg">
              <label>Password *</label>
              <input type="password" formControlName="password" placeholder="Min 8 chars, upper, lower, digit, symbol" class="fi" id="reg-password">
              <span class="fe" *ngIf="f('password')">8-30 chars: uppercase, lowercase, digit, and symbol required</span>
            </div>
            <div class="fg">
              <label>Confirm Password *</label>
              <input type="password" formControlName="confirmPassword" placeholder="Re-enter password" class="fi" id="reg-confirm">
              <span class="fe" *ngIf="f('confirmPassword') || passwordMismatch()">Passwords must match</span>
            </div>
            <div class="fg full">
              <label>Address *</label>
              <input type="text" formControlName="address" placeholder="Enter your address" maxlength="100" class="fi" id="reg-address">
              <span class="fe" *ngIf="f('address')">Address is required (max 100 chars)</span>
            </div>
            <div class="fg full">
              <label>Initial Deposit (Optional)</label>
              <input type="number" formControlName="initialDeposit" placeholder="Amount to deposit initially (e.g. 5000)" class="fi" id="reg-deposit" min="0">
              <span class="fe" *ngIf="f('initialDeposit')">Deposit cannot be negative</span>
            </div>
          </div>

          <div class="form-actions">
            <a routerLink="/login" class="btn-back">← Back to Login</a>
            <button type="submit" class="btn-register" id="btn-register" [disabled]="isLoading">
              <span *ngIf="!isLoading">Register Account →</span>
              <span *ngIf="isLoading">Registering...</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Acknowledgment Screen -->
      <div class="ack-container" *ngIf="showAck" id="ack-section">
        <div class="ack-card">
          <div class="ack-icon">✅</div>
          <h2>Registration Successful!</h2>
          <p class="ack-subtitle">Your account has been created. Here are your details:</p>

          <div class="ack-details">
            <div class="ack-row"><span class="ack-label">Customer ID</span><span class="ack-value">{{ ackData?.customerId }}</span></div>
            <div class="ack-row"><span class="ack-label">Name</span><span class="ack-value">{{ ackData?.customerName }}</span></div>
            <div class="ack-row"><span class="ack-label">Email</span><span class="ack-value">{{ ackData?.email }}</span></div>
            <div class="ack-row"><span class="ack-label">SSN ID</span><span class="ack-value">{{ ackData?.ssnId }}</span></div>
            <div class="ack-row"><span class="ack-label">Status</span><span class="ack-value ack-active">✓ Active</span></div>
          </div>

          <div class="ack-actions">
            <button (click)="registerAnother()" class="btn-another">Register Another</button>
            <a routerLink="/login" class="btn-proceed">Proceed to Login →</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-page { min-height: 100vh; background: #0f0f1a; padding: 0 24px 60px; }
    .reg-header { max-width: 700px; margin: 0 auto; padding: 32px 0 24px; }
    .header-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; margin-bottom: 20px; }
    .header-text { font-size: 20px; font-weight: 800; color: #fff; }
    .text-accent { background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .reg-header h1 { font-size: 24px; font-weight: 700; color: #fff; }

    .reg-container { max-width: 700px; margin: 0 auto; }
    .reg-form { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; }
    .alert-error { padding: 12px 16px; background: rgba(255,65,108,0.1); border: 1px solid rgba(255,65,108,0.2); border-radius: 10px; color: #ff416c; font-size: 13px; margin-bottom: 20px; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    .full { grid-column: 1 / -1; }
    .fg { display: flex; flex-direction: column; gap: 6px; }
    .fg label { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 0.5px; }
    .fi { padding: 12px 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-family: 'Inter', sans-serif; font-size: 13px; outline: none; transition: all 0.3s; }
    .fi:focus { border-color: rgba(102,126,234,0.5); box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
    .fi::placeholder { color: rgba(255,255,255,0.2); }
    .fe { font-size: 11px; color: #ff416c; }

    .form-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 28px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); }
    .btn-back { color: rgba(255,255,255,0.5); text-decoration: none; font-size: 13px; font-weight: 600; transition: color 0.3s; }
    .btn-back:hover { color: #fff; }
    .btn-register { padding: 12px 28px; background: linear-gradient(135deg, #667eea, #764ba2); border: none; border-radius: 10px; color: white; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(102,126,234,0.35); }
    .btn-register:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(102,126,234,0.5); }
    .btn-register:disabled { opacity: 0.6; cursor: not-allowed; }

    .ack-container { max-width: 560px; margin: 40px auto 0; }
    .ack-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 40px 32px; text-align: center; animation: fadeIn 0.4s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .ack-icon { font-size: 48px; margin-bottom: 16px; }
    .ack-card h2 { font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 8px; }
    .ack-subtitle { color: rgba(255,255,255,0.45); font-size: 14px; margin-bottom: 28px; }
    .ack-details { text-align: left; background: rgba(255,255,255,0.03); border-radius: 10px; padding: 4px 0; margin-bottom: 28px; }
    .ack-row { display: flex; justify-content: space-between; padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.04); }
    .ack-row:last-child { border-bottom: none; }
    .ack-label { font-size: 13px; color: rgba(255,255,255,0.45); }
    .ack-value { font-size: 13px; color: #fff; font-weight: 600; }
    .ack-active { color: #38ef7d; }
    .ack-actions { display: flex; gap: 12px; justify-content: center; }
    .btn-another { padding: 12px 24px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; color: rgba(255,255,255,0.7); font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
    .btn-another:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .btn-proceed { padding: 12px 24px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 10px; color: white; text-decoration: none; font-size: 13px; font-weight: 600; transition: all 0.3s; display: flex; align-items: center; box-shadow: 0 4px 15px rgba(102,126,234,0.35); }
    .btn-proceed:hover { transform: translateY(-2px); }

    @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } .form-actions { flex-direction: column; gap: 12px; } }
  `]
})
export class RegisterComponent {
  regForm: FormGroup;
  formError = '';
  showAck = false;
  isLoading = false;
  ackData: RegisterResponse | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.regForm = this.fb.group({
      ssnId: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      contact: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,50}$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,50}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,30}$/)]],
      confirmPassword: ['', Validators.required],
      address: ['', [Validators.required, Validators.maxLength(100)]],
      initialDeposit: [0, [Validators.min(0)]]
    });
  }

  f(field: string): boolean {
    const c = this.regForm.get(field);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  passwordMismatch(): boolean {
    const pw = this.regForm.get('password')?.value;
    const cpw = this.regForm.get('confirmPassword')?.value;
    return cpw && pw !== cpw;
  }

  onSubmit(): void {
    this.formError = '';

    if (this.regForm.invalid) {
      this.regForm.markAllAsTouched();
      this.formError = 'Please fix all validation errors.';
      return;
    }

    if (this.passwordMismatch()) {
      this.formError = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;

    const val = this.regForm.value;
    this.authService.register({
      ssnId: val.ssnId,
      firstName: val.firstName,
      lastName: val.lastName,
      email: val.email,
      contact: val.contact,
      password: val.password,
      address: val.address,
      initialDeposit: val.initialDeposit
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.ackData = res;
          this.showAck = true;
        } else {
          this.formError = res.message;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.formError = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  registerAnother(): void {
    this.showAck = false;
    this.ackData = null;
    this.regForm.reset();
    this.formError = '';
  }
}
