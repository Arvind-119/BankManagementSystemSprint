import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-brand">
        <div class="brand-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#brandGrad)"/>
            <path d="M8 24V14L16 8L24 14V24H20V18H12V24H8Z" fill="white" fill-opacity="0.9"/>
            <defs>
              <linearGradient id="brandGrad" x1="0" y1="0" x2="32" y2="32">
                <stop stop-color="#667eea"/>
                <stop offset="1" stop-color="#764ba2"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-name">BankSys</span>
          <span class="brand-sub">MANAGER</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <span class="nav-section-title">DASHBOARD</span>
        </div>

        <a routerLink="/dashboard" routerLinkActive="active" id="nav-dashboard" class="nav-item">
          <span class="nav-icon">📊</span>
          <span class="nav-text">Overview</span>
        </a>

        <div class="nav-section">
          <span class="nav-section-title">CUSTOMER MGMT</span>
        </div>

        <a routerLink="/customers" routerLinkActive="active" id="nav-customers" class="nav-item">
          <span class="nav-icon">👥</span>
          <span class="nav-text">All Customers</span>
        </a>

        <a routerLink="/customers/new" routerLinkActive="active" id="nav-add-customer" class="nav-item">
          <span class="nav-icon">➕</span>
          <span class="nav-text">Add Customer</span>
        </a>

        <div class="nav-section">
          <span class="nav-section-title">BANKING</span>
        </div>

        <a routerLink="/accounts" routerLinkActive="active" id="nav-accounts" class="nav-item">
          <span class="nav-icon">🏦</span>
          <span class="nav-text">Accounts</span>
        </a>

        <a routerLink="/transactions" routerLinkActive="active" id="nav-transactions" class="nav-item">
          <span class="nav-icon">💳</span>
          <span class="nav-text">Transactions</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="footer-card">
          <div class="footer-icon">🔒</div>
          <span class="footer-text">Secured Banking</span>
          <span class="footer-sub">256-bit Encryption</span>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-width);
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      background: linear-gradient(180deg, #1a1a2e 0%, #16162a 50%, #0f0f1a 100%);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      z-index: 100;
      overflow-y: auto;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px 20px;
      border-bottom: 1px solid var(--border-color);
    }

    .brand-icon { flex-shrink: 0; }

    .brand-text { display: flex; flex-direction: column; }

    .brand-name {
      font-size: 18px;
      font-weight: 800;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.2;
    }

    .brand-sub {
      font-size: 10px;
      color: var(--text-muted);
      font-weight: 700;
      letter-spacing: 2px;
    }

    .sidebar-nav { flex: 1; padding: 16px 12px; }

    .nav-section { padding: 0 12px; margin-bottom: 8px; margin-top: 16px; }
    .nav-section:first-child { margin-top: 0; }

    .nav-section-title {
      font-size: 10px;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      margin-bottom: 4px;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      text-decoration: none;
      transition: all var(--transition-normal);
      font-size: 14px;
      font-weight: 500;
      position: relative;
    }

    .nav-item:hover { background: rgba(255, 255, 255, 0.05); color: var(--text-primary); }

    .nav-item.active { background: rgba(102, 126, 234, 0.15); color: var(--text-primary); }

    .nav-item.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 20px;
      background: var(--gradient-primary);
      border-radius: 0 4px 4px 0;
    }

    .nav-icon { font-size: 18px; width: 24px; text-align: center; }
    .nav-text { font-size: 14px; }

    .sidebar-footer { padding: 16px 12px; border-top: 1px solid var(--border-color); }

    .footer-card {
      background: rgba(102, 126, 234, 0.08);
      border: 1px solid rgba(102, 126, 234, 0.15);
      border-radius: var(--radius-md);
      padding: 16px;
      text-align: center;
    }

    .footer-icon { font-size: 24px; margin-bottom: 8px; }
    .footer-text { display: block; font-size: 12px; font-weight: 600; color: var(--text-primary); }
    .footer-sub { display: block; font-size: 10px; color: var(--text-muted); margin-top: 2px; }
  `]
})
export class SidebarComponent {}
