import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-page">
      <!-- Brand Panel -->
      <div class="brand-panel">
        <div class="brand-content">
          <div class="brand-logo">
            <div class="logo-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="12" fill="url(#loginGrad)"/>
                <path d="M12 36V21L24 12L36 21V36H30V27H18V36H12Z" fill="white" fill-opacity="0.9"/>
                <defs>
                  <linearGradient id="loginGrad" x1="0" y1="0" x2="48" y2="48">
                    <stop stop-color="#667eea"/>
                    <stop offset="1" stop-color="#764ba2"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <span class="logo-text">Bank<span class="logo-gold">Sys</span></span>
              <span class="logo-tagline">Modern Banking Solutions</span>
            </div>
          </div>

          <div class="features-list">
            <div class="feature-item">
              <span class="feature-icon">🔒</span>
              <div>
                <h4>Enterprise Security</h4>
                <p>Bank-grade encryption and secure authentication</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">⚡</span>
              <div>
                <h4>Instant Transactions</h4>
                <p>Real-time deposits, withdrawals, and transfers</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📊</span>
              <div>
                <h4>Manager Controls</h4>
                <p>Full customer and account management dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Login Form Panel -->
      <div class="form-panel">
        <div class="form-container">
          <h2>Welcome Back</h2>
          <p class="form-subtitle">Sign in to your account</p>

          <!-- Role Toggle -->
          <div class="role-toggle">
            <button class="role-btn" [class.active]="selectedRole === 'customer'" (click)="selectRole('customer')" id="role-customer">
              👤 Customer
            </button>
            <button class="role-btn" [class.active]="selectedRole === 'manager'" (click)="selectRole('manager')" id="role-manager">
              👨‍💼 Manager
            </button>
          </div>

          <!-- Login Form -->
          <form (ngSubmit)="onLogin()" class="login-form" id="login-form">
            <div class="form-group">
              <label>{{ selectedRole === 'customer' ? 'Customer SSN ID' : 'Username' }}</label>
              <input type="text" [(ngModel)]="loginId" name="loginId"
                [placeholder]="selectedRole === 'customer' ? 'Enter your SSN ID' : 'Enter your username'"
                class="form-input" id="login-id" autocomplete="off">
            </div>

            <div class="form-group">
              <label>Password</label>
              <input type="password" [(ngModel)]="password" name="password"
                placeholder="Enter your password"
                class="form-input" id="login-password">
            </div>

            <div class="error-msg" *ngIf="errorMessage" [class.shake]="shakeError" id="login-error">
              ⚠️ {{ errorMessage }}
            </div>

            <button type="submit" class="btn-signin" id="btn-signin" [disabled]="isLoading">
              <span *ngIf="!isLoading">Sign In →</span>
              <span *ngIf="isLoading">Signing in...</span>
            </button>
          </form>

          <div class="form-footer" *ngIf="selectedRole === 'customer'">
            <p>New customer? <a routerLink="/register" class="link-gold">Create an account</a></p>
          </div>

          <div class="demo-box" *ngIf="selectedRole === 'manager'">
            <span class="demo-label">Demo Credentials</span>
            <code>manager1 / manager123</code>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      display: flex;
      min-height: 100vh;
      background: #0f0f1a;
    }

    .brand-panel {
      flex: 1;
      background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16162a 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px;
      position: relative;
      overflow: hidden;
    }

    .brand-panel::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle at 30% 50%, rgba(102, 126, 234, 0.08) 0%, transparent 50%);
      animation: floatGlow 8s ease-in-out infinite;
    }

    @keyframes floatGlow {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(20px, -20px); }
    }

    .brand-content {
      position: relative;
      z-index: 1;
      max-width: 420px;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 48px;
    }

    .logo-text {
      display: block;
      font-size: 28px;
      font-weight: 800;
      color: #fff;
    }

    .logo-gold {
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .logo-tagline {
      display: block;
      font-size: 12px;
      color: rgba(255,255,255,0.4);
      letter-spacing: 1px;
      text-transform: uppercase;
      font-weight: 500;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 28px;
    }

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }

    .feature-icon {
      font-size: 24px;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(102, 126, 234, 0.1);
      border: 1px solid rgba(102, 126, 234, 0.2);
      border-radius: 12px;
      flex-shrink: 0;
    }

    .feature-item h4 {
      font-size: 15px;
      font-weight: 600;
      color: #fff;
      margin-bottom: 4px;
    }

    .feature-item p {
      font-size: 13px;
      color: rgba(255,255,255,0.45);
      line-height: 1.4;
    }

    .form-panel {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px;
    }

    .form-container {
      width: 100%;
      max-width: 400px;
    }

    .form-container h2 {
      font-size: 28px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 6px;
    }

    .form-subtitle {
      color: rgba(255,255,255,0.45);
      font-size: 14px;
      margin-bottom: 32px;
    }

    .role-toggle {
      display: flex;
      gap: 8px;
      margin-bottom: 28px;
      background: rgba(255,255,255,0.04);
      padding: 4px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.08);
    }

    .role-btn {
      flex: 1;
      padding: 12px 16px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: rgba(255,255,255,0.5);
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .role-btn.active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
    }

    .role-btn:hover:not(.active) {
      background: rgba(255,255,255,0.06);
      color: rgba(255,255,255,0.8);
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255,255,255,0.6);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-input {
      padding: 14px 16px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      color: #fff;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      outline: none;
      transition: all 0.3s ease;
    }

    .form-input:focus {
      border-color: rgba(102, 126, 234, 0.5);
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      background: rgba(255,255,255,0.07);
    }

    .form-input::placeholder {
      color: rgba(255,255,255,0.25);
    }

    .error-msg {
      padding: 12px 16px;
      background: rgba(255, 65, 108, 0.1);
      border: 1px solid rgba(255, 65, 108, 0.25);
      border-radius: 10px;
      color: #ff416c;
      font-size: 13px;
      font-weight: 500;
    }

    .shake {
      animation: shakeAnim 0.5s ease;
    }

    @keyframes shakeAnim {
      0%, 100% { transform: translateX(0); }
      10%, 50%, 90% { transform: translateX(-6px); }
      30%, 70% { transform: translateX(6px); }
    }

    .btn-signin {
      padding: 14px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border: none;
      border-radius: 10px;
      color: white;
      font-family: 'Inter', sans-serif;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 4px;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.35);
    }

    .btn-signin:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
    }

    .btn-signin:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .form-footer {
      margin-top: 24px;
      text-align: center;
    }

    .form-footer p {
      color: rgba(255,255,255,0.45);
      font-size: 14px;
    }

    .link-gold {
      color: #667eea;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.3s;
    }

    .link-gold:hover {
      color: #764ba2;
    }

    .demo-box {
      margin-top: 24px;
      padding: 14px 16px;
      background: rgba(102, 126, 234, 0.08);
      border: 1px solid rgba(102, 126, 234, 0.15);
      border-radius: 10px;
      text-align: center;
    }

    .demo-label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      color: rgba(255,255,255,0.4);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 6px;
    }

    .demo-box code {
      font-size: 13px;
      color: #667eea;
      font-weight: 600;
      background: none;
    }

    @media (max-width: 768px) {
      .login-page { flex-direction: column; }
      .brand-panel { display: none; }
      .form-panel { padding: 32px 24px; }
    }
  `]
})
export class LoginComponent implements OnInit {
  selectedRole = 'customer';
  loginId = '';
  password = '';
  errorMessage = '';
  shakeError = false;
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Auto-redirect if already logged in
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getRole();
      if (role === 'manager') {
        this.router.navigate(['/dashboard']);
      } else if (role === 'customer') {
        this.router.navigate(['/my-account']);
      }
    }
  }

  selectRole(role: string): void {
    this.selectedRole = role;
    this.loginId = '';
    this.password = '';
    this.errorMessage = '';
  }

  onLogin(): void {
    if (!this.loginId.trim() || !this.password.trim()) {
      this.showError('Please fill in all fields.');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({
      loginId: this.loginId.trim(),
      password: this.password,
      role: this.selectedRole
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.authService.setSession(response);
          if (response.role === 'manager') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/my-account']);
          }
        } else {
          this.showError(response.message);
        }
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err.error?.message || (this.selectedRole === 'manager'
          ? 'Invalid manager credentials.'
          : 'Invalid SSN ID or password.');
        this.showError(msg);
      }
    });
  }

  private showError(msg: string): void {
    this.errorMessage = msg;
    this.shakeError = true;
    setTimeout(() => this.shakeError = false, 600);
  }
}
