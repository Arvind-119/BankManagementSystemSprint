import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="navbar" id="navbar">
      <div class="navbar-left">
        <h2 class="navbar-title">Bank Management System</h2>
      </div>
      <div class="navbar-right">
        <div class="navbar-search">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="Search anything..." id="global-search" />
        </div>
        <div class="navbar-notifications" id="notifications-btn">
          <span>🔔</span>
          <span class="notification-dot"></span>
        </div>
        <div class="navbar-profile" id="profile-btn">
          <div class="profile-avatar">
            <span>AD</span>
          </div>
          <div class="profile-info">
            <span class="profile-name">Admin</span>
            <span class="profile-role">Manager</span>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      height: var(--navbar-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      background: rgba(15, 15, 26, 0.8);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .navbar-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .navbar-search {
      position: relative;
      display: flex;
      align-items: center;
    }

    .navbar-search .search-icon {
      position: absolute;
      left: 12px;
      font-size: 14px;
    }

    .navbar-search input {
      padding: 8px 16px 8px 36px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      color: var(--text-primary);
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      outline: none;
      width: 240px;
      transition: all var(--transition-normal);
    }

    .navbar-search input:focus {
      width: 300px;
      border-color: var(--accent-purple);
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .navbar-search input::placeholder {
      color: var(--text-muted);
    }

    .navbar-notifications {
      position: relative;
      cursor: pointer;
      font-size: 18px;
      padding: 8px;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }

    .navbar-notifications:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .notification-dot {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 8px;
      height: 8px;
      background: var(--accent-red);
      border-radius: 50%;
      border: 2px solid var(--bg-primary);
    }

    .navbar-profile {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 6px 12px;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }

    .navbar-profile:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .profile-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      color: white;
    }

    .profile-info {
      display: flex;
      flex-direction: column;
    }

    .profile-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.2;
    }

    .profile-role {
      font-size: 11px;
      color: var(--text-muted);
    }
  `]
})
export class NavbarComponent {}
